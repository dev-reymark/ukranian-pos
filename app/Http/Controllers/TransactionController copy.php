<?php

namespace App\Http\Controllers;

use App\Models\ItemType;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\PumpDelivery;
use App\Models\Receipt;
use Mike42\Escpos\Printer;
use Mike42\Escpos\CapabilityProfile;
use Mike42\Escpos\PrintConnectors\CupsPrintConnector;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Exception;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class TransactionController extends Controller
{
    private $printer;

    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'mopName' => 'required|string',
            'taxTotal' => 'required|numeric',
            'change' => 'required|numeric',
            'subtotal' => 'required|numeric',
            'payment' => 'required|numeric',
            'deliveryIds' => 'required|array',
        ]);

        Log::info($validated);

        // Get the currently authenticated cashier
        $cashier = Auth()->user();
        if (!$cashier) {
            return response()->json(['error' => 'Cashier not authenticated'], 401);
        }

        // Get the current maximum BIR_Trans_Number and increment it
        $maxBIRTransNumber = Transaction::max('BIR_Trans_Number');
        $newBIRTransNumber = $maxBIRTransNumber ? $maxBIRTransNumber + 1 : 1;

        // Save Transaction
        $transaction = new Transaction([
            'Tax_Total' => $validated['taxTotal'],
            'Sale_Total' => $validated['subtotal'],
            'POS_ID' => 1,
            'Transaction_Number' => 1,
            'Transaction_Date' => now(),
            'Period_ID' => 1,
            'Cashier_ID' => $cashier->Cashier_ID,
            'BIR_Trans_Number' => $newBIRTransNumber,
        ]);
        $transaction->save();

        // Save TransactionItems
        $itemNumber = 1;
        foreach ($validated['deliveryIds'] as $pump) {
            $pumpNumber = str_pad($pump['Pump'], 2, '0', STR_PAD_LEFT);
            $itemDescription = $pumpNumber . '-' . $pump['FuelGradeName'];
            TransactionItem::create([
                'Transaction_ID' => $transaction->Transaction_ID,
                'Item_Description' => $itemDescription,
                'Item_Number' => $itemNumber,
                'Item_Type' => 2, // Post Pay Delivery
                'Item_Price' => $pump['Price'],
                'Item_Quantity' => $pump['Volume'],
                'Item_Value' => $pump['Amount'],
            ]);
            $itemNumber++;
        }

        // Add `mopName` and `change` as separate items
        TransactionItem::create([
            'Transaction_ID' => $transaction->Transaction_ID,
            'Item_Description' => $validated['mopName'],
            'Item_Number' => $itemNumber,
            'Item_Type' => 7, //Mop
            'Item_Price' => 0,
            'Item_Quantity' => 0,
            'Item_Value' => $validated['payment'],
        ]);
        $itemNumber++;

        TransactionItem::create([
            'Transaction_ID' => $transaction->Transaction_ID,
            'Item_Description' => 'Change',
            'Item_Number' => $itemNumber,
            'Item_Type' => 10, //Change
            'Item_Price' => 0,
            'Item_Quantity' => 0,
            'Item_Value' => $validated['change'],
        ]);
        $itemNumber++;

        // Extract delivery IDs if they are nested objects
        $deliveryIds = array_map(function ($pump) {
            return $pump['Delivery_ID'];
        }, $validated['deliveryIds']);

        // Update Is_Sold to 1 for relevant PumpDeliveries
        PumpDelivery::whereIn('Delivery_ID', $deliveryIds)
            ->update(['Is_Sold' => 1]);

        return response()->json([
            'message' => 'Transaction saved successfully',
            'transaction' => $transaction->Transaction_ID,
        ], 201);
    }

    public function init($connector_type, $connector_descriptor, $connector_port = 9100)
    {
        switch (strtolower($connector_type)) {
            case 'cups':
                $connector = new CupsPrintConnector($connector_descriptor);
                break;
            case 'windows':
                $connector = new WindowsPrintConnector($connector_descriptor);
                break;
            case 'network':
                $connector = new NetworkPrintConnector($connector_descriptor, $connector_port);
                break;
            default:
                $connector = new FilePrintConnector("php://stdout");
                break;
        }

        if ($connector) {
            // Load simple printer profile
            $profile = CapabilityProfile::load("default");
            // Connect to printer
            $this->printer = new Printer($connector, $profile);
        } else {
            throw new Exception('Invalid printer connector type. Accepted values are: cups, windows, network, file');
        }
    }

    public function getReceipt($transactionId)
    {
        $transaction = Transaction::with('items')->findOrFail($transactionId);
        $receipt = Receipt::first();

        return response()->json([
            'receipt' => $receipt,
            'transaction' => $transaction,
            'items' => $transaction->items,
        ]);
    }

    public function printReceipt($transactionId)
{
    // Retrieve transaction and receipt data
    $transaction = Transaction::with('items')->findOrFail($transactionId);
    $receipt = Receipt::first();

    // Initialize the receipt printer
    $this->init(
        config('receiptprinter.connector_type'),
        config('receiptprinter.connector_descriptor')
    );

    // Define the header lines
    $headerLines = [
        $receipt->Receipt_Header_L1,
        $receipt->Receipt_Header_L2,
        $receipt->Receipt_Header_L3,
    ];

    // Collect receipt content in a variable
    $receiptContent = '';

    // Print header lines
    $this->printer->setJustification(Printer::JUSTIFY_CENTER);
    foreach ($headerLines as $line) {
        $lines = explode('\\n', $line);
        foreach ($lines as $textLine) {
            $this->printer->text(trim($textLine) . "\n");
            $receiptContent .= trim($textLine) . "\n";
        }
    }
    $this->printer->setEmphasis(false);
    $this->printer->feed(1);
    $receiptContent .= "\n";

    // Get current time in Manila time and format in 12-hour format
    $currentTime = Carbon::now('Asia/Manila')->format('Y-m-d h:i A');

    // Format POS_ID with leading zeros (2 digits)
    $formattedPOSID = sprintf("POS#%02d", $transaction->POS_ID);
    // Format Cashier_Name and ensure it is aligned
    $cashierName = trim($transaction->cashier->Cashier_Name);
    $formattedCashierName = sprintf("%-20s", $cashierName);

    // Print date and POS #1 on one line justified between
    $this->printer->setJustification(Printer::JUSTIFY_LEFT);
    $this->printer->text(sprintf("%-15s %15s\n", $currentTime, $formattedPOSID));
    $receiptContent .= sprintf("%-15s %15s\n", $currentTime, $formattedPOSID);

    // Format BIR_Trans_Number with leading zeros (9 digits)
    $formattedBIRTransNumber = sprintf("SI #%09d", $transaction->BIR_Trans_Number);

    // Print "DATALOGIC" and SI number on the next line justified between
    $this->printer->setJustification(Printer::JUSTIFY_LEFT);
    $this->printer->text(sprintf("%-20s %20s\n", $formattedCashierName, $formattedBIRTransNumber));
    $receiptContent .= sprintf("%-20s %20s\n", $formattedCashierName, $formattedBIRTransNumber);
    $this->printer->feed(1);
    $receiptContent .= "\n";

    // Initialize totals
    $totalVolume = 0;
    $cashTotal = 0;
    $changeTotal = 0;

    // Print items, excluding CASH and CHANGE
    foreach ($transaction->items as $item) {
        if ($item->Item_Type == 7 || $item->Item_Type == 10) {
            // Accumulate cash and change totals
            if ($item->Item_Type == 7) {
                $cashTotal = $item->Item_Value;
            }
            if ($item->Item_Type == 10) {
                $changeTotal = $item->Item_Value;
            }
            continue; // Skip CASH and CHANGE items
        }

        $itemDescription = trim($item->Item_Description);
        $itemQuantity = $item->Item_Quantity;
        $itemPrice = $item->Item_Price;
        $itemTotal = $itemQuantity * $itemPrice;

        // Print item description
        $this->printer->text("$itemDescription\n");
        $receiptContent .= "$itemDescription\n";

        // Print quantity, price per liter, and total
        $this->printer->text(sprintf(
            "%-5s %7.2f L x P%7.2f P/L %5s\n",
            "",
            $itemQuantity,
            $itemPrice,
            sprintf("P%7.2f", $itemTotal)
        ));
        $receiptContent .= sprintf(
            "%-5s %7.2f L x P%7.2f P/L %5s\n",
            "",
            $itemQuantity,
            $itemPrice,
            sprintf("P%7.2f", $itemTotal)
        );

        $totalVolume += $itemQuantity;
    }
    $this->printer->feed(1);
    $receiptContent .= "\n";

    // Define the receipt width
    $receiptWidth = 40;

    // Print totals with justified text
    $this->printJustifiedText("Sale Total", $transaction->Sale_Total, $receiptWidth);
    $receiptContent .= $this->formatJustifiedText("Sale Total", $transaction->Sale_Total, $receiptWidth);

    // Print CASH and CHANGE if they exist
    if ($cashTotal > 0) {
        $this->printJustifiedText("CASH", $cashTotal, $receiptWidth);
        $receiptContent .= $this->formatJustifiedText("CASH", $cashTotal, $receiptWidth);
    }
    if ($changeTotal > 0) {
        $this->printJustifiedText("CHANGE", $changeTotal, $receiptWidth);
        $receiptContent .= $this->formatJustifiedText("CHANGE", $changeTotal, $receiptWidth);
    }

    $this->printer->feed(1);
    $receiptContent .= "\n";

    // Compute VATable Sale as Sale Total - VAT Amount
    $vatableSale = $transaction->Sale_Total - $transaction->Tax_Total;

    $this->printJustifiedText("TOTAL INVOICE", $transaction->Sale_Total, $receiptWidth);
    $receiptContent .= $this->formatJustifiedText("TOTAL INVOICE", $transaction->Sale_Total, $receiptWidth);

    $this->printJustifiedText("TOTAL VOLUME", $totalVolume, $receiptWidth);
    $receiptContent .= $this->formatJustifiedText("TOTAL VOLUME", $totalVolume, $receiptWidth);
    $this->printer->feed(1);
    $receiptContent .= "\n";

    // Print tax
    $this->printJustifiedText("VATable Sale", $vatableSale, $receiptWidth);
    $receiptContent .= $this->formatJustifiedText("VATable Sale", $vatableSale, $receiptWidth);

    $this->printJustifiedText("VAT Amount", $transaction->Tax_Total, $receiptWidth);
    $receiptContent .= $this->formatJustifiedText("VAT Amount", $transaction->Tax_Total, $receiptWidth);

    $this->printJustifiedText("VAT-Exempt Sale", 0, $receiptWidth);
    $receiptContent .= $this->formatJustifiedText("VAT-Exempt Sale", 0, $receiptWidth);

    $this->printJustifiedText("Zero Rated Sale", 0, $receiptWidth);
    $receiptContent .= $this->formatJustifiedText("Zero Rated Sale", 0, $receiptWidth);
    $this->printer->feed(1);
    $receiptContent .= "\n";

    // Print footer
    $this->printer->setJustification(Printer::JUSTIFY_CENTER);
    $footerLines = [
        $receipt->Receipt_Footer_L1,
        $receipt->Receipt_Footer_L2,
        $receipt->Receipt_Footer_L3,
        $receipt->Receipt_Footer_L4,
    ];
    foreach ($footerLines as $index => $line) {
        $lines = explode('\\n', $line);
        foreach ($lines as $textLine) {
            $this->printer->text(trim($textLine) . "\n");
            $receiptContent .= trim($textLine) . "\n";
        }

        if ($index === 0) {
            $this->printer->feed(1);
            $receiptContent .= "\n";
        }
    }

    // Define the file path
    $filePath = storage_path("app/public/receipt_$transactionId.txt");

    // Write content to file
    file_put_contents($filePath, $receiptContent);

    // Open the file with Notepad (Windows)
    $command = "notepad " . escapeshellarg($filePath);
    exec($command);

    // Cut the receipt
    // $this->printer->cut();

    // $this->openCashDrawer();

    // Close the printer connection
    // $this->printer->close();

    return response()->json(['message' => 'Receipt printed successfully'], 200);
}

private function printJustifiedText($label, $value, $width)
{
    $formattedLabel = str_pad($label, $width - 8);
    $formattedValue = sprintf("P%7.2f", $value);
    $this->printer->text($formattedLabel . $formattedValue . "\n");
}

private function formatJustifiedText($label, $value, $width)
{
    $formattedLabel = str_pad($label, $width - 8);
    $formattedValue = sprintf("P%7.2f", $value);
    return $formattedLabel . $formattedValue . "\n";
}

}

