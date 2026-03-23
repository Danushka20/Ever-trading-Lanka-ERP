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
        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('secondary_phone')->nullable()->after('phone');
            $table->string('whatsapp_number')->nullable()->after('secondary_phone');
            $table->string('tin_number')->nullable()->after('tax_id');
            $table->string('address_line1')->nullable()->after('address');
            $table->string('address_line2')->nullable()->after('address_line1');
            $table->string('address_line3')->nullable()->after('address_line2');
            $table->string('main_town')->nullable()->after('address_line3');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn([
                'secondary_phone', 
                'whatsapp_number', 
                'tin_number', 
                'address_line1', 
                'address_line2', 
                'address_line3', 
                'main_town'
            ]);
        });
    }
};
