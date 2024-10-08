<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CDrawDeptHistory extends Model
{
    use HasFactory;

    protected $table = 'CDrawDept_History'; // Table name
    protected $primaryKey = 'CDraw_Period_ID'; // Primary key
    public $timestamps = false; // Disable timestamps if not used

    protected $fillable = [
        'CDraw_Period_ID',
        'Department_ID',
        'CDrawDept_Qty_Sld',
        'CDrawDept_Val_Sld',
        'CDrawDept_Qty_Ref',
        'CDrawDept_Val_Ref',
        'CDrawDept_Qty_Disc',
        'CDrawDept_Val_Disc',
        'CDrawDept_Qty_Surc',
        'CDrawDept_Val_Surc',
    ];

    public function getCDrawDeptHistByCDPeriodID($cdPeriodID)
    {
        // Perform the query with a join to the Departments table
        $result = DB::table($this->table)
            ->select(
                'CDrawDept_History.Department_ID',
                'Departments.Dept_Name',
                'CDrawDept_History.CDrawDept_Qty_Sld',
                'CDrawDept_History.CDrawDept_Val_Sld',
                'CDrawDept_History.CDrawDept_Qty_Ref',
                'CDrawDept_History.CDrawDept_Val_Ref'
            )
            ->leftJoin('Departments', 'Departments.Department_ID', '=', 'CDrawDept_History.Department_ID')
            ->where('CDrawDept_History.CDraw_Period_ID', $cdPeriodID) // Assuming $cdrawPeriodIDCol corresponds to CDraw_Period_ID
            ->get();

        // Check if the result is empty
        if ($result->isEmpty()) {
            return false; // No records found
        }

        return $result; // Return the result set
    }
}
