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
            
            return (new MailMessage)
                ->from('noreply@ibadahterpanjang.com', 'Elkaavie')
                ->subject('Booking Approved - Room ' . $roomNumber)
                ->greeting('Hello ' . $notifiable->name . '!')
                ->line('Your booking #' . $this->booking['id'] . ' has been approved!')
                ->line('Room ' . $roomNumber . ' is now confirmed for your stay.')
                ->line('Please proceed with the payment to complete your booking.')
                ->action('View Booking Details', config('app.frontend_url') . '/bookings/' . $this->booking['id'])
                ->line('Thank you for choosing Elkaavie!')
                ->salutation('Best regards, Elkaavie Team');
        } catch (\Exception $e) {
            Log::error('Failed to send booking approval email: ' . $e->getMessage());
            throw $e;
        }
    }
} 