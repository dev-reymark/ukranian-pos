<?php

namespace App\Http\Controllers;

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
            'deliveryIds' => 'required|array',
        ]);

        Log::info($validated);

        // Get the currently authenticated cashier
        $cashier = Auth()->user();
        if (!$cashier) {
            return response()->json(['error' => 'Cashier not authenticated'], 401);
        }

        // Save Transaction
        $transaction = new Transaction([
            'Tax_Total' => $validated['taxTotal'],
            'Sale_Total' => $validated['subtotal'],
            'POS_ID' => 1,
            'Transaction_Number' => 1,
            'Transaction_Date' => now(),
            'Period_ID' => 1,
            'Cashier_ID' => $cashier->Cashier_ID,
        ]);
        $transaction->save(); // Save the transaction first

        // Save TransactionItems
        foreach ($validated['deliveryIds'] as $pump) {
            TransactionItem::create([
                'Transaction_ID' => $transaction->Transaction_ID,
                'Item_Description' => $validated['mopName'],
                'Item_Number' => 1,
                'Item_Type' => 1,
                'Item_Price' => $pump['Price'],
                'Item_Quantity' => $pump['Volume'],
                'Item_Value' => $pump['Amount'],
            ]);
        }

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

        // Print header lines
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        foreach ($headerLines as $line) {
            $lines = explode('\\n', $line);
            foreach ($lines as $textLine) {
                $this->printer->text(trim($textLine) . "\n");
            }
        }
        $this->printer->setEmphasis(false);
        $this->printer->feed(1);

        // Get current time in Manila time and format in 12-hour format
        $currentTime = Carbon::now('Asia/Manila')->format('Y-m-d h:i:s A');

        // Print date and POS #1 on one line justified between
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);
        $this->printer->text(sprintf("%-15s %15s\n", $currentTime, "POS#1"));

        // Print "DATALOGIC" and SI number on the next line justified between
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);
        $this->printer->text(sprintf("%-20s %20s\n", "DATALOGIC", "SI #0000001"));
        $this->printer->feed(1);

        // Print items
        foreach ($transaction->items as $item) {
            $this->printer->text(sprintf(
                "%-20s %4s x P%7.2f\n",
                trim($item->Item_Description),
                $item->Item_Quantity,
                $item->Item_Price
            ));
        }
        $this->printer->feed(1);

        // Define the receipt width
        $receiptWidth = 40; // Adjust this according to your printer's width

        // Print totals with justified text
        $this->printJustifiedText("Sale Total", $transaction->Sale_Total, $receiptWidth);
        $this->printJustifiedText("CASH", $transaction->Cash_Total, $receiptWidth);
        $this->printJustifiedText("CHANGE", $transaction->Change_Total, $receiptWidth);
        $this->printer->feed(1);

        $this->printJustifiedText("TOTAL INVOICE", $transaction->Sale_Total, $receiptWidth);
        $this->printJustifiedText("TOTAL VOLUME", $transaction->Volume_Total, $receiptWidth);
        $this->printer->feed(1);

        // Print tax
        $this->printJustifiedText("VATable Sale", $transaction->Sale_Total, $receiptWidth);
        $this->printJustifiedText("VAT Amount", $transaction->Tax_Total, $receiptWidth);
        $this->printJustifiedText("VAT-Exempt Sale", 0, $receiptWidth);
        $this->printJustifiedText("Zero Rated Sale", 0, $receiptWidth);
        $this->printer->feed(1);

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
            }

            if ($index === 0) {
                $this->printer->feed(1);
            }
        }

        // Cut the receipt
        $this->printer->cut();

        $this->openCashDrawer();

        // Close the printer connection
        $this->printer->close();

        return response()->json(['message' => 'Receipt printed successfully'], 200);
    }

    private function openCashDrawer()
    {

        $this->printer->pulse(0);
    }

    private function printJustifiedText($label, $value, $width)
    {
        $formattedLabel = str_pad($label, $width - 8);
        $formattedValue = sprintf("P%7.2f", $value);
        $this->printer->text($formattedLabel . $formattedValue . "\n");
    }
}
