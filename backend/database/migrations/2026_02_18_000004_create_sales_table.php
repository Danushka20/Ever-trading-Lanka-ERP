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
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dealer_id')->constrained('dealers');
            $table->date('order_date');
            $table->enum('status', ['draft', 'confirmed', 'completed', 'cancelled'])->default('draft');
            $table->string('payment_status')->default('unpaid'); // unpaid, partial, paid
            $table->string('payment_method')->nullable(); // cash, credit, card, bank_transfer, cheque
            $table->decimal('total_amount', 15, 2)->default(0); // Subtotal
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0); // Final to pay
            $table->timestamps();
        });

        Schema::create('sales_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_id')->constrained('sales_orders')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('items');
            $table->decimal('quantity', 15, 2);
            $table->decimal('unit_price', 15, 2); // Selling price
            $table->decimal('total_price', 15, 2);
            $table->timestamps();
        });

        // Tracks which batch fulfilled which sale item (FIFO logic storage)
        Schema::create('batch_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_batch_id')->constrained('item_batches');
            $table->foreignId('sales_order_item_id')->constrained('sales_order_items')->onDelete('cascade');
            $table->decimal('quantity', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_allocations');
        Schema::dropIfExists('sales_order_items');
        Schema::dropIfExists('sales_orders');
    }
};
