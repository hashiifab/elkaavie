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
        // Skip this migration since we already have a role column
        // The 2024_06_21_000000_add_role_to_users_table migration has already added this column
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't do anything in down since we skipped the up method
    }
};
