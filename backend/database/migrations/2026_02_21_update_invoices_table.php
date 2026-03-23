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
            // Add new columns if they don't exist
            if (!Schema::hasColumn('invoices', 'invoice_date')) {
                $table->date('invoice_date')->nullable()->after('status');
            }
            if (!Schema::hasColumn('invoices', 'due_date')) {
                $table->date('due_date')->nullable()->after('invoice_date');
            }
            if (!Schema::hasColumn('invoices', 'notes')) {
                $table->text('notes')->nullable()->after('due_date');
            }
            if (!Schema::hasColumn('invoices', 'dealer_id')) {
                $table->foreignId('dealer_id')->nullable()->constrained('dealers')->onDelete('set null')->after('sales_area_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            if (Schema::hasColumn('invoices', 'invoice_date')) {
                $table->dropColumn('invoice_date');
            }
            if (Schema::hasColumn('invoices', 'due_date')) {
                $table->dropColumn('due_date');
            }
            if (Schema::hasColumn('invoices', 'notes')) {
                $table->dropColumn('notes');
            }
            if (Schema::hasColumn('invoices', 'dealer_id')) {
                $table->dropForeign(['dealer_id']);
                $table->dropColumn('dealer_id');
            }
        });
    }
};
