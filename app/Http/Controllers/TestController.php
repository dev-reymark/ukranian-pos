<?php

namespace App\Http\Controllers;

use App\Jobs\TestJob;
use App\Models\ItemType;
use Mike42\Escpos\Printer;
use Mike42\Escpos\CapabilityProfile;
use Mike42\Escpos\PrintConnectors\CupsPrintConnector;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Exception;
use Carbon\Carbon;

class TestController extends Controller
{
    private $printer;

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

    public function testPrint()
    {
        // Initialize the receipt printer
        $this->init(
            config('receiptprinter.connector_type'),
            config('receiptprinter.connector_descriptor')
        );

        // Sample receipt data
        $headerLines = [
            "Store Name",
            "Store Address",
            "City, State ZIP",
            "Phone: (123) 456-7890"
        ];

        $items = [
            ['Item' => 'Apple', 'Quantity' => 2, 'Price' => 1.50],
            ['Item' => 'Banana', 'Quantity' => 3, 'Price' => 0.75],
            ['Item' => 'Orange', 'Quantity' => 1, 'Price' => 1.00]
        ];

        $totals = [
            'Sale Total' => 6.00,
            'Cash' => 10.00,
            'Change' => 4.00
        ];

        $footerLines = [
            "Thank you for shopping!",
            "Visit us again!"
        ];

        // Print header
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        foreach ($headerLines as $line) {
            $this->printer->text($line . "\n");
        }
        $this->printer->feed(1);

        // Get current time in Manila time and format in 12-hour format
        $currentTime = Carbon::now('Asia/Manila')->format('Y-m-d h:i:s A');

        // Print date and POS #1 on one line justified between
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);
        $this->printer->text(sprintf("%-15s %15s\n", $currentTime, "POS#1"));
        $this->printer->feed(1);

        // Print items
        foreach ($items as $item) {
            $this->printer->text(sprintf(
                "%-20s %4s x P%7.2f\n",
                $item['Item'],
                $item['Quantity'],
                $item['Price']
            ));
        }
        $this->printer->feed(1);

        // Define the receipt width
        $receiptWidth = 40; // Adjust this according to your printer's width

        // Print totals with justified text
        foreach ($totals as $label => $value) {
            $this->printJustifiedText($label, $value, $receiptWidth);
        }
        $this->printer->feed(1);

        // Print footer
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        foreach ($footerLines as $line) {
            $this->printer->text($line . "\n");
        }

        // Cut the receipt
        $this->printer->cut();

        // Open the cash drawer
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

    public function getItemType()
    {
        return ItemType::all();
    }

    public function dispatchJob()
    {
        // Dispatch the TestJob
        TestJob::dispatch();

        return response()->json(['message' => 'Test job dispatched!']);
    }
}
