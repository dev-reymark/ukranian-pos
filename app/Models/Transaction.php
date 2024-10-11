<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Transaction extends Model
{
    protected $connection = 'sqlsrv';
    protected $table = 'Transactions';

    protected $primaryKey = 'Transaction_ID';

    public $timestamps = false;

    protected $fillable = [
        'Cashier_ID',
        'Sub_Account_ID',
        'POS_ID',
        'Transaction_Number',
        'Transaction_Date',
        'Period_ID',
        'Tax_Total',
        'Sale_Total',
        'BIR_Receipt_Type',
        'BIR_Trans_Number',
        'PO_Number',
        'Plate_Number',
        'VehicleTypeID',
        'Odometer',
        'isManual',
        'isZeroRated',
        'isRefund',
        'Attendant_ID',
        'transaction_number_reference'
    ];

    public function cashier()
    {
        return $this->belongsTo(Cashier::class, 'Cashier_ID', 'Cashier_ID');
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class, 'Transaction_ID', 'Transaction_ID');
    }

    public function posTerminal()
    {
        return $this->belongsTo(POSTerminal::class, 'POS_ID', 'POS_ID');
    }

    public function details()
    {
        return $this->hasOne(TransactionDetail::class, 'Transaction_ID', 'Transaction_ID');
    }

    public function electricJournal()
    {
        return $this->hasOne(ElectricJournal::class, 'Transaction_ID', 'Transaction_ID');
    }

    public function period()
    {
        return $this->belongsTo(Period::class, 'Period_ID', 'Period_ID');
    }

    public function getTransHistHourData($periodID)
    {
        // Use a raw query for the complex SQL, including the CTE (Common Table Expression)
        $query = DB::select("
        WITH C AS (
            SELECT 
                Transaction_ID, 
                Transaction_Date, 
                Period_ID, 
                Sale_Total, 
                BIR_Receipt_Type, 
                isRefund,
                Quantity = (SELECT SUM(TI.Item_Quantity) 
                            FROM Transaction_Items TI 
                            WHERE (TI.Item_Type = 2 OR TI.Item_Type = 53) 
                            AND TI.Transaction_ID = T.Transaction_ID)
            FROM Transactions T
        )
        SELECT 
            DATEADD(hour, DATEDIFF(hour, 0, Transaction_Date), 0) AS TransactionHour, 
            COUNT(Transaction_ID) AS transCount,  
            SUM(Sale_Total) AS saleTotal,
            SUM(Quantity) AS Quantity
        FROM C
        WHERE Period_ID = ? AND BIR_Receipt_Type IS NOT NULL
        GROUP BY DATEADD(hour, DATEDIFF(hour, 0, Transaction_Date), 0)
        ORDER BY TransactionHour ASC
    ", [$periodID]);

        // Convert result to array
        $result1 = json_decode(json_encode($query), true);

        // Get the refund data for the same period
        $result2 = $this->getTransHistHourDataForRefund($periodID);

        // Merge and calculate the differences between the two datasets
        for ($i = 0; $i < count($result1); $i++) {
            for ($ii = 0; $ii < count($result2); $ii++) {
                if ($result1[$i]["TransactionHour"] == $result2[$ii]["TransactionHour"]) {
                    $result1[$i]["transCount"] = (int)($result1[$i]["transCount"] - $result2[$ii]["transCount"]);
                    $result1[$i]["saleTotal"] = (float)($result1[$i]["saleTotal"] - $result2[$ii]["saleTotal"]);
                    $result1[$i]["Quantity"] = (float)($result1[$i]["Quantity"] - abs($result2[$ii]["Quantity"]));
                }
            }
        }

        return $result1;
    }

    public function getTransHistHourDataForRefund($periodID)
    {
        // Use a raw query for the complex SQL, including the CTE (Common Table Expression)
        $query = DB::select("
        WITH C AS (
            SELECT 
                Transaction_ID, 
                Transaction_Date, 
                Period_ID, 
                Sale_Total, 
                BIR_Receipt_Type, 
                isRefund,
                Quantity = (SELECT SUM(TI.Item_Quantity) 
                            FROM Transaction_Items TI 
                            WHERE (TI.Item_Type = 2 OR TI.Item_Type = 53) 
                            AND TI.Transaction_ID = T.Transaction_ID)
            FROM Transactions T
        )
        SELECT 
            DATEADD(hour, DATEDIFF(hour, 0, Transaction_Date), 0) AS TransactionHour, 
            COUNT(Transaction_ID) AS transCount,  
            SUM(Sale_Total) AS saleTotal,
            SUM(Quantity) AS Quantity
        FROM C
        WHERE Period_ID = ? AND isRefund = 1
        GROUP BY DATEADD(hour, DATEDIFF(hour, 0, Transaction_Date), 0)
        ORDER BY TransactionHour ASC
    ", [$periodID]);

        // Convert result to array
        return json_decode(json_encode($query), true);
    }

    public function getAttendantDeliveries($periodID)
    {
        // Get the open and close dates for the given periodID
        $openDate = DB::table('Periods')->where('Period_ID', $periodID)->value('Period_Create_TS');
        $closeDate = DB::table('Periods')->where('Period_ID', $periodID)->value('Period_Close_DT');

        // Check if openDate and closeDate are not null
        if (is_null($openDate) || is_null($closeDate)) {
            return "No period found for ID: $periodID";
        }

        // Use a raw query with a Common Table Expression (CTE)
        $query = DB::select("
        WITH C AS (
            SELECT *
            FROM Transactions 
            WHERE Transaction_Date BETWEEN ? AND ?
            AND BIR_Receipt_Type IS NOT NULL
        )
        SELECT 
            C.Attendant_ID,
            COUNT(*) AS Deliveries,
            Attendant.Attendant_Name 
        FROM C
        LEFT JOIN Attendant ON C.Attendant_ID = Attendant.Attendant_ID
        GROUP BY C.Attendant_ID, Attendant.Attendant_Name
        ORDER BY C.Attendant_ID
    ", [$openDate, $closeDate]);

        // Convert result to array
        $result = json_decode(json_encode($query), true);
        if (!$result || count($result) === 0) {
            return "No deliveries found for the specified period.";
        }
        return $result;
    }

    public function getAllTransJournal()
    {
        $transactions = DB::table('Transactions')
            ->select([
                'BIR_Trans_Number as birTransNum',
                DB::raw('RTRIM(LTRIM(Cashier_Name)) as cashierName'),
                'Transactions.POS_ID as posID',
                'Transaction_Date as transDate',
                'Sale_Total as saleTotal',
                'isRefund',
                'Transaction_ID as transactionID'
            ])
            ->leftJoin('Cashiers', 'Cashiers.Cashier_ID', '=', 'Transactions.Cashier_ID')
            ->where(function ($query) {
                $query->whereNotNull('BIR_Receipt_Type')
                    ->orWhere('isRefund', 0);
            })
            ->get();

        if ($transactions->isEmpty()) {
            return [
                'result' => false,
                'message' => 'No transactions found',
                'data' => []
            ];
        }

        return [
            'result' => true,
            'message' => 'Transactions retrieved successfully',
            'data' => $transactions
        ];
    }

    public function getTransJournal($date, $posID)
    {
        $transJourn = $this->getTransJournalByDate($date, $posID);

        if (!$transJourn->isEmpty()) {
            return response()->json([
                "result" => 1,
                "message" => "Transaction journal found",
                "data" => $transJourn
            ]);
        }

        return response()->json([
            "result" => 0,
            "message" => "Transaction journal not found"
        ]);
    }

    public function getTransJournalByDate($date, $posID)
    {
        return DB::table('Transactions')
            ->select([
                'BIR_Trans_Number as birTransNum',
                DB::raw('RTRIM(LTRIM(Cashier_Name)) as cashierName'),
                'Transactions.POS_ID as posID',
                'Transaction_Date as transDate',
                'Sale_Total as saleTotal',
                'isRefund',
                'Transaction_ID as transactionID'
            ])
            ->whereDate('Transaction_Date', $date)
            ->where('Transactions.POS_ID', $posID)
            ->where(function ($query) {
                $query->whereNotNull('BIR_Receipt_Type')
                    ->orWhere('isRefund', 1);
            })
            ->leftJoin('Cashiers', 'Cashiers.Cashier_ID', '=', 'Transactions.Cashier_ID')
            ->get();
    }


    public function addNewTransaction($cashierID, $subAccID, $posID, $date, $periodID, $taxTotal, $saleTotal, $birReceiptType, $poNum, $plateNum, $transRefund, $subAccPmt, $items, $vehicleTypeID, $odometer, $isNormalTrans, $isManual, $isZeroRated, $customerName, $address, $TIN, $businessStyle, $cardNumber, $approvalCode, $bankCode, $type, $isRefund, $attID, $isRefundOrigTransNum)
    {
        $transNum = (new POSTerminal)->getTransNumbers($posID);
        $num = $transNum->POS_Trans_Number + 1;

        $birTransNum = null;
        $nonBirTransNumber = (new POSTerminal)->getNonBirTransNumByPosId($posID);

        if ($isNormalTrans) {
            $birTransNum = $transNum->BIR_Non_Fuel_Trans_Number + 1;
            // var_dump($birTransNum);
        } else {

            $cdrawPeriodID = (new CashDrawPeriod)->getActiveCdrwPeriod($cashierID, $posID); //returns cdrawPeriodID
            $safedropCount = 1;
            $cdrawDetails = null;

            // if ($cdrawPeriodID["result"]) {
            //     $cdrawDetails = (new CashDrawPeriod)->getCashdrawSafedropDetails($cdrawPeriodID["data"]);
            //     // $birTransNum = $cdrawDetails["data"] + 1;
            // }

            // if ($cdrawDetails["result"]) {
            //     // var_dump($cdrawDetails["data"]);
            //     $birTransNum = (int)$cdrawDetails["data"] + (int)1;
            // } else {
            //     $birTransNum = $safedropCount;
            // }
        }

        if ($isRefund) {
            $birTransNum = true;
        }

        $periodID = (new Period)->getActiveShiftPeriod();

        // if($isNormalTrans){
        // 	$this->Period_DB->updateBegTransNumPerTrans($birTransNum);
        // 	$this->Period_DB->updateEndingTransNumPerTrans($birTransNum);
        // }

        $transID = NULL;

        if (!$periodID) {
            //return "P00";
            // var_dump("periodi id error");
            return false;
        }

        $transID = (new Transaction)->addNewTransaction($cashierID,
                    $subAccID,
                    $posID,
                    $num,
                    $date,
                    $periodID,
                    $taxTotal,
                    $saleTotal,
                    $birReceiptType,
                    $birTransNum,
                    $poNum,
                    $plateNum,
                    $vehicleTypeID,
                    $odometer,
                    $isManual,
                    $isZeroRated,
                    $isRefund,
                    $attID,
                    $isRefundOrigTransNum,
                    $isRefund,
                    $transRefund,
                    $customerName,
                    $address,
                    $TIN,
                    $businessStyle,
                    $cardNumber,
                    $approvalCode,
                    $bankCode,
                    $type);

        if (!$transID) {
            //return "T00";
            // var_dump("trans id error");
            return false;
        }

        $posTNRet = (new POSTerminal)->updatePOSTransNum($num, $posID);

        if (!$posTNRet) {
            //return "PT00";
            // var_dump("pos trans num error");
            return false;
        }

        if ($isNormalTrans) {

            $activePeriods = (new Period)->getAllActivePeriod();

            if (!$activePeriods) {
                return false;
            }

            for ($i = 0; $i < count($activePeriods); $i++) {
                (new PosPeriodBIRTransNum)->updateBegTransNumPerTrans($activePeriods[$i]->periodID, $posID, $birTransNum);
                (new PosPeriodBIRTransNum)->updateEndingTransNumPerTrans($activePeriods[$i]->periodID, $posID, $birTransNum);
            }

            if ($birReceiptType == 1) {
                $fuelTNRet = (new POSTerminal)->updateBIRFuelTransNum($num, $posID);

                if (!$fuelTNRet) {
                    return false;
                }
            }

            if ($birReceiptType == 2) {
                $nFuelTNRet = (new POSTerminal)->updateBIRNonFuelTransNum($birTransNum, $posID);

                if (!$nFuelTNRet) {
                    return false;
                }
            }

            $chTransRet = (new CashierHistory)->updateCashierHistTrans($cashierID, $saleTotal);

            if (!$chTransRet) {
                return false;
            }
        }

        if ($transRefund > 0) {
            $chRefRet = (new CashierHistory)->updateCashierHistRefund($transID, $transRefund);

            if (!$chRefRet) {
                return false;
            }
        }

        if ($subAccID > 0) {
            $accBalRet = (new Account)->updateAccBalance($subAccID, $subAccPmt);

            if (!$accBalRet) {
                return false;
            }

            $subAccBalRet = (new SubAccount)->updateSubAccBal($subAccID, $subAccPmt);

            if (!$subAccBalRet) {
                return false;
            }
        }

        if ($customerName != null || $address != null || $TIN != null || $businessStyle != null || $cardNumber != null || $approvalCode != null || $bankCode != null || $type != null) {
            (new TransactionDetail)->addNewTransDetail($transID, $customerName, $address, $TIN, $businessStyle, $cardNumber, $approvalCode, $bankCode, $type);
        }

        $itemsLength = count($items);
        $count = 0;

        for ($i = 0; $i < $itemsLength; $i++) {

            // $itemTaxID = $items[$i]["itemTaxID"];
            $itemTaxID = $items[$i]->itemTaxID;
            if ($itemTaxID == null) {
                $itemTaxID = "null";
            }

            $originalItemValuePreTaxChange = $items[$i]->originalItemValuePreTaxChange;
            if ($originalItemValuePreTaxChange == null) {
                $originalItemValuePreTaxChange = "null";
            }

            $itemDiscTotal = $items[$i]->itemDiscTotal;
            if ($itemDiscTotal == null) {
                $itemDiscTotal = "null";
            }

            $itemDiscCodeType = $items[$i]->itemDiscCodeType;
            if ($itemDiscCodeType == null) {
                $itemDiscCodeType = "null";
            }

            //added 11/14/2023
            $gcNumber = $items[$i]->gcNumber;
            if ($gcNumber == null) {
                $gcNumber = "null";
            }

            //var_dump($it)


            $itemNumber = $items[$i]->itemNumber;
            $itemType = $items[$i]->itemType;
            $itemDesc = $items[$i]->itemDesc;
            $itemPrice = $items[$i]->itemPrice;
            $itemQTY = $items[$i]->itemQTY;
            $itemValue = $items[$i]->itemValue;
            $itemID = $items[$i]->itemID;
            $itemTaxAmount = $items[$i]->itemTaxAmount;
            $deliveryID = $items[$i]->deliveryID;
            //$gcNumber= $items[$i]->gcNumber;
            $gcAmount = $items[$i]->gcAmount;
            // $originalItemValuePreTaxChange = $items[$i]->originalItemValuePreTaxChange;
            $isTaxExemptItem = $items[$i]->isTaxExemptItem;
            $isZeroRatedTaxItem = $items[$i]->isZeroRatedTaxItem;
            $departmentID = $items[$i]->departmentID;
            // $itemDiscTotal = $items[$i]->itemDiscTotal;

            $res = (new TransactionItem)->callTransItemsSP($transID, $itemNumber, $itemTaxID, $itemType, $itemDesc, $itemPrice, $itemQTY, $itemValue, $itemID, $itemTaxAmount, $deliveryID, $originalItemValuePreTaxChange, $isTaxExemptItem, $isZeroRatedTaxItem, $posID, $itemDiscTotal, $itemDiscCodeType, $gcNumber);

            if ($itemDiscTotal != "null" && abs($itemDiscTotal) > 0) {

                // echo "disc";

                $taxRate = (new Tax)->getTaxRate($itemTaxID) / 100;
                $taxMul = 1 + $taxRate;
                $taxDisc = (($itemValue / $taxMul) * $taxRate) - ((($itemValue + $itemDiscTotal) / $taxMul) * $taxRate);

                if ($itemType == 14) {
                    (new DepartmentHistory)->logDepDiscountSP($transID, $itemQTY, abs($itemDiscTotal), 1, $departmentID, $taxDisc);
                } elseif ($itemType == 2) {
                    (new DepartmentHistory)->logDepDiscountSP($transID, $itemQTY, abs($itemDiscTotal), 2, $itemID, $taxDisc);
                } elseif ($itemType = 53) {
                    (new DepartmentHistory)->logDepDiscountSP($transID, $itemQTY, abs($itemDiscTotal), 3, $itemID, $taxDisc);
                }
            }

            if ($isRefund) {
                // update grand total
                // $posID, $itemValue  
                if ($itemTaxID == 1) { // vatable
                    $netrefund = abs($itemValue) - abs($itemDiscTotal);
                    (new RefundGT)->incrementVatableByPosId($posID, $netrefund);
                }

                if ($itemTaxID == 2) { //vat exempt
                    if ($itemDesc != "SC Disc 5%") {
                        $netrefund = abs($itemValue) - (abs($itemDiscTotal) * 2);
                        (new RefundGT)->incrementVatExemptByPosId($posID, $netrefund);
                    }
                }

                if ($itemTaxID == 3) {
                    (new RefundGT)->incrementZeroRatedByPosId($posID, $itemValue);
                }
            }

            if ($res) {
                $count++;
            }
        }

        if ($count != $itemsLength) {
            //return "TI00";
            // var_dump("items length error");
            return false;
        }

        if ($isRefund) {
            /**
             * March 13, 2024
             */
            // return and generate new non bir transaction number
            $nonBirTransNumber = (new POSTerminal())->incrementNonBirTransNumber($posID, $nonBirTransNumber);


            /**
             * link the orig trans number to this transaction for refund
             */
            (new Transaction)->updateTransactionNumberReference($transID, $isRefundOrigTransNum);

            // update transaction
            (new Transaction)->updateBirTransNum($transID, $nonBirTransNumber);

            return [
                'or_num'        =>    $nonBirTransNumber,
                'transID' => $transID
            ];
        }
        // return $count;

        // var_dump($birTransNum + " message");

        // return (int)$transID;

        //return $birTransNum;
        //added 010320 - Mark
        return [
            'or_num' =>    $birTransNum,
            'transID' => $transID
        ];
    }

    private $transactionNumberReferenceCol = 'transaction_number_reference';

    public function updateTransactionNumberReference($transID, $val)
    {
        // Find the transaction record by its ID
        $transaction = $this->find($transID);

        if ($transaction) {
            // Update the transaction number reference
            $transaction->update([$this->transactionNumberReferenceCol => $val]);
            return true; // Return true if the update was successful
        }

        return false; // Return false if the transaction was not found
    }

    private $birTransNumCol = "BIR_Trans_Number";

    public function updateBirTransNum($transID, $val)
    {
        // Find the transaction record by its ID
        $transaction = $this->find($transID);

        if ($transaction) {
            // Update the BIR transaction number
            $transaction->update([$this->birTransNumCol => $val]);
            return true; // Return true if the update was successful
        }

        return false; // Return false if the transaction was not found
    }
}
