<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class BookingApproved extends Notification implements ShouldQueue
{
    use Queueable;

    private $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        try {
            $roomNumber = isset($this->booking['room']['number']) ? $this->booking['room']['number'] :
                         (isset($this->booking['room_number']) ? $this->booking['room_number'] : 'Unknown');

            // Get booking ID
            $bookingId = is_array($this->booking) ? $this->booking['id'] : $this->booking->id;

            // Use the redirect endpoint instead of generating token directly
            $backendUrl = config('app.url', 'http://localhost:8000');
            $autoLoginUrl = $backendUrl . '/api/auto-login-redirect/' . $bookingId . '/' . $notifiable->id;

            // Log the URL for debugging
            Log::info('Auto-login redirect URL generated', [
                'url' => $autoLoginUrl,
                'user_id' => $notifiable->id,
                'booking_id' => $bookingId,
                'full_url' => $backendUrl . '/api/auto-login-redirect/' . $bookingId . '/' . $notifiable->id
            ]);

            // Use the auto-login URL directly
            // The template has been modified to show the actual URL

            // Create a direct URL to the auto-login endpoint with absolute URL
            $directUrl = 'http://localhost:8000/api/auto-login-redirect/' . $bookingId . '/' . $notifiable->id;

            // Log the direct URL for debugging
            Log::info('Direct auto-login URL', [
                'direct_url' => $directUrl
            ]);

            return (new MailMessage)
                ->from('noreply@ibadahterpanjang.com', 'Elkaavie')
                ->subject('Booking Approved - Room ' . $roomNumber)
                ->greeting('Hello ' . $notifiable->name . '!')
                ->line('Your booking #' . $this->booking['id'] . ' has been approved!')
                ->line('Room ' . $roomNumber . ' is now confirmed for your stay.')
                ->line('Please proceed with the payment to complete your booking.')
                ->action('View Booking Details', $directUrl)
                ->line('You will be automatically logged in when you click the button above.')
                ->line('Thank you for choosing Elkaavie!')
                ->salutation('Best regards, Elkaavie Team');
        } catch (\Exception $e) {
            Log::error('Failed to send booking approval email: ' . $e->getMessage());
            throw $e;
        }
    }
}