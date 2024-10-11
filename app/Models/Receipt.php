<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $table = 'Receipt';
    public $incrementing = false;
    protected $primaryKey = 'Receipt_ID';

    protected $fillable = [
        'Receipt_Name',
        'Receipt_Header_L1',
        'Receipt_Header_L2',
        'Receipt_Header_L3',
        'Receipt_Header_L4',
        'Receipt_Header_L5',
        'Receipt_Footer_L1',
        'Receipt_Footer_L2',
        'Receipt_Footer_L3',
        'Receipt_Footer_L4',
        'Receipt_Footer_L5',
    ];

    public function getReceiptLayout($posID)
    {
        // Perform a join query using Eloquent
        $layout = Receipt::select(
            'Receipt.Receipt_ID', 
            'Receipt_Name', 
            'Receipt_Header_L1', 
            'Receipt_Header_L2', 
            'Receipt_Header_L3', 
            'Receipt_Header_L4', 
            'Receipt_Header_L5', 
            'Receipt_Footer_L1', 
            'Receipt_Footer_L2', 
            'Receipt_Footer_L3', 
            'Receipt_Footer_L4', 
            'Receipt_Footer_L5'
        )
        ->leftJoin('POS_Terminal', 'POS_Terminal.Receipt_ID', '=', 'Receipt.Receipt_ID')
        ->where('POS_Terminal.POS_ID', $posID)
        ->first(); // Retrieve a single row

        if (!$layout) {
            return false;
        }

        // Return the layout as an object (already an Eloquent model instance)
        return $layout;
    }
}
