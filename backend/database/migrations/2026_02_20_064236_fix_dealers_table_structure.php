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
        if (Schema::hasTable('customers') && !Schema::hasTable('dealers')) {
            Schema::rename('customers', 'dealers');
        }

        Schema::table('dealers', function (Blueprint $table) {
            if (!Schema::hasColumn('dealers', 'secondary_phone')) {
                $table->string('secondary_phone')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('dealers', 'fax_number')) {
                $table->string('fax_number')->nullable()->after('secondary_phone');
            }
            if (!Schema::hasColumn('dealers', 'sales_type')) {
                $table->string('sales_type')->nullable()->after('address');
            }
            if (!Schema::hasColumn('dealers', 'salesperson_id')) {
                $table->foreignId('salesperson_id')->nullable()->after('sales_type')->constrained('users');
            }
            if (!Schema::hasColumn('dealers', 'sales_area_id')) {
                $table->foreignId('sales_area_id')->nullable()->after('salesperson_id')->constrained('sales_areas');
            }
            if (!Schema::hasColumn('dealers', 'percentage')) {
                $table->decimal('percentage', 5, 2)->default(0)->after('credit_limit');
            }
            if (!Schema::hasColumn('dealers', 'general_note')) {
                $table->text('general_note')->nullable()->after('percentage');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Not strictly necessary as it's a fix, but good practice
        Schema::table('dealers', function (Blueprint $table) {
            $table->dropForeign(['salesperson_id']);
            $table->dropForeign(['sales_area_id']);
            $table->dropColumn(['secondary_phone', 'fax_number', 'sales_type', 'salesperson_id', 'sales_area_id', 'percentage', 'general_note']);
        });
        Schema::rename('dealers', 'customers');
    }
};
