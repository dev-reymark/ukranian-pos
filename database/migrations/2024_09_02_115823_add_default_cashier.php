<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddDefaultCashier extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('Cashiers')->insert([
            'Cashier_Number' => '1',
            'Cashier_Name' => 'Store Manager',
            'Cashier_Psw' => '1', // Always hash passwords in practice
            'Cashier_Role_ID' => 1, // Assuming role ID 1 exists
            'Cashier_Active' => true,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('Cashiers')->where('Cashier_Number', '1')->delete();
    }
}
