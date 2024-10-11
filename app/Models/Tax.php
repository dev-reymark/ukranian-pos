<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $table = 'Taxes';
    protected $primaryKey = 'Tax_ID';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'Tax_ID',
        'Tax_Name',
        'Tax_rate',
        'Tax_Inclusive',
        'Tax_Legend',
    ];
    public function getTaxList()
    {
        // Fetch all tax records using Eloquent
        $taxList = Tax::all(); // This returns a collection

        if ($taxList->isEmpty()) {
            return false; // No records found
        }

        // Optionally, you can transform the result if needed
        return $taxList->map(function ($tax) {
            return [
                'id' => $tax->Tax_ID,
                'name' => trim($tax->Tax_Name),
                'rate' => $tax->Tax_rate,
                'inclusive' => $tax->Tax_Inclusive,
                'legend' => $tax->Tax_Legend,
            ];
        })->values()->all(); // Return the transformed array
    }

    public function getTaxRate($taxID)
    {
        $tax = Tax::find($taxID); // Fetch the tax record by ID

        if ($tax) {
            return $tax->Tax_rate; // Return the tax rate if found
        }

        return false; // Return false if not found
    }
}
