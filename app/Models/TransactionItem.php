<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TransactionItem extends Model
{
    protected $table = 'Transaction_Items';

    protected $primaryKey = 'Transaction_ID';

    public $timestamps = false;

    protected $fillable = [
        'Transaction_ID',
        'Item_Number',
        'Item_Type',
        'Tax_ID',
        'Item_Description',
        'Item_Price',
        'Item_Quantity',
        'Item_Value',
        'Item_ID',
        'Item_Tax_Amount',
        'Item_Discount_Total',
        'is_tax_exempt_item',
        'is_zero_rated_tax_item',
        'Item_DB_Price',
        'Original_Item_Value',
        'GC_Number',
        'discount_preset_id'
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'Transaction_ID', 'Transaction_ID');
    }

    public function itemType()
    {
        return $this->belongsTo(ItemType::class, 'Item_Type', 'Item_Type');
    }

    public function getVehicleCountReport($periodID)
    {
        // Get the open and close dates for the given periodID
        $openDate = DB::table('Periods')->where('Period_ID', $periodID)->value('Period_Create_TS');
        $closeDate = DB::table('Periods')->where('Period_ID', $periodID)->value('Period_Close_DT');

        if (is_null($openDate) || is_null($closeDate)) {
            return "No period found for ID: $periodID";
        }

        // Using Eloquent to perform the query
        $results = TransactionItem::select('Transaction_Items.*', 'Transactions.VehicleTypeID', 'Transactions.Period_ID')
            ->leftJoin('Transactions', 'Transaction_Items.Transaction_ID', '=', 'Transactions.Transaction_ID')
            ->whereIn('Transaction_Items.Item_Type', [2, 53])
            ->whereBetween('Transactions.Transaction_Date', [$openDate, $closeDate])
            ->get();

        // Prepare the data for counting and grouping
        $vehicleCounts = $results->groupBy(function ($item) {
            return $item->VehicleTypeID;
        })->map(function ($group) {
            return [
                'VehicleTypeID' => $group->first()->VehicleTypeID,
                'vehicleTypeName' => $group->first()->vehicleTypeName, // You might need to join the VehicleType table here
                'GRADE' => substr($group->first()->Item_Description, 3, 20), // Adjusting to use substr
                'Count' => $group->count(),
            ];
        })->values();

        // Group by VehicleTypeID, vehicleTypeName, and GRADE to get the total
        $finalResult = $vehicleCounts->groupBy(function ($item) {
            return $item['VehicleTypeID'];
        })->map(function ($group) {
            return [
                'VehicleTypeID' => $group->first()['VehicleTypeID'],
                'vehicleTypeName' => $group->first()['vehicleTypeName'],
                'GRADE' => $group->first()['GRADE'],
                'TOTAL' => $group->sum('Count'),
            ];
        })->values();

        return $finalResult->isEmpty() ? false : $finalResult;
    }
}
