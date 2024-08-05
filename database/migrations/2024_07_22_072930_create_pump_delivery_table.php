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
        Schema::create('Pump_Delivery', function (Blueprint $table) {
            $table->increments('Delivery_ID');
            $table->integer('Pump')->unsigned();
            $table->integer('Nozzle')->unsigned()->nullable();
            $table->float('Volume', 8, 3)->nullable();
            $table->float('TCVolume', 8, 3)->nullable();
            $table->float('Price', 8, 3)->nullable();
            $table->float('Amount', 8, 3)->nullable();
            $table->integer('Transaction')->nullable();
            $table->string('User')->nullable();
            $table->boolean('Is_Sold');
            $table->string('FuelGradeName')->nullable();
            $table->decimal('FuelGradePrice', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Pump_Delivery');
    }
};
