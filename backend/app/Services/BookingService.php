<?php

namespace App\Services;

use App\Models\Booking;
use App\Notifications\BookingApproved;
use Illuminate\Support\Facades\Log;

class BookingService
{
    /**
     * Define valid booking statuses as constants
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_PAID = 'paid';

    /**
     * Get array of all valid booking statuses
     *
     * @return array
     */
    public static function getValidStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_APPROVED,
            self::STATUS_REJECTED,
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED,
            self::STATUS_PAID
        ];
    }

    /**
     * Update booking status and handle related side effects
     *
     * @param Booking $booking
     * @param string $status
     * @return Booking
     */
    public function updateStatus(Booking $booking, string $status): Booking
    {
        // Load the booking with relationships
        $booking->load(['user', 'room']);

        // Update booking status
        $booking->update(['status' => $status]);

        // Handle side effects based on status change
        switch ($status) {
            case self::STATUS_APPROVED:
                $this->handleApprovedBooking($booking);
                break;

            case self::STATUS_PAID:
                $this->handlePaidBooking($booking);
                break;

            case self::STATUS_REJECTED:
            case self::STATUS_COMPLETED:
            case self::STATUS_CANCELLED:
                $this->makeRoomAvailable($booking);
                break;
        }

        return $booking;
    }

    /**
     * Handle side effects when a booking is approved
     *
     * @param Booking $booking
     * @return void
     */
    private function handleApprovedBooking(Booking $booking): void
    {
        // Set payment due date to 24 hours from now
        $booking->update(['payment_due_at' => now()->addHours(24)]);

        // Mark room as unavailable
        if ($booking->room && $booking->room->is_available) {
            $booking->room->update(['is_available' => false]);
        }

        // Send email notification to user
        if ($booking->user) {
            try {
                $booking->user->notify(new BookingApproved($booking));
            } catch (\Exception $e) {
                Log::error('Failed to send booking approval email: ' . $e->getMessage());
            }
        }
    }

    /**
     * Handle side effects when a booking is marked as paid
     *
     * @param Booking $booking
     * @return void
     */
    private function handlePaidBooking(Booking $booking): void
    {
        // When payment is verified, clear the payment due date
        $booking->update(['payment_due_at' => null]);
    }

    /**
     * Make room available again
     *
     * @param Booking $booking
     * @return void
     */
    private function makeRoomAvailable(Booking $booking): void
    {
        if ($booking->room) {
            $booking->room->update(['is_available' => true]);
        }
    }

    /**
     * Calculate total months between check-in and check-out dates
     *
     * @param string $checkIn
     * @param string $checkOut
     * @return int
     */
    public function calculateMonths(string $checkIn, string $checkOut): int
    {
        $checkInDate = \Carbon\Carbon::parse($checkIn);
        $checkOutDate = \Carbon\Carbon::parse($checkOut);

        // If dates are in the same month and year, return 1
        if ($checkInDate->month === $checkOutDate->month &&
            $checkInDate->year === $checkOutDate->year) {
            return 1;
        }

        // Calculate months difference
        $months = ($checkOutDate->year - $checkInDate->year) * 12 +
                ($checkOutDate->month - $checkInDate->month);

        // If check-out day is less than check-in day, it's not a full month
        if ($checkOutDate->day < $checkInDate->day) {
            return max(1, $months);
        }

        return max(1, $months);
    }

    /**
     * Calculate check-out date based on check-in date and duration in months
     *
     * @param string $checkIn
     * @param int $durationMonths
     * @return string
     */
    public function calculateCheckOutDate(string $checkIn, int $durationMonths): string
    {
        $checkInDate = \Carbon\Carbon::parse($checkIn);
        $checkOutDate = (clone $checkInDate)->addMonths($durationMonths);

        return $checkOutDate->format('Y-m-d');
    }

    /**
     * Validate that check-out date matches the expected date based on check-in and duration
     *
     * @param string $checkIn
     * @param string $checkOut
     * @param int $durationMonths
     * @return bool
     */
    public function validateCheckOutDate(string $checkIn, string $checkOut, int $durationMonths): bool
    {
        $expectedCheckOut = $this->calculateCheckOutDate($checkIn, $durationMonths);
        return $checkOut === $expectedCheckOut;
    }
}