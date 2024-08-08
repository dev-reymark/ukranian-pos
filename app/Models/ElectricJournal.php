<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ElectricJournal extends Model
{
    protected $connection = 'sqlsrv_second';
    protected $table = 'electric_journal';
    protected $primaryKey = 'Transaction_ID';
    public $timestamps = false;

    protected $fillable = [
        'pos_id', 'Transaction_Date', 'si_number', 'Data', 'print_count'
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'Transaction_ID', 'Transaction_ID');
    }
}
