<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    use HasFactory;

    protected $table = 'Transaction_Details';

    protected $primaryKey = 'Transaction_ID';

    public $timestamps = false;

    protected $fillable = [
        'Transaction_ID',
        'CustomerName',
        'Address',
        'TIN',
        'BusinessStyle',
        'CardNumber',
        'ApprovalCode',
        'BankCode',
        'Type'
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'Transaction_ID', 'Transaction_ID');
    }
}
