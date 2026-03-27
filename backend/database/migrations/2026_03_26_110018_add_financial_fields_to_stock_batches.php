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
        Schema::table('stock_batches', function (Blueprint $table) {
            $table->decimal('opening_stock_value', 15, 2)->default(0)->after('cost_price');
            $table->decimal('closing_stock_value', 15, 2)->default(0)->after('opening_stock_value');
            $table->integer('opening_qty')->default(0)->after('qty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_batches', function (Blueprint $table) {
            $table->dropColumn(['opening_stock_value', 'closing_stock_value', 'opening_qty']);
        });
    }
};
