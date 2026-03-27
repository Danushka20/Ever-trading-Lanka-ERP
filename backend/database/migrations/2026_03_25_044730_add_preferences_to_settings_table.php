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
        Schema::table('settings', function (Blueprint $table) {
            $table->string('language')->default('en');
            $table->string('timezone')->default('UTC');
            $table->string('currency')->default('LKR');
            $table->string('theme')->default('system');
            $table->string('date_format')->default('YYYY-MM-DD');
            $table->integer('rows_per_page')->default(10);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['language', 'timezone', 'currency', 'theme', 'date_format', 'rows_per_page']);
        });
    }
};
