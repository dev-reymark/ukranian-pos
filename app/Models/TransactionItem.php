<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
