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
        Schema::table('dealers', function (Blueprint $table) {
            $table->string('address_line1')->nullable()->after('address');
            $table->string('address_line2')->nullable()->after('address_line1');
            $table->string('address_line3')->nullable()->after('address_line2');
            $table->string('main_town')->nullable()->after('address_line3');
            $table->enum('category', ['1', '2', '3', '4'])->default('1')->after('main_town');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dealers', function (Blueprint $table) {
            $table->dropColumn(['address_line1', 'address_line2', 'address_line3', 'main_town', 'category']);
        });
    }
};
