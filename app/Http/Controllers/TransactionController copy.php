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
            'subtotal' => 'required|numeric',
            'deliveryIds' => 'required|array',
        ]);

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

        // Save TransactionItem
        $transactionItem = TransactionItem::create([
            'Transaction_ID' => $transaction->Transaction_ID,
            'Item_Description' => $validated['mopName'],
            'Item_Number' => 1,
            'Item_Type' => 1,
        ]);

        // Update Is_Sold to 1 for relevant PumpDeliveries
        PumpDelivery::whereIn('Delivery_ID', $validated['deliveryIds'])
            ->update(['Is_Sold' => 1]);

        return response()->json([
            'message' => 'Transaction saved successfully',
            'transaction' => $transaction->Transaction_ID,
            'transactionItem' => $transactionItem,
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

        Log::info("Printing receipt for transaction ID: $transactionId");

        // Retrieve the transaction and related items
        $transaction = Transaction::with('items')->findOrFail($transactionId);
        $receipt = Receipt::first();

        // Initialize the receipt printer
        $this->initializePrinter();

        // Print the receipt content
        $this->printHeader($receipt);
        $this->printItems($transaction->items);
        $this->printTotals($transaction);
        $this->printFooter($receipt);

        // Cut the receipt and close the printer connection
        $this->finalizePrinter();

        return response()->json(['message' => 'Receipt printed successfully'], 200);
    }

    private function initializePrinter()
    {
        $this->init(
            config('receiptprinter.connector_type'),
            config('receiptprinter.connector_descriptor')
        );
    }

    private function printHeader($receipt)
    {
        $this->printer->setTextSize(1, 1);
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);

        $this->printer->text($receipt->Receipt_Header_L1 . "\n");
        $this->printer->text($receipt->Receipt_Header_L2 . "\n");
        $this->printer->text($receipt->Receipt_Header_L3 . "\n");
        $this->printer->text($receipt->Receipt_Header_L4 . "\n");
        $this->printer->text($receipt->Receipt_Header_L5 . "\n");

        $this->printer->feed(1); // Reduce the feed to control the space after the header
    }


    private function printItems($items)
    {
        $this->printer->setTextSize(1, 1);
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);

        foreach ($items as $item) {
            $description = str_pad(substr($item->Item_Description, 0, 20), 20); // Truncate and pad to 20 chars
            $quantity = str_pad(number_format($item->Item_Quantity, 3), 6, ' ', STR_PAD_LEFT); // Right-align to 6 chars
            $price = str_pad(number_format($item->Item_Price, 2), 10, ' ', STR_PAD_LEFT); // Right-align to 10 chars
            $total = str_pad(number_format($item->Item_Value, 2), 10, ' ', STR_PAD_LEFT); // Right-align to 10 chars

            $this->printer->text("$description $quantity x $price = $total\n");
        }

        $this->printer->feed(1); // Reduce the feed to control the space after the items
    }


    private function printTotals($transaction)
    {
        $this->printer->setJustification(Printer::JUSTIFY_RIGHT);
        $this->printer->text("Subtotal: " . number_format($transaction->Sale_Total, 2) . "\n");
        $this->printer->text("Tax: " . number_format($transaction->Tax_Total, 2) . "\n");
        $this->printer->text("Total: " . number_format($transaction->Sale_Total + $transaction->Tax_Total, 2) . "\n");

        $this->printer->feed(1); // Reduce the feed to control the space after totals
    }

    private function printFooter($receipt)
    {
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);

        $this->printer->text($receipt->Receipt_Footer_L1 . "\n");
        $this->printer->text($receipt->Receipt_Footer_L2 . "\n");
        $this->printer->text($receipt->Receipt_Footer_L3 . "\n");
        $this->printer->text($receipt->Receipt_Footer_L4 . "\n");
        $this->printer->text($receipt->Receipt_Footer_L5 . "\n");

        // No feed after footer to avoid extra blank lines
    }

    private function finalizePrinter()
    {
        $this->printer->cut();
        $this->printer->close();
    }
}
