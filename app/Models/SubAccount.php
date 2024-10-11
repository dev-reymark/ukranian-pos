<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SubAccount extends Model
{
    use HasFactory;

    // Define the table associated with the model
    protected $table = 'Sub_Accounts';

    // Define the primary key (if it's not the default 'id')
    protected $primaryKey = 'Sub_Account_ID';

    // Disable timestamps if your table doesn't have 'created_at' and 'updated_at' columns
    public $timestamps = false;

    // Define fillable fields for mass assignment
    protected $fillable = [
        'Sub_Account_ID',
        'Account_ID',
        'SubAcc_Number',
        'SubAcc_Name',
        'SubAcc_Blocked',
        'SubAcc_Balance',
        'SubAcc_Limit',
        'SubAcc_Vehicle_ID',
        'SubAcc_Disct',
        'Sub_Account_Discount_Counter',
        'SubAcc_TIN',
        'SubAcc_Address',
    ];

    public function getSubAccBal($subAccID)
    {
        $subAccount = SubAccount::find($subAccID);

        if (!$subAccount) {
            return 0; // Return 0 if the sub-account is not found
        }

        return $subAccount->SubAcc_Balance; // Return the balance
    }

    public function updateSubAccBal($subAccID, $balance)
    {
        $subAccount = SubAccount::find($subAccID);

        if (!$subAccount) {
            return false; // Return false if the sub-account is not found
        }

        // Calculate the new balance
        $newBal = floatval($subAccount->SubAcc_Balance) + floatval($balance);
        $subAccount->SubAcc_Balance = $newBal;

        // Save the changes
        return $subAccount->save();
    }

    public function getSubAccDetails($number)
    {
        $subAccount = SubAccount::where($this->numCol, $number)->first();

        if (!$subAccount) {
            return false; // Return false if the sub-account is not found
        }

        return $subAccount; // Return the found sub-account details
    }

    public function getAllSubAccounts()
    {
        return SubAccount::select(
            "Sub_Account_ID as subAccID",
            "Account_ID as accID",
            "SubAcc_Number as subAccNum",
            DB::raw("LTRIM(RTRIM(SubAcc_Name)) as subAccName"),
            "SubAcc_Blocked as subAccBlocked",
            "SubAcc_Balance as subAccBal",
            "SubAcc_Limit as subAccLimit",
            DB::raw("LTRIM(RTRIM(SubAcc_Vehicle_ID)) as subAccVehicleID"),
            DB::raw("LTRIM(RTRIM(SubAcc_Disct)) as subAccDisct")
        )->get();
    }
}
