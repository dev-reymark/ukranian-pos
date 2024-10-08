<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DiscountHistory extends Model
{
    // Specify the table associated with the model
    protected $table = 'discount_history';

    // Specify the primary key if it's not 'id'
    protected $primaryKey = 'discount_id';

    // Disable timestamps if your table doesn't have created_at and updated_at
    public $timestamps = false;

    // Define the fields that can be mass-assigned
    protected $fillable = [
        'period_id',
        'discount_qty',
        'discount_val',
    ];

    public function getDiscountTotal($periodID)
    {
        // Query to get the discount totals
        $list = DB::table('discount_history')
            ->select(
                DB::raw("LTRIM(RTRIM(discounts.discount_name)) as discount_name"),
                DB::raw("ABS(discount_history.discount_qty) as discQty"),
                'discount_history.discount_val as discVal'
            )
            ->where('discount_history.period_id', $periodID)
            ->leftJoin('discounts', 'discounts.discount_id', '=', 'discount_history.discount_id')
            ->get();

        // Check if the result is not empty
        if ($list->isNotEmpty()) {
            return $list;
        }

        return false;
    }
}
