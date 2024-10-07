<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosPeriodBIRTransNum extends Model
{
    protected $table = 'pos_periods_bir_trans_num';
    protected $primaryKey = 'pos_id';
    public $timestamps = false;

    protected $fillable = [
        'pos_id',
        'Period_ID',
        'BeginningSI',
        'EndingSI',
        'BeginningResetter',
        'EndingResetter',
    ];

    public function getTransNums($periodID)
    {
        return $this->selectRaw('LTRIM(RTRIM(EndingSI)) as endingTransNum, LTRIM(RTRIM(BeginningSI)) as startingTransNum, pos_id as posID')
            ->where('Period_ID', $periodID)
            ->get();
    }
}
