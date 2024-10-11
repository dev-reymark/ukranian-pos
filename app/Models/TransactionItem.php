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

    public function callTransItemsSP($data)
    {
        DB::beginTransaction();

        try {
            $result = DB::statement(
                "EXEC SP_LOG_TRANSACTION_ITEM 
            @TRANS_ID = ?, 
            @ITEM_NUMBER = ?, 
            @ITEM_TAX_ID = ?, 
            @ITEM_TYPE = ?, 
            @ITEM_DESC = ?, 
            @ITEM_PRICE = ?, 
            @ITEM_QTY = ?, 
            @ITEM_VALUE = ?, 
            @ITEM_ID = ?, 
            @ITEM_TAX_AMOUNT = ?, 
            @DELIVERY_ID = ?, 
            @original_item_value_pre_tax_change = ?, 
            @is_tax_exempt_item = ?, 
            @is_zero_rated_tax_item = ?, 
            @pos_id = ?, 
            @ITEM_DISCOUNT_TOTAL = ?, 
            @discount_code_type = ?, 
            @gc_number = ?",
                [
                    $data['TRANS_ID'],
                    $data['ITEM_NUMBER'],
                    $data['ITEM_TAX_ID'],
                    $data['ITEM_TYPE'],
                    $data['ITEM_DESC'],
                    $data['ITEM_PRICE'],
                    $data['ITEM_QTY'],
                    $data['ITEM_VALUE'],
                    $data['ITEM_ID'],
                    $data['ITEM_TAX_AMOUNT'],
                    $data['DELIVERY_ID'],
                    $data['original_item_value_pre_tax_change'],
                    $data['is_tax_exempt_item'],
                    $data['is_zero_rated_tax_item'],
                    $data['posID'],
                    $data['itemDiscTotal'],
                    $data['itemDiscCodeType'],
                    $data['gcNumber'],
                ]
            );

            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollback();
            throw $e; // or handle the exception as needed
        }
    }

    public function getTransItemData($transID)
    {
        return DB::table($this->table)
            ->select([
                'Transaction_ID as transID',
                'Item_Type as itemType',
                'Tax_ID as taxID',
                DB::raw("RTRIM(LTRIM(Item_Description)) as itemDesc"),
                'Item_Price as itemPrice',
                'Item_Quantity as itemQty',
                'Item_Value as itemVal',
                'Item_ID as itemID',
                'Item_Tax_Amount as itemTaxAmt',
                'Item_Discount_Total as itemDiscTotal',
                'is_tax_exempt_item as isTaxExemptItem',
                'is_zero_rated_tax_item as isZeroRatedTaxItem',
            ])
            ->where('Transaction_ID', $transID)
            ->get();
    }
}
