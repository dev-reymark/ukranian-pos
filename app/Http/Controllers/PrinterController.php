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

    public function openCashDrawer()
    {
        try {
            // Initialize the printer
            $this->init(
                config('receiptprinter.connector_type'),
                config('receiptprinter.connector_descriptor')
            );

            // Pulse to open the cash drawer
            $this->printer->pulse(0); // Usually, 0 is the drawer number, adjust if necessary.

            return response()->json(['status' => 'success', 'message' => 'Cash drawer opened successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        } finally {
            if (isset($this->printer)) {
                $this->printer->close();
            }
        }
    }

    public function printReceiptLayout(Request $request)
    {
        try {
            // Initialize the printer
            $this->init(
                config('receiptprinter.connector_type'),
                config('receiptprinter.connector_descriptor')
            );

            // Create an instance of LookUpController and call getReceiptLayout
            $lookUpController = new LookUpController();
            $receiptLayoutResponse = $lookUpController->getReceiptLayout();

            // Check if the response is successful
            $receiptLayout = json_decode($receiptLayoutResponse->content(), true); // Decode the JSON response

            if ($receiptLayout['statusCode'] === 0) {
                return response()->json(['status' => 'error', 'message' => 'Failed to retrieve receipt layout'], 400);
            }

            // Extract receipt layout data
            $data = $receiptLayout['data'];

            // Format and print the receipt layout
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            $this->printer->text("Receipt: " . $data['Receipt_Name'] . "\n");
            $this->printer->text($data['Receipt_Header_L1'] . "\n");
            $this->printer->text($data['Receipt_Header_L2'] . "\n");
            $this->printer->text($data['Receipt_Header_L3'] . "\n");
            $this->printer->text($data['Receipt_Header_L4'] . "\n");
            $this->printer->text($data['Receipt_Header_L5'] . "\n");
            $this->printer->text("\n");
            $this->printer->text($data['Receipt_Footer_L1'] . "\n");
            $this->printer->text($data['Receipt_Footer_L2'] . "\n");
            $this->printer->text($data['Receipt_Footer_L3'] . "\n");
            $this->printer->text($data['Receipt_Footer_L4'] . "\n");
            $this->printer->text($data['Receipt_Footer_L5'] . "\n");
            $this->printer->cut();
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        } finally {
            if (isset($this->printer)) {
                $this->printer->close();
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Receipt printed successfully'], 200);
    }

    public function printReceipt()
    {
        try {
            // Get receipt layout
            $lookUpController = new LookUpController();
            $receiptLayoutResponse = $lookUpController->getReceiptLayout();

            // Decode the JSON response from getReceiptLayout
            $receiptLayout = json_decode($receiptLayoutResponse->content(), true);

            // Check if the response contains valid data
            if (!isset($receiptLayout['data'])) {
                return response()->json(['status' => 'error', 'message' => 'Failed to retrieve receipt layout'], 400);
            }

            $receipt = $receiptLayout['data'];

            // Initialize the receipt printer
            $this->init(
                config('receiptprinter.connector_type'),
                config('receiptprinter.connector_descriptor')
            );

            // Ensure headers and footers are set; fallback to empty string if null
            $headerLines = [
                $receipt['Receipt_Header_L1'] ?? '',
                $receipt['Receipt_Header_L2'] ?? '',
                $receipt['Receipt_Header_L3'] ?? ''
            ];

            $footerLines = [
                $receipt['Receipt_Footer_L1'] ?? '',
                $receipt['Receipt_Footer_L2'] ?? '',
                $receipt['Receipt_Footer_L3'] ?? '',
                $receipt['Receipt_Footer_L4'] ?? ''
            ];

            // Collect receipt content in a variable
            $receiptContent = '';

            // Print header lines
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            foreach ($headerLines as $line) {
                if (!empty($line)) {
                    $lines = explode('\\n', $line);
                    foreach ($lines as $textLine) {
                        $this->printer->text(trim($textLine) . "\n");
                        $receiptContent .= trim($textLine) . "\n";
                    }
                }
            }
            $this->printer->setEmphasis(false);
            $this->printer->feed(1);
            $receiptContent .= "\n";

            // Print invoice header
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            $this->printer->text("*** SALES INVOICE ***\n");
            $this->printer->feed(1);
            $receiptContent .= "*** SALES INVOICE ***\n\n";

            // Reset justification to left before printing items
            $this->printer->setJustification(Printer::JUSTIFY_LEFT);

            $this->printer->feed(1);
            $receiptContent .= "\n";

            // Print footer lines
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            foreach ($footerLines as $index => $line) {
                if (!empty($line)) {
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
            }

            // Cut the receipt
            $this->printer->cut();

            // Open the cash drawer
            $this->openCashDrawer();

            // Close the printer connection
            $this->printer->close();

            return response()->json(['status' => 'success', 'message' => 'Receipt printed successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        } finally {
            if (isset($this->printer)) {
                $this->printer->close();
            }
        }
    }



    public function printData(Request $request)
    {
        try {
            // Initialize the printer
            $this->init(
                config('receiptprinter.connector_type'),
                config('receiptprinter.connector_descriptor')
            );

            $this->printer->setJustification(Printer::JUSTIFY_CENTER);

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

    public function displayInNotepad(Request $request)
    {
        try {
            // Retrieve the cash draw data from the request
            $cashDrawReport = $request->input('data');

            // Decode JSON data to access report details
            $reportData = json_decode($cashDrawReport, true);

            // Initialize formatted report string
            $formattedReport = "Cash Draw Report\n";
            $formattedReport .= "-----------------------------------------\n";

            // Add cash draw period details
            if (isset($reportData['cdrawDetails'])) {
                $details = $reportData['cdrawDetails'];
                $formattedReport .= "Cashier: " . $details['Cashier_Name'] . "\n";
                $formattedReport .= "Open Date: " . $details['CDraw_Open_Date'] . "\n";
                $formattedReport .= "Close Date: " . $details['CDraw_Close_Date'] . "\n";
                $formattedReport .= "-----------------------------------------\n";
            }

            // Add payment methods (cdrawFinHistory)
            if (isset($reportData['cdrawFinHistory'])) {
                $formattedReport .= "Payment Methods\n";
                $formattedReport .= "-----------------------------------------\n";
                foreach ($reportData['cdrawFinHistory'] as $paymentMethod) {
                    $formattedReport .= $paymentMethod['MOP_Name'] . "\n";
                    $formattedReport .= "Total Amount: " . $paymentMethod['CDraw_Tot_Amount'] . "\n";
                    $formattedReport .= "Safe Drops: " . $paymentMethod['CDraw_Num_Safedrop'] . " | Total: " . $paymentMethod['CDraw_Tot_Safedrop'] . "\n";
                    $formattedReport .= "Refunds: " . $paymentMethod['CDraw_Num_Refund'] . " | Total: " . $paymentMethod['CDraw_Tot_Refund'] . "\n";
                    $formattedReport .= "-----------------------------------------\n";
                }
            }

            // Add fuel grades (cdrawGradeHist)
            if (isset($reportData['cdrawGradeHist'])) {
                $formattedReport .= "Fuel Grades\n";
                $formattedReport .= "-----------------------------------------\n";
                foreach ($reportData['cdrawGradeHist'] as $fuelGrade) {
                    $formattedReport .= $fuelGrade['Grade_Name'] . "\n";
                    $formattedReport .= "Transactions: " . $fuelGrade['CDrawGrade_Trs'] . " | Volume: " . $fuelGrade['CDrawGrade_Vol'] . " | Value: " . $fuelGrade['CDrawGrade_Val'] . "\n";
                    $formattedReport .= "-----------------------------------------\n";
                }
            }

            // Add departments (cdrawDeptHist)
            if (isset($reportData['cdrawDeptHist'])) {
                $formattedReport .= "Departments\n";
                $formattedReport .= "-----------------------------------------\n";
                foreach ($reportData['cdrawDeptHist'] as $department) {
                    $formattedReport .= $department['Dept_Name'] . "\n";
                    $formattedReport .= "Qty Sold: " . $department['CDrawDept_Qty_Sld'] . " | Val Sold: " . $department['CDrawDept_Val_Sld'] . "\n";
                    $formattedReport .= "Qty Refunded: " . $department['CDrawDept_Qty_Ref'] . " | Val Refunded: " . $department['CDrawDept_Val_Ref'] . "\n";
                    $formattedReport .= "-----------------------------------------\n";
                }
            }

            // Define the file path (ensure this path is writable)
            $filePath = storage_path('app/public/cash_draw_report.txt');

            // Write the formatted report to the file
            file_put_contents($filePath, $formattedReport);

            // Check if the OS is Windows and open the file in Notepad
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                // Command to open the file in Notepad
                exec("notepad.exe " . escapeshellarg($filePath));
            } else {
                // For non-Windows systems, you could use a different command to open the text file
                return response()->json([
                    'status' => 'error',
                    'message' => 'Notepad is only available on Windows.'
                ], 400);
            }

            // Return success response
            return response()->json([
                'status' => 'success',
                'message' => 'Cash draw report opened in Notepad for testing.',
            ], 200);
        } catch (Exception $e) {
            // Return error response if something goes wrong
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
