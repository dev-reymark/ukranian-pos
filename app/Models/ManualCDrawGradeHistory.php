<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManualCDrawGradeHistory extends Model
{
    use HasFactory;

    protected $table = 'Manual_CDrawGrade_History'; // Specify the table name
    protected $primaryKey = 'CDraw_Period_ID'; // Define the primary key
    public $timestamps = false; // Disable timestamps if not used

    protected $fillable = [
        'CDraw_Period_ID',
        'Grade_ID',
        'CDrawGrade_Trs',
        'CDrawGrade_Vol',
        'CDrawGrade_Val',
        'CDrawGrade_Vol_Disc',
        'CDrawGrade_Val_Disc',
        'CDrawGrade_Vol_Ref',
        'CDrawGrade_Val_Ref',
    ];

    public function getManualCDrawGradeHistByCDPeriodID($cdPeriodID)
    {
        // Use Eloquent to retrieve the data
        $result = ManualCDrawGradeHistory::select('Manual_CDrawGrade_History.Grade_ID', 'Grades.Grade_Name', 'CDrawGrade_Trs', 'CDrawGrade_Vol', 'CDrawGrade_Val')
            ->leftJoin('Grades', 'Grades.Grade_ID', '=', 'Manual_CDrawGrade_History.Grade_ID')
            ->where('Manual_CDrawGrade_History.CDraw_Period_ID', $cdPeriodID)
            ->get();

        // Check if the result is empty
        if ($result->isEmpty()) {
            return false; // No records found
        }

        return $result; // Return the collection of results
    }
}
