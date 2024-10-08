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
}
