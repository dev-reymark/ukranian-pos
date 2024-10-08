<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DepartmentHistory extends Model
{
    protected $table = 'Department_History'; // Set the table name
    protected $primaryKey = 'Department_ID'; // Set the primary key if different from id
    public $timestamps = false; // Set to true if your table has timestamps

    // Define fillable properties if you want to allow mass assignment
    protected $fillable = [
        'Department_ID',
        'Period_ID',
        'Dept_Qty_Item_Sold',
        'Dept_Val_Item_Sold',
        'Dept_Qty_Item_Ref',
        'Dept_Val_Item_Ref',
        'Dept_Qty_Disc',
        'Dept_Val_Disc',
        'Dept_Tax_Item_Sold',
        'Dept_Tax_Item_Ref',
        'Dept_Tax_Disc',
        'Dept_Tax_Exempt_Value',
        'Dept_Tax_Exempt_Qty',
        'Dept_Tax_Exempt_Val_Ref',
        'Dept_Tax_Exempt_Qty_Ref',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'Department_ID', 'Department_ID');
    }

    public function getDepartmentSales($periodID)
    {
        // Query to get department sales for the given periodID
        $depSales = $this->where('Period_ID', $periodID)
            ->leftJoin('Departments', 'Departments.Department_ID', '=', 'Department_History.Department_ID')
            ->select('Department_History.*', 'Departments.Dept_Name') // Select columns from both tables
            ->get();

        return $depSales->map(function ($sale) {
            return [
                'depName' => trim($sale->Dept_Name),
                'qty' => $sale->Dept_Qty_Item_Sold,
                'val' => $sale->Dept_Val_Item_Sold,
            ];
        })->toArray(); // Convert the collection to an array
    }

    public function getDepartmentTaxExempt($periodID)
    {
        $deptax = DB::table($this->table)
            ->select('Departments.Dept_Name', 'Department_History.Dept_Tax_Exempt_Qty', 'Department_History.Dept_Tax_Exempt_Value')
            ->join('Departments', 'Departments.Department_ID', '=', 'Department_History.Department_ID')
            ->where('Period_ID', $periodID)
            ->get();

        $deptTaxArr = [];

        foreach ($deptax as $dept) {
            $deptTaxArr[] = [
                'depName' => trim($dept->Dept_Name),
                'qty' => $dept->Dept_Tax_Exempt_Qty,
                'val' => $dept->Dept_Tax_Exempt_Value,
            ];
        }

        return $deptTaxArr;
    }

    public function getDepartmentDiscounts($periodID)
    {
        // Query the Department_History table and join with the Departments table
        $depDisc = DB::table('Department_History')
            ->where('Department_History.Period_ID', $periodID)
            ->leftJoin('Departments', 'Departments.Department_ID', '=', 'Department_History.Department_ID')
            ->select('Departments.Dept_Name', 'Department_History.Dept_Qty_Disc', 'Department_History.Dept_Val_Disc')
            ->get();

        // Check if any results were found
        $listLength = $depDisc->count();
        if ($listLength <= 0) {
            return false;
        }

        // Initialize an array to hold the department discounts
        $depDiscArr = [];

        // Loop through each result and format the data
        foreach ($depDisc as $disc) {
            $depDiscTemp = [
                'depName' => trim($disc->Dept_Name),
                'qty' => abs($disc->Dept_Qty_Disc),
                'val' => $disc->Dept_Val_Disc,
            ];

            array_push($depDiscArr, $depDiscTemp);
        }

        return $depDiscArr;
    }

    public function getDepartmentRefund($periodID)
    {
        // Query to get the department refunds
        $depRef = DB::table('Department_History')
            ->where('Department_History.Period_ID', $periodID)
            ->leftJoin('Departments', 'Departments.Department_ID', '=', 'Department_History.Department_ID')
            ->select('Departments.Dept_Name', 'Department_History.Dept_Qty_Item_Ref', 'Department_History.Dept_Val_Item_Ref')
            ->get();

        // Check if the result is not empty
        if ($depRef->isEmpty()) {
            return false;
        }

        // Initialize an array to hold department refund data
        $depRefArr = [];

        // Loop through each result and format the data
        foreach ($depRef as $ref) {
            $depRefTemp = [
                'depName' => trim($ref->Dept_Name),
                'qty' => $ref->Dept_Qty_Item_Ref,
                'val' => $ref->Dept_Val_Item_Ref
            ];

            array_push($depRefArr, $depRefTemp);
        }

        return $depRefArr;
    }
}
