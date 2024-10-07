<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $connection = 'sqlsrv';
    protected $table = 'Transactions';

    protected $primaryKey = 'Transaction_ID';

    public $timestamps = false;

    protected $fillable = [
        'Cashier_ID',
        'Sub_Account_ID',
        'POS_ID',
        'Transaction_Number',
        'Transaction_Date',
        'Period_ID',
        'Tax_Total',
        'Sale_Total',
        'BIR_Receipt_Type',
        'BIR_Trans_Number',
        'PO_Number',
        'Plate_Number',
        'VehicleTypeID',
        'Odometer',
        'isManual',
        'isZeroRated',
        'isRefund',
        'Attendant_ID',
        'transaction_number_reference'
    ];

    public function cashier()
    {
        return $this->belongsTo(Cashier::class, 'Cashier_ID', 'Cashier_ID');
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class, 'Transaction_ID', 'Transaction_ID');
    }

    public function posTerminal()
    {
        return $this->belongsTo(POSTerminal::class, 'POS_ID', 'POS_ID');
    }

    public function details()
    {
        return $this->hasOne(TransactionDetail::class, 'Transaction_ID', 'Transaction_ID');
    }

    public function electricJournal()
    {
        return $this->hasOne(ElectricJournal::class, 'Transaction_ID', 'Transaction_ID');
    }

    public function period()
    {
        return $this->belongsTo(Period::class, 'Period_ID', 'Period_ID');
    }
}
