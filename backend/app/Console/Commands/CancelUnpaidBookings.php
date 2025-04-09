<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CancelUnpaidBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:cancel-unpaid';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancel bookings that have not been paid within 24 hours of approval';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for unpaid bookings...');

        // Find all approved bookings that are past their payment due date
        $unpaidBookings = Booking::where('status', 'approved')
            ->whereNotNull('payment_due_at')
            ->where('payment_due_at', '<', now())
            ->whereNull('payment_proof')
            ->get();

        $count = $unpaidBookings->count();
        $this->info("Found {$count} unpaid bookings to cancel.");

        foreach ($unpaidBookings as $booking) {
            // Update booking status to cancelled
            $booking->update(['status' => 'cancelled']);
            
            // Make the room available again
            if ($booking->room) {
                $booking->room->update(['is_available' => true]);
            }
            
            $this->info("Cancelled booking #{$booking->id}");
            Log::info("Automatically cancelled unpaid booking #{$booking->id}");
        }

        $this->info('Finished processing unpaid bookings.');
    }
} 