<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            // Create a new table with the updated constraint
            DB::statement('CREATE TABLE bookings_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NULL,
                room_id INTEGER NOT NULL,
                check_in DATE NOT NULL,
                check_out DATE NOT NULL,
                status TEXT CHECK(status IN ("pending", "approved", "rejected", "completed", "cancelled", "paid")) DEFAULT "pending",
                phone_number TEXT NOT NULL,
                identity_card TEXT NOT NULL,
                guests INTEGER NOT NULL,
                special_requests TEXT NULL,
                payment_method TEXT NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                payment_proof TEXT NULL,
                payment_due_at TIMESTAMP NULL,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
                FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
            )');

            // Copy data from the old table
            DB::statement('INSERT INTO bookings_new SELECT * FROM bookings');

            // Drop the old table
            DB::statement('DROP TABLE bookings');

            // Rename the new table
            DB::statement('ALTER TABLE bookings_new RENAME TO bookings');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            // Create a new table with the old constraint
            DB::statement('CREATE TABLE bookings_old (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NULL,
                room_id INTEGER NOT NULL,
                check_in DATE NOT NULL,
                check_out DATE NOT NULL,
                status TEXT CHECK(status IN ("pending", "approved", "rejected", "completed", "cancelled")) DEFAULT "pending",
                phone_number TEXT NOT NULL,
                identity_card TEXT NOT NULL,
                guests INTEGER NOT NULL,
                special_requests TEXT NULL,
                payment_method TEXT NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                payment_proof TEXT NULL,
                payment_due_at TIMESTAMP NULL,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
                FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
            )');

            // Copy data from the current table (excluding 'paid' status)
            DB::statement('INSERT INTO bookings_old SELECT * FROM bookings WHERE status != "paid"');

            // Drop the current table
            DB::statement('DROP TABLE bookings');

            // Rename the old table
            DB::statement('ALTER TABLE bookings_old RENAME TO bookings');
        }
    }
}; 