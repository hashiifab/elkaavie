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
        // Skip this migration since we already created the rooms table
        // The 2024_06_29_000000_create_rooms_table migration has already created this table
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't do anything in down since we skipped the up method
    }
};
