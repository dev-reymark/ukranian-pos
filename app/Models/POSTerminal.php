<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class POSTerminal extends Model
{
    use HasFactory;

    protected $table = 'POS_Terminal';

    protected $primaryKey = 'POS_ID';

    public $timestamps = false;

    protected $fillable = [
        'POS_Number',
        'POS_Master',
        'POS_Trans_Number',
        'POS_Training_Mode',
        'Receipt_ID',
        'Display_ID',
        'BIR_Fuel_Receipt_ID',
        'BIR_Non_Fuel_Receipt_ID',
        'BIR_Fuel_Trans_Number',
        'BIR_Non_Fuel_Trans_Number',
        'gt_open_date',
        'last_bir_fuel_trans_number',
        'last_bir_non_fuel_trans_number',
        'temp_bir_fuel_trans_number',
        'temp_bir_non_fuel_trans_number',
        'ZCounter',
        'BIR_Reset_Counter',
        'Non_BIR_Trans_Number',
        'Non_BIR_Trans_Number_Reset_Counter',
        'last_bir_resetter',
        'temp_bir_resetter'
    ];

    private $nonBirTransNumCol = 'Non_BIR_Trans_Number';
    private $transNumCol = 'POS_Trans_Number';
    private $birFuelTransNumCol = 'BIR_Fuel_Trans_Number';
    private $birNonFuelTransNumCol = 'BIR_Non_Fuel_Trans_Number';
    private $idCol = 'POS_ID';

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'POS_ID', 'POS_ID');
    }

    public function getTransNumbers(int $posID)
    {
        return DB::table($this->table)
            ->select('POS_Trans_Number', 'BIR_Fuel_Trans_Number', 'BIR_Non_Fuel_Trans_Number')
            ->where($this->idCol, $posID)
            ->first() ?: false;
    }

    public function getNonBirTransNumByPosId(int $posID): int
    {
        $result = DB::table($this->table)
            ->select($this->nonBirTransNumCol)
            ->where($this->idCol, $posID)
            ->first();

        return $result->{$this->nonBirTransNumCol} ?? 0;
    }

    public function updatePOSTransNum(int $transNum, int $posID): bool
    {
        return $this->where($this->idCol, $posID)
            ->update([$this->transNumCol => $transNum]) > 0;
    }

    public function updateBIRFuelTransNum(int $transNum, int $posID): bool
    {
        return $this->where($this->idCol, $posID)
            ->update([$this->birFuelTransNumCol => $transNum]) > 0;
    }

    public function updateBIRNonFuelTransNum(int $transNum, int $posID): bool
    {
        return $this->where($this->idCol, $posID)
            ->update([$this->birNonFuelTransNumCol => $transNum]) > 0;
    }

    public function incrementNonBirTransNumber(int $posID, int $val = 0, int $i = 1): ?int
    {
        // Find the POSTerminal record by POS_ID
        $terminal = $this->find($posID);

        if ($terminal) {
            // Increment the Non_BIR_Trans_Number
            $newValue = $val + $i;
            $terminal->update([$this->nonBirTransNumCol => $newValue]);

            return $newValue; // Return the new value
        }

        return null; // Return null if the terminal is not found
    }
}
