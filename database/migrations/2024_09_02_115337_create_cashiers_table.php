<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cashiers', function (Blueprint $table) {
            $table->bigIncrements('Cashier_ID');
            $table->string('Cashier_Number')->default('1'); // Default value set to '1'
            $table->string('Cashier_Name')->default('Store Manager'); // Default value set to 'Store Manager'
            $table->string('Cashier_Psw')->default('1'); // Default value set to '1'
            $table->unsignedBigInteger('Cashier_Role_ID')->default(1); // Default role ID
            $table->boolean('Cashier_Active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cashiers');
    }
};
