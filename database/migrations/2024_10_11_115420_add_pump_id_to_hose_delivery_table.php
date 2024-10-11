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
        Schema::table('Hose_Delivery', function (Blueprint $table) {
            $table->unsignedBigInteger('Pump_ID')->nullable()->after('Hose_ID');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Hose_Delivery', function (Blueprint $table) {
            $table->dropColumn('Pump_ID');
        });
    }
};
