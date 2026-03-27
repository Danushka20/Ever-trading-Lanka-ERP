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
        Schema::table('invoices', function (Blueprint $table) {
            if (!Schema::hasColumn('invoices', 'dealer_id')) {
                $table->foreignId('dealer_id')->constrained('dealers')->onDelete('cascade')->after('sales_area_id');
            }
            if (!Schema::hasColumn('invoices', 'settle_amount')) {
                $table->decimal('settle_amount', 15, 2)->default(0)->after('total');
            }
            if (!Schema::hasColumn('invoices', 'invoice_date')) {
                $table->date('invoice_date')->nullable()->after('settle_amount');
            }
            if (!Schema::hasColumn('invoices', 'due_date')) {
                $table->date('due_date')->nullable()->after('invoice_date');
            }
            if (!Schema::hasColumn('invoices', 'notes')) {
                $table->text('notes')->nullable()->after('due_date');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['dealer_id', 'settle_amount', 'invoice_date', 'due_date', 'notes']);
        });
    }
};
