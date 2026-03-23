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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('tax_id')->nullable();
            $table->decimal('payable_balance', 15, 2)->default(0); // Track owing
            $table->timestamps();
        });

        Schema::create('dealers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('secondary_phone')->nullable();
            $table->string('fax_number')->nullable();
            $table->text('address')->nullable();
            $table->string('sales_type')->nullable(); // e.g., Wholesale, Retail
            $table->foreignId('salesperson_id')->nullable()->constrained('users');
            $table->foreignId('sales_area_id')->nullable()->constrained('sales_areas');
            $table->decimal('credit_limit', 15, 2)->default(0);
            $table->decimal('percentage', 5, 2)->default(0);
            $table->text('general_note')->nullable();
            $table->decimal('receivable_balance', 15, 2)->default(0); // Track owing
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dealers');
        Schema::dropIfExists('suppliers');
    }
};
