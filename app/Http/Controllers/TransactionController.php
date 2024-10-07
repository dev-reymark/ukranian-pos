<?php

namespace App\Http\Controllers;

use App\Models\ElectricJournal;
use App\Models\Period;
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
use DateTime;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

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
            'change' => 'nullable|numeric',
            'subtotal' => 'required|numeric',
            'deliveryIds' => 'required|array',
            'customer' => 'nullable|array',
            'cardDetails' => 'nullable|array',
        ]);

        Log::info($validated);

        // Get the currently authenticated cashier
        $cashier = Auth::user();
        if (!$cashier) {
            return response()->json(['error' => 'Cashier not authenticated'], 401);
        }

        // Fetch the active shift period for the cashier
        $periodController = new PeriodController();
        $period = new Period();
        $periodResponse = $periodController->getCshrActShiftPeriod($request, $period);
        if ($periodResponse->getData()->statusCode !== 1) {
            return response()->json(['error' => 'Failed to retrieve active period'], 500);
        }

        $activePeriod = $periodResponse->getData()->data; // Assuming this returns the period object
        $periodID = $activePeriod->Period_ID; // Fetch the actual Period_ID

        try {
            DB::beginTransaction();

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
                'Period_ID' => $periodID,
                'Cashier_ID' => $cashier->Cashier_ID,
                'BIR_Trans_Number' => $newBIRTransNumber,
            ]);
            $transaction->save();

            $transactionId = DB::getPdo()->lastInsertId();

            // Save TransactionItems using the stored procedure
            $itemNumber = 1;
            foreach ($validated['deliveryIds'] as $pump) {
                $pumpNumber = str_pad($pump['Pump'], 2, '0', STR_PAD_LEFT);
                $itemDescription = $pumpNumber . '-' . $pump['FuelGradeName'];

                // Insert the main item
                $result = DB::statement(
                    'EXEC dbo.SP_LOG_TRANSACTION_ITEM ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?',
                    [
                        (int) $transactionId,
                        (int) $itemNumber,
                        1, // ITEM_TAX_ID
                        2, // ITEM_TYPE: Post Pay Delivery
                        substr($itemDescription, 0, 20), // ITEM_DESC
                        (float) $pump['Price'],
                        (float) $pump['Volume'],
                        (float) $pump['Amount'],
                        0, // ITEM_ID
                        0, // ITEM_TAX_AMOUNT
                        0, // DELIVERY_ID
                        null, // original_item_value_pre_tax_change
                        null, // is_tax_exempt_item
                        null, // is_zero_rated_tax_item
                        null, // pos_id
                        null, // ITEM_DISCOUNT_TOTAL
                        null, // discount_code_type
                        null, // item_DB_Price
                        null  // discount_preset_id
                    ]
                );

                if (!$result) {
                    throw new \Exception('Failed to execute stored procedure for transaction item');
                }

                $itemNumber++;

                // Check if there is a discount for the current item
                if (isset($pump['DiscountedAmount']) && isset($pump['PresetName'])) {
                    if ($pump['DiscountType'] == '1') {
                        $itemPrice = $pump['PresetValue'];
                        $itemQuantity = $pump['OriginalAmount'];
                    } elseif ($pump['DiscountType'] == '2') {
                        $itemPrice = $pump['PresetValue'];
                        $itemQuantity = $pump['Volume'];
                    } elseif ($pump['DiscountType'] == '3') {
                        $itemPrice = $pump['PresetValue'];
                        $itemQuantity = 1; // Fixed quantity for discount type 3
                    } else {
                        $itemPrice = 0;
                        $itemQuantity = 1;
                    }

                    // Insert the discount item
                    $result = DB::statement(
                        'EXEC dbo.SP_LOG_TRANSACTION_ITEM ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?',
                        [
                            (int) $transactionId,
                            (int) $itemNumber,
                            1, // ITEM_TAX_ID
                            52, // ITEM_TYPE: Discount
                            substr($pump['PresetName'], 0, 20), // ITEM_DESC
                            (float) $itemPrice,
                            (float) $itemQuantity,
                            (float) $pump['DiscountedAmount'],
                            0, // ITEM_ID
                            0, // ITEM_TAX_AMOUNT
                            0, // DELIVERY_ID
                            null, // original_item_value_pre_tax_change
                            null, // is_tax_exempt_item
                            null, // is_zero_rated_tax_item
                            null, // pos_id
                            null, // ITEM_DISCOUNT_TOTAL
                            null, // discount_code_type
                            null, // item_DB_Price
                            null  // discount_preset_id
                        ]
                    );

                    if (!$result) {
                        throw new \Exception('Failed to execute stored procedure for discount item');
                    }

                    $itemNumber++;
                }
            }

            // Add `mopPayments`
            foreach ($validated['mopPayments'] as $payment) {
                $result = DB::statement(
                    'EXEC dbo.SP_LOG_TRANSACTION_ITEM ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?',
                    [
                        (int) $transactionId,
                        (int) $itemNumber,
                        1, // ITEM_TAX_ID
                        7, // ITEM_TYPE: Mop
                        substr($payment['mopName'], 0, 20), // ITEM_DESC
                        0, // ITEM_PRICE
                        0, // ITEM_QTY
                        (float) $payment['amount'],
                        0, // ITEM_ID
                        0, // ITEM_TAX_AMOUNT
                        0, // DELIVERY_ID
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                );

                if (!$result) {
                    throw new \Exception('Failed to execute stored procedure for mop payment item');
                }

                $itemNumber++;
            }

            // Add `change`
            if (isset($validated['change'])) {
                $result = DB::statement(
                    'EXEC dbo.SP_LOG_TRANSACTION_ITEM ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?',
                    [
                        (int) $transactionId,
                        (int) $itemNumber,
                        1, // ITEM_TAX_ID
                        10, // ITEM_TYPE: Change
                        'Change', // ITEM_DESC
                        0, // ITEM_PRICE
                        0, // ITEM_QTY
                        (float) $validated['change'],
                        0, // ITEM_ID
                        0, // ITEM_TAX_AMOUNT
                        0, // DELIVERY_ID
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                );

                if (!$result) {
                    throw new \Exception('Failed to execute stored procedure for change item');
                }

                $itemNumber++;
            }

            // Extract delivery IDs if they are nested objects
            $deliveryIds = array_map(function ($pump) {
                return $pump['Delivery_ID'];
            }, $validated['deliveryIds']);


            // Save Card Details if provided
            if (isset($validated['cardDetails'])) {
                TransactionDetail::create([
                    'Transaction_ID' => $transactionId, // Use the fetched Transaction_ID
                    'CardNumber' => $validated['cardDetails']['cardNumber'] ?? '',
                    'ApprovalCode' => $validated['cardDetails']['approvalCode'] ?? '',
                    'CustomerName' => $validated['customer']['name'] ?? $validated['cardDetails']['cardHolderName'] ?? '',
                    'Address' => $validated['customer']['address'] ?? '', // Added customer address
                    'TIN' => $validated['customer']['tin'] ?? '', // Added TIN
                    'BusinessStyle' => $validated['customer']['businessStyle'] ?? '', // Added business style
                    'Type' => 1,
                ]);
            }

            // Update Is_Sold to 1 for relevant PumpDeliveries
            PumpDelivery::whereIn('Delivery_ID', $deliveryIds)
                ->update(['Is_Sold' => 1]);

            DB::commit();

            // Serialize the transaction object
            // $transactionData = $transaction->toArray();

            // Clarion epoch start date (1800-12-28)
            $clarionEpoch = new DateTime('1800-12-28');
            $clarionEpochTimestamp = $clarionEpoch->getTimestamp();

            // Ensure $transaction->Transaction_Date is a valid DateTime object
            if ($transaction->Transaction_Date instanceof DateTime) {
                $transactionDate = $transaction->Transaction_Date;
            } else {
                $transactionDate = new DateTime($transaction->Transaction_Date);
            }

            // Convert Transaction_Date to UNIX timestamp
            $transactionDateTimestamp = $transactionDate->getTimestamp();

            // Calculate the Clarion date as the difference in days
            $clarionDate = floor(($transactionDateTimestamp - $clarionEpochTimestamp) / (60 * 60 * 24)) + 1;

            // Calculate the Clarion time (ticks since midnight)
            $timePart = $transactionDate->format('H:i:s');
            $timeParts = explode(':', $timePart);

            $hours = isset($timeParts[0]) ? (int)$timeParts[0] : 0;
            $minutes = isset($timeParts[1]) ? (int)$timeParts[1] : 0;
            $seconds = isset($timeParts[2]) ? (int)$timeParts[2] : 0;

            // Calculate total seconds since midnight
            $totalSecondsSinceMidnight = ($hours * 3600) + ($minutes * 60) + $seconds;

            // Convert total seconds into ticks (100 ticks = 1 second)
            $clarionTime = $totalSecondsSinceMidnight * 100;


            $transactionData = [
                'SITETRANSACTIONS' => [
                    [
                        'BRANCHID' => 1,
                        'Transaction_ID' => $transaction->Transaction_ID,
                        'Tax_Total' => $transaction->Tax_Total,
                        'Sale_Total' => $transaction->Sale_Total,
                        'POS_ID' => $transaction->POS_ID,
                        'Transaction_Number' => $transaction->Transaction_Number,
                        'Transaction_Date' => $clarionDate, // Clarion date format
                        'transaction_date_group' => [
                            'transaction_date_date' => $clarionDate, // Clarion date for the date part
                            'transaction_date_time' => $clarionTime, // Clarion time for the time part (ticks since midnight)
                        ],
                        'Period_ID' => $transaction->Period_ID,
                        'Cashier_ID' => $transaction->Cashier_ID,
                        'BIR_Trans_Number' => $transaction->BIR_Trans_Number,
                    ]
                ],
                'SiteTransactions_Action' => 'insert',
                'SiteTransactionDetails' => [
                    [
                        'BRANCHID' => 1,
                        'Transaction_ID' => $transactionId, // Use the variable instead of $transaction->Transaction_ID
                        'CustomerName' => $validated['customer']['name'] ?? $validated['cardDetails']['cardHolderName'] ?? '',
                        'CardNumber' => $validated['cardDetails']['cardNumber'] ?? '',
                        'ApprovalCode' => $validated['cardDetails']['approvalCode'] ?? '',
                        'Type' => '1',
                        'Address' => $validated['customer']['address'] ?? '', // Assuming you have this in your request
                        'TIN' => $validated['customer']['tin'] ?? '', // Assuming you have TIN in your request
                        'BusinessStyle' => $validated['customer']['businessStyle'] ?? '', // Assuming you have this in your request
                    ]
                ],
                'SiteTransaction_Details_Action' => 'insert',
                'SITETRANSACTIONITEMS' => [
                    [
                        'BRANCHID' => 1,
                        'Transaction_ID' => $transactionId,
                        'Item_Number' => $itemNumber,
                        'Item_Type' => 2,
                        'Tax_ID' => 1,
                        'Item_Description' => substr($itemDescription, 0, 20),
                        'Item_Price' => (float) $pump['Price'],
                        'Item_Quantity' => (float) $pump['Volume'],
                        'Item_Value' => (float) $pump['Amount'],
                        'Item_ID' => 0,
                        'Item_Tax_Amount' => 0,
                        'Item_Discount_Total' => null,
                        'is_tax_exempt_item' => null,
                        'is_zero_rated_tax_item' => null,
                        'Item_DB_Price' => null,
                        'Original_Item_Value' => null,
                        'GC_Number' => null,
                        'discount_preset_id' => null,
                    ]
                ],
                'SiteTransactions_Items_Action' => 'insert'
            ];


            // Log the transaction data before sending it to the external API
            Log::info('Sending transaction data to external API', ['transactionData' => $transactionData]);


            // Send the serialized transaction data to an external API
            try {
                $externalResponse = Http::post('http://172.16.12.111:8014/syncSiteTransactions', [
                    'transaction' => $transactionData,
                ]);

                if ($externalResponse->failed()) {
                    Log::error('Failed to send transaction data to external API', [
                        'response' => $externalResponse->body(),
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Exception occurred while sending transaction data to external API', [
                    'exception' => $e->getMessage(),
                ]);
            }

            return response()->json([
                'message' => 'Transaction saved successfully',
                'transaction' => $transaction->Transaction_ID,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Transaction save failed: ' . $e->getMessage());

            return response()->json(['error' => 'Failed to save transaction'], 500);
        }
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

        // Print invoice header
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printer->text("*** SALES INVOICE ***\n");
        $this->printer->feed(1); // Adds a line feed after the header
        $receiptContent .= "*** SALES INVOICE ***\n\n"; // Add header to receipt content and extra newline

        // Reset justification to left before printing items
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);

        // Initialize totals
        $totalVolume = 0;
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
            $itemValue = $item->Item_Value;

            // Check if the item is a discount or of type 52
            if ($item->Item_Type == 52 || isset($item->DiscountedAmount)) {
                // Print item description (left-justified)
                $this->printer->setJustification(Printer::JUSTIFY_LEFT);
                $this->printer->text(sprintf("%s\n", $itemDescription));
                $receiptContent .= sprintf("%s\n", $itemDescription);

                // Print Item_Value with parentheses around 'P' and value
                $this->printer->text(sprintf(
                    "%-{$fieldWidth}s %{$fieldWidth}s\n",
                    sprintf("%6.2f x %6.2f", $itemQuantity, $itemPrice),
                    sprintf("(P%6.2f)", $itemValue)
                ));
                $receiptContent .= sprintf(
                    "%-{$fieldWidth}s %{$fieldWidth}s\n",
                    sprintf("%6.2f x %6.2f", $itemQuantity, $itemPrice),
                    sprintf("(P%6.2f)", $itemValue)
                );
            } else {
                // Print item description (left-justified)
                $this->printer->setJustification(Printer::JUSTIFY_LEFT);
                $this->printer->text(sprintf("%s\n", $itemDescription));
                $receiptContent .= sprintf("%s\n", $itemDescription);

                // Print quantity, price per liter, and total with P sign
                $itemTotal = $itemQuantity * $itemPrice;
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

                // Accumulate total volume only for non-discount items
                $totalVolume += $itemQuantity;
            }
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

        // // // Define the file path
        // $filePath = storage_path("app/public/receipt_$transactionId.txt");

        // // Write content to file
        // file_put_contents($filePath, $receiptContent);

        // // Open the file with Notepad (Windows)
        // $command = "notepad " . escapeshellarg($filePath);
        // exec($command);

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
