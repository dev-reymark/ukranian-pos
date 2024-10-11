<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Account extends Model
{
    use HasFactory;

    // Specify the table name (optional, as Laravel uses plural by default)
    protected $table = 'Accounts';

    // Specify the primary key (optional, if not 'id')
    protected $primaryKey = 'Account_ID';

    // Disable timestamps if your table doesn't have created_at and updated_at fields
    public $timestamps = false;

    // Specify the fillable fields (adjust based on your needs)
    protected $fillable = [
        'Acc_Number',
        'Acc_Name',
        'Acc_Type',
        'Acc_Blocked',
        'Acc_Balance',
        'Acc_Limit',
    ];

    public function updateAccBalance($subAccID, $balance)
    {
        // Get the current balance
        $currentBalance = $this->getAccBalance($subAccID);
        $newBalance = (float)$currentBalance + (float)$balance;

        // Check if the current balance is valid
        if (is_null($currentBalance)) {
            return false;
        }

        // Update the account balance
        $updated = DB::table('Accounts')
            ->join('Sub_Accounts', 'Accounts.Account_ID', '=', 'Sub_Accounts.Account_ID')
            ->where('Sub_Accounts.Sub_Account_ID', $subAccID)
            ->update(['Acc_Balance' => $newBalance]);

        return $updated > 0; // Return true if at least one record was updated
    }
}
