<?php

namespace App\Http\Controllers;

use Mike42\Escpos\Printer;
use Mike42\Escpos\CapabilityProfile;
use Mike42\Escpos\PrintConnectors\CupsPrintConnector;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Exception;
use Illuminate\Http\Request;


class PrinterController extends Controller
{
    private $printer;

    public function init($connector_type, $connector_descriptor, $connector_port = 9100)
    {
        try {
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
        } catch (Exception $e) {
            throw new Exception("Printer initialization failed: " . $e->getMessage());
        }
    }

    public function checkPrinterStatus()
    {
        try {
            // Initialize the printer
            $this->init(
                config('receiptprinter.connector_type'),
                config('receiptprinter.connector_descriptor')
            );

            // If printer initialization was successful, it means the printer is connected
            $response = ['status' => 'connected'];
        } catch (Exception $e) {
            // Distinguish between different types of errors
            if (strpos($e->getMessage(), 'CupsPrintConnector') !== false) {
                $response = ['status' => 'disconnected', 'error' => 'CUPS printer not found or not accessible.'];
            } elseif (strpos($e->getMessage(), 'WindowsPrintConnector') !== false) {
                $response = ['status' => 'disconnected', 'error' => 'Windows printer not found or not accessible.'];
            } elseif (strpos($e->getMessage(), 'NetworkPrintConnector') !== false) {
                $response = ['status' => 'disconnected', 'error' => 'Network printer not found or not accessible.'];
            } elseif (strpos($e->getMessage(), 'FilePrintConnector') !== false) {
                $response = ['status' => 'disconnected', 'error' => 'File printer output could not be initialized.'];
            } else {
                // Generic error for any other kind of failure
                $response = ['status' => 'disconnected', 'error' => 'Printer configuration incorrect or printer is offline.'];
            }
        } finally {
            // Close the printer connection if it was initialized
            if (isset($this->printer)) {
                $this->printer->close();
            }
        }

        return response()->json($response, 200);
    }

    public function printData(Request $request)
    {
        try {
            // Initialize the printer
            $this->init(
                config('receiptprinter.connector_type'),
                config('receiptprinter.connector_descriptor')
            );

            // Print only the Data field
            $this->printer->text($request->input('data'));
            $this->printer->cut();
        } catch (Exception $e) {
            // Return error response if printing fails
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        } finally {
            // Ensure the printer is closed in all cases
            if (isset($this->printer)) {
                $this->printer->close();
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Print job completed successfully'], 200);
    }
}
