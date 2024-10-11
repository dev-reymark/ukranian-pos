<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    public function updateBegTransNumPerTrans($periodID, $posID, $transNum)
    {
        $updated = DB::table($this->table)
            ->where('Period_ID', $periodID)
            ->where('pos_id', $posID)
            ->where('BeginningSI', 0)
            ->update(['BeginningSI' => $transNum]);

        return $updated > 0; // Return true if at least one row was updated
    }

    public function updateEndingTransNumPerTrans($periodID, $posID, $transNum)
    {
        $updated = DB::table($this->table)
            ->where('Period_ID', $periodID)
            ->where('pos_id', $posID)
            ->update(['EndingSI' => $transNum]);

        return $updated > 0; // Return true if at least one row was updated
    }
}
