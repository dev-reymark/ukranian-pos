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

        $headerLines = [
            $receipt->Receipt_Header_L1,
            $receipt->Receipt_Header_L2,
            $receipt->Receipt_Header_L3,
        ];

        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        foreach ($headerLines as $line) {
            $lines = explode('\\n', $line);
            foreach ($lines as $textLine) {
                // Ensure UTF-8 encoding
                $this->printer->text(mb_convert_encoding(trim($textLine), 'UTF-8', 'auto'));
            }
        }
        $this->printer->setEmphasis(false);

        // Print a separator
        $this->printer->text(mb_convert_encoding("----------------------------------------\n", 'UTF-8', 'auto'));

        // Print transaction date
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);
        $this->printer->text(mb_convert_encoding("Date: " . $transaction->Transaction_Date . "\n", 'UTF-8', 'auto'));

        // Print a separator
        $this->printer->text(mb_convert_encoding("----------------------------------------\n", 'UTF-8', 'auto'));

        // Print items
        foreach ($transaction->items as $item) {
            $this->printer->text(mb_convert_encoding(sprintf(
                "%-20s %4s x ₱%7.2f\n",
                trim($item->Item_Description),
                $item->Item_Quantity,
                $item->Item_Price,
                $item->Item_Value
            ), 'UTF-8', 'auto'));
        }

        // Print totals
        $this->printer->text(mb_convert_encoding(sprintf("Sale Total: ₱%7.2f\n", $transaction->Sale_Total), 'UTF-8', 'auto'));
        $this->printer->text(mb_convert_encoding(sprintf("CASH: ₱%7.2f\n", $transaction->Tax_Total), 'UTF-8', 'auto'));
        $this->printer->text(mb_convert_encoding(sprintf("CHANGE: ₱%7.2f\n", $transaction->Tax_Total), 'UTF-8', 'auto'));

        $this->printer->text(mb_convert_encoding(sprintf("TOTAL INVOICE: ₱%7.2f\n", $transaction->Sale_Total), 'UTF-8', 'auto'));
        $this->printer->text(mb_convert_encoding(sprintf("TOTAL VOLUME: ₱%7.2f\n", $transaction->Tax_Total), 'UTF-8', 'auto'));

        // Print tax
        $this->printer->text(mb_convert_encoding(sprintf("VATable Sale: ₱%7.2f\n", $transaction->Sale_Total), 'UTF-8', 'auto'));
        $this->printer->text(mb_convert_encoding(sprintf("VAT Amount: ₱%7.2f\n", $transaction->Tax_Total), 'UTF-8', 'auto'));

        // Print footer
        $this->printer->text(mb_convert_encoding(trim($receipt->Receipt_Footer_L1) . "\n", 'UTF-8', 'auto'));
        $this->printer->text(mb_convert_encoding(trim($receipt->Receipt_Footer_L2) . "\n", 'UTF-8', 'auto'));
        $this->printer->text(mb_convert_encoding(trim($receipt->Receipt_Footer_L3) . "\n", 'UTF-8', 'auto'));
        $this->printer->text(mb_convert_encoding(trim($receipt->Receipt_Footer_L4) . "\n", 'UTF-8', 'auto'));

        // Cut the receipt
        $this->printer->cut();

        // Command to open the cash drawer
        $this->openCashDrawer();

        // Close the printer connection
        $this->printer->close();

        return response()->json(['message' => 'Receipt printed successfully'], 200);
    }

    private function openCashDrawer()
    {
        // Open the cash drawer connected to the printer
        // 0 - first pin, 1 - second pin
        // 100 and 255 are the durations in milliseconds for the drawer kick-out pulse signals
        $this->printer->pulse(0); // Open drawer on pin 2
        // $this->printer->pulse(1); // Use this if your drawer is connected to pin 5 instead
    }
}
