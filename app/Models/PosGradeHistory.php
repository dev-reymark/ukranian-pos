<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosGradeHistory extends Model
{
    protected $table = 'pos_grade_history';
    protected $primaryKey = 'grade_id';
    public $timestamps = false;

    protected $fillable = [
        'grade_id',
        'period_id',
        'grade_qty_item_sold',
        'grade_val_item_sold',
        'grade_tax_item_sold',
        'grade_tax_disc',
        'grade_qty_disc',
        'grade_val_disc',
        'total_awarded_qty',
        'total_awarded_val',
        'total_redeemed_qty',
        'total_redeemed_val',
        'grade_name_history',
        'grade_code_history',
        'grade_tax_exempt_value',
        'grade_tax_exempt_qty',
        'grade_num_disc',
        'redemption_value',
    ];

    public function getGradeTaxExempt($periodID)
    {
        return $this->join('Grades', 'Grades.Grade_ID', '=', 'pos_grade_history.grade_id')
            ->selectRaw("LTRIM(RTRIM(Grade_Name)) as Grade_Name, grade_tax_exempt_value as gradeTaxExemptValue, grade_tax_exempt_qty as gradeTaxExemptQty")
            ->where("period_id", $periodID)
            ->get();
    }
}
