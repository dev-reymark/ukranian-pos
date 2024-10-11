<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefundGT extends Model
{
    // Specify the table associated with the model
    protected $table = 'refund_gt';

    // Specify the primary key if it is not 'id'
    protected $primaryKey = 'pos_id';

    // If the primary key is not an incrementing integer
    public $incrementing = false;

    // If the primary key is not an integer
    protected $keyType = 'string';

    // Disable timestamps if your table does not have created_at and updated_at columns
    public $timestamps = false;

    // Define the fillable attributes if you plan to mass assign
    protected $fillable = [
        'pos_id',
        'vatable',
        'vat_exempt',
        'zero_rated',
    ];

    public function incrementVatableByPosId($posID, $money)
    {
        // Retrieve the record by posID
        $pos = RefundGT::find($posID);

        // Check if the record exists
        if (!$pos) {
            return false; // Or handle the case when the record is not found
        }

        // Increment the vatable column and save
        $pos->vatable += abs($money);
        return $pos->save(); // Returns true if save is successful
    }

    public function incrementVatExemptByPosId($posID, $money)
    {
        // Retrieve the record by posID
        $pos = RefundGT::find($posID);

        // Check if the record exists
        if (!$pos) {
            return false; // Or handle the case when the record is not found
        }

        // Increment the vat_exempt column and save
        $pos->vat_exempt += abs($money);
        return $pos->save(); // Returns true if save is successful
    }

    public function incrementZeroRatedByPosId($posID, $money)
    {
        // Retrieve the record by posID
        $pos = RefundGT::find($posID);

        // Check if the record exists
        if (!$pos) {
            return false; // Or handle the case when the record is not found
        }

        // Increment the zero_rated column and save
        $pos->zero_rated += abs($money);
        return $pos->save(); // Returns true if save is successful
    }

    public function getByPosId($posID)
    {
        // Retrieve the record by posID
        return RefundGT::find($posID);
    }
}
