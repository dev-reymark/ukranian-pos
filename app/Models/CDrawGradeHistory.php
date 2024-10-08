<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CDrawGradeHistory extends Model
{
    use HasFactory;

    protected $table = 'CDrawGrade_History'; // Table name
    protected $primaryKey = 'CDraw_Period_ID'; // Primary key
    public $timestamps = false; // Disable timestamps if not using them

    protected $fillable = [
        'CDraw_Period_ID',
        'Grade_ID',
        'CDrawGrade_Trs',
        'CDrawGrade_Vol',
        'CDrawGrade_Val',
        'CDrawGrade_Vol_Disc',
        'CDrawGrade_Val_Disc',
        'CDrawGrade_Qty_Surc',
        'CDrawGrade_Val_Surc',
        'CDrawGrade_Vol_Ref',
        'CDrawGrade_Val_Ref',
    ];

    public function getCDrawGradeHistByCDPeriodID($cdPeriodID)
    {
        // Perform a query to get the desired fields with a join
        $result = self::select('CDrawGrade_History.Grade_ID', 'Grades.Grade_Name', 'CDrawGrade_History.CDrawGrade_Trs', 'CDrawGrade_History.CDrawGrade_Vol', 'CDrawGrade_History.CDrawGrade_Val')
            ->join('Grades', 'Grades.Grade_ID', '=', 'CDrawGrade_History.Grade_ID', 'left')
            ->where('CDrawGrade_History.CDraw_Period_ID', $cdPeriodID)
            ->get();

        // Check if the result is empty and return accordingly
        if ($result->isEmpty()) {
            return false; // No records found
        }

        return $result; // Return the result set
    }
}
