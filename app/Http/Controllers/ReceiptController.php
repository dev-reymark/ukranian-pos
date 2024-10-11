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

class ReceiptController extends Controller
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

    private function openCashDrawer()
    {
        $this->printer->pulse(0);
    }

    public function printCashDrawReport(Request $request)
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

            // Initialize formatted report string
            $formattedReport = "Cash Draw Report\n";
            $formattedReport .= "-----------------------------------------\n";

            // Include header lines in the report
            $formattedReport .= "Header:\n";
            foreach ($headerLines as $line) {
                if (!empty($line)) {
                    $lines = explode('\\n', $line);
                    foreach ($lines as $textLine) {
                        $formattedReport .= trim($textLine) . "\n";
                    }
                }
            }
            $formattedReport .= "-----------------------------------------\n";

            // Retrieve the cash draw data from the request
            $cashDrawReport = $request->input('data');

            // Decode JSON data to access report details
            $reportData = json_decode($cashDrawReport, true);

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

            // Include footer lines in the report
            $formattedReport .= "Footer:\n";
            foreach ($footerLines as $line) {
                if (!empty($line)) {
                    $lines = explode('\\n', $line);
                    foreach ($lines as $textLine) {
                        $formattedReport .= trim($textLine) . "\n";
                    }
                }
            }
            $formattedReport .= "-----------------------------------------\n";

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
