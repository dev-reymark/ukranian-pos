<?php

namespace App\Http\Controllers;

use App\Models\ElectricJournal;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\TransactionDetail;
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
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    private $printer;
    private $lineLength = 40;

    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'mopNames' => 'nullable|array',
            'mopPayments' => 'nullable|array',
            'taxTotal' => 'required|numeric',
            'change' => 'required|numeric',
            'subtotal' => 'required|numeric',
            'deliveryIds' => 'required|array',
            'customer' => 'required|array',
            'cardDetails' => 'nullable|array',
        ]);

        Log::info($validated);

        // Get the currently authenticated cashier
        $cashier = Auth::user();
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

            // Add discount item if DiscountedAmount and PresetName are present
            if (isset($pump['DiscountedAmount']) && isset($pump['PresetName'])) {
                TransactionItem::create([
                    'Transaction_ID' => $transaction->Transaction_ID,
                    'Item_Description' => $pump['PresetName'],
                    'Item_Number' => $itemNumber,
                    'Item_Type' => 52, // Discount
                    'Item_Price' => 0,
                    'Item_Quantity' => 1,
                    'Item_Value' => $pump['DiscountedAmount'],
                ]);
                $itemNumber++;
            }
        }
        // Add `mopPayments`
        foreach ($validated['mopPayments'] as $payment) {
            TransactionItem::create([
                'Transaction_ID' => $transaction->Transaction_ID,
                'Item_Description' => $payment['mopName'],
                'Item_Number' => $itemNumber,
                'Item_Type' => 7, // Mop
                'Item_Price' => 0,
                'Item_Quantity' => 0,
                'Item_Value' => $payment['amount'],
            ]);
            $itemNumber++;
        }
        // Add `change'
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

        // Save Card Details if provided
        if (isset($validated['cardDetails'])) {
            $fullCardNumber = $validated['cardDetails']['number'] ?? '';
            $lastFourDigits = substr($fullCardNumber, -4);

            TransactionDetail::create([
                'Transaction_ID' => $transaction->Transaction_ID,
                'CardNumber' => $lastFourDigits,  // Save only the last four digits
                'ApprovalCode' => $validated['cardDetails']['code'] ?? '',
                'CustomerName' => $validated['cardDetails']['name'] ?? '',
                'Type' => 1,
            ]);
        }

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

        // Define header lines
        $headerLines = [
            $receipt->Receipt_Header_L1,
            $receipt->Receipt_Header_L2,
            $receipt->Receipt_Header_L3,
        ];

        // Define footer lines
        $footerLines = [
            $receipt->Receipt_Footer_L1,
            $receipt->Receipt_Footer_L2,
            $receipt->Receipt_Footer_L3,
            $receipt->Receipt_Footer_L4,
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

        // Get current PH time and format in 12-hour format
        $currentTime = Carbon::now('Asia/Manila')->format('Y-m-d h:i A');

        // Format POS_ID with leading zeros (2 digits)
        $formattedPOSID = sprintf("POS # %02d", $transaction->POS_ID);

        // Format Cashier_Name
        $cashierName = trim($transaction->cashier->Cashier_Name);
        $formattedCashierName = sprintf("%-20s", $cashierName);

        // Define the field widths (half of lineLength each)
        $fieldWidth = $this->lineLength / 2;

        // Print date and POS # on one line
        $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", $currentTime, $formattedPOSID));
        $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", $currentTime, $formattedPOSID);

        // Format BIR_Trans_Number with leading zeros (9 digits)
        $formattedBIRTransNumber = sprintf("SI #%09d", $transaction->BIR_Trans_Number);

        // Print Cashier_Name and BIR Trans Number on one line
        $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", $formattedCashierName, $formattedBIRTransNumber));
        $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", $formattedCashierName, $formattedBIRTransNumber);
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

            // Print item description (left-justified)
            $this->printer->setJustification(Printer::JUSTIFY_LEFT);
            $this->printer->text(sprintf("$itemDescription\n"));
            $receiptContent .= sprintf($itemDescription);

            // Print quantity, price per liter, and total
            $this->printer->text(sprintf(
                "%-{$fieldWidth}s %{$fieldWidth}s\n",
                sprintf("%6.2fL x %6.2f P/L", $itemQuantity, $itemPrice),
                sprintf("P%6.2f", $itemTotal)
            ));
            $receiptContent .= sprintf(
                "%-{$fieldWidth}s %{$fieldWidth}s\n",
                sprintf("%6.2fL x %6.2f P/L", $itemQuantity, $itemPrice),
                sprintf("P%6.2f", $itemTotal)
            );

            $totalVolume += $itemQuantity;
        }
        $this->printer->feed(1);
        $receiptContent .= "\n";


        // Print Sale Total
        $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'Sale Total', sprintf("P%6.2f", $transaction->Sale_Total)));
        $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'Sale Total', sprintf("P%6.2f", $transaction->Sale_Total));

        // Print MOP Payments
        foreach ($transaction->items as $item) {
            if ($item->Item_Type == 7) {
                $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", $item->Item_Description, sprintf("P%6.2f", $item->Item_Value)));
                $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", $item->Item_Description, sprintf("P%6.2f", $item->Item_Value));
            }
        }

        // Print CHANGE if it exists
        if ($changeTotal > 0) {
            $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'CHANGE', sprintf("(P%6.2f)", $changeTotal)));
            $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'CHANGE', sprintf("(P%6.2f)", $changeTotal));
        }
        // Add a feed for separation
        $this->printer->feed(1);
        $receiptContent .= "\n";

        // Compute VATable Sale as Sale Total - VAT Amount
        $vatableSale = $transaction->Sale_Total - $transaction->Tax_Total;

        // Print TOTAL INVOICE
        $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'TOTAL INVOICE', sprintf("P%6.2f", $transaction->Sale_Total)));
        $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'TOTAL INVOICE', sprintf("P%6.2f", $transaction->Sale_Total));

        // Print TOTAL VOLUME
        $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'TOTAL VOLUME', sprintf("%7.2fL", $totalVolume)));
        $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'TOTAL VOLUME', sprintf("%7.2fL", $totalVolume));

        // Add a feed for separation
        $this->printer->feed(1);
        $receiptContent .= "\n";

        // Print VATable Sale
        $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'VATable Sale', sprintf("P%6.2f", $vatableSale)));
        $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'VATable Sale', sprintf("P%6.2f", $vatableSale));

        // Print VAT Amount
        $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'VAT Amount', sprintf("P%6.2f", $transaction->Tax_Total)));
        $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'VAT Amount', sprintf("P%6.2f", $transaction->Tax_Total));

        // Print VAT-Exempt Sale (todo)
        $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'VAT-Exempt Sale', sprintf("P%6.2f", 0)));
        $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'VAT-Exempt Sale', sprintf("P%6.2f", 0));

        // Print Zero Rated Sale (todo)
        $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'Zero Rated Sale', sprintf("P%6.2f", 0)));
        $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'Zero Rated Sale', sprintf("P%6.2f", 0));

        // Check if card details exist
        $transactionDetail = TransactionDetail::where('Transaction_ID', $transactionId)->first();
        if (
            $transactionDetail && isset($transactionDetail->ApprovalCode) && trim($transactionDetail->ApprovalCode) !== '' &&
            isset($transactionDetail->CardNumber) && trim($transactionDetail->CardNumber) !== ''
        ) {
            // Retrieve the card number from the database
            $cardNumber = $transactionDetail->CardNumber;

            // Get the card number from the database
            $maskedCardNumber = 'XXXX-XXXX-XXXX-' . $cardNumber;

            $this->printer->feed(1);
            $receiptContent .= "\n";

            // Print the formatted card number and related details
            $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'Card#:', $maskedCardNumber));
            $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'Card#:', $maskedCardNumber);

            $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'AppCode:', $transactionDetail->ApprovalCode));
            $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'AppCode:', $transactionDetail->ApprovalCode);

            // Print a line for the signature
            $this->printer->text(sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'Sign:', '________________________'));
            $receiptContent .= sprintf("%-{$fieldWidth}s %{$fieldWidth}s\n", 'Sign:', '________________________');
        } else {
            Log::info('Card details not provided or are empty, skipping printing of card information.');
        }

        // Add a feed for separation
        $this->printer->feed(1);
        $receiptContent .= "\n";

        // Print footer lines
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
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

        // // Save receipt content to a text file
        // $filePath = storage_path('receipts/receipt_' . $transactionId . '.txt');
        // file_put_contents($filePath, $receiptContent);

        // Cut the receipt
        $this->printer->cut();

        $this->openCashDrawer();

        // Close the printer connection
        $this->printer->close();

        // Save the receipt content to the ElectricJournal
        $this->saveToElectricJournal($transactionId, $receiptContent);

        return response()->json(['message' => 'Receipt printed successfully'], 200);
    }

    private function openCashDrawer()
    {
        $this->printer->pulse(0);
    }

    private function saveToElectricJournal($transactionId, $receiptContent)
    {
        // Retrieve or create a new ElectricJournal entry
        $journal = ElectricJournal::firstOrNew(['Transaction_ID' => $transactionId]);

        // Ensure the Transaction_ID is set
        $journal->Transaction_ID = $transactionId;
        $journal->pos_id = 1;
        $journal->Transaction_Date = Carbon::now();
        $journal->si_number = sprintf('%09d', $transactionId);
        // Prepend ***REPRINT*** to the receipt content
        $receiptContent = "*** REPRINT *** \n\n" . $receiptContent;
        $journal->Data = $receiptContent;
        $journal->print_count = 1;

        // Save the journal entry
        $journal->save();
    }
}
