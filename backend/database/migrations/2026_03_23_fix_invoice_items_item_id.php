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
        Schema::table('invoice_items', function (Blueprint $table) {
            // Drop the old product_id foreign key constraint
            $table->dropForeign(['product_id']);
            
            // Rename product_id to item_id
            $table->renameColumn('product_id', 'item_id');
            
            // Add the new foreign key constraint to items table
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoice_items', function (Blueprint $table) {
            // Drop the new item_id foreign key constraint
            $table->dropForeign(['item_id']);
            
            // Rename item_id back to product_id
            $table->renameColumn('item_id', 'product_id');
            
            // Restore the old foreign key constraint
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }
};
