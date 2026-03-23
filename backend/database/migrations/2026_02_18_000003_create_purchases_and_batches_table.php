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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained('suppliers');
            $table->date('order_date');
            $table->date('expected_delivery_date')->nullable();
            $table->enum('status', ['draft', 'ordered', 'received', 'cancelled'])->default('draft');
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('reference_number')->nullable();
            $table->timestamps();
        });

        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('items');
            $table->decimal('quantity', 15, 2);
            $table->decimal('unit_price', 15, 2); // Buying price
            $table->decimal('total_price', 15, 2);
            $table->timestamps();
        });

        Schema::create('item_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained('items');
            $table->foreignId('purchase_order_item_id')->nullable()->constrained('purchase_order_items')->nullOnDelete();
            $table->string('batch_number')->index();
            $table->decimal('quantity', 15, 2); // Original qty received
            $table->decimal('remaining_quantity', 15, 2); // Current stock
            $table->decimal('cost_price', 15, 2); // Purchase price per unit for this batch
            $table->decimal('selling_price', 15, 2)->nullable(); // Specific selling price for this batch (optional override)
            $table->date('expiry_date')->nullable();
            $table->timestamp('received_date')->useCurrent(); // For FIFO sorting
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_batches');
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');
    }
};
