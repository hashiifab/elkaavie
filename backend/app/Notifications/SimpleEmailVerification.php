<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class SimpleEmailVerification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        try {
            // Create a simple verification code (6 digits)
            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Store the code in the database
            $notifiable->verification_code = $code;
            $notifiable->save();

            // Create the frontend URL
            $frontendUrl = 'http://localhost:8080/verify-email?code=' . $code;

            Log::info('Generated verification code: ' . $code);
            Log::info('Frontend URL: ' . $frontendUrl);

            return (new MailMessage)
                ->from('noreply@ibadahterpanjang.com', 'Elkaavie')
                ->subject('Verify Your Email Address')
                ->greeting('Hello ' . $notifiable->name . '!')
                ->line('Thank you for registering with us. Please use the following code to verify your email address:')
                ->line('**Verification Code: ' . $code . '**')
                ->line('Or click the button below to verify your email:')
                ->action('Verify Email Address', $frontendUrl)
                ->line('This code will expire in 1 hour.')
                ->line('If you did not create an account, no further action is required.')
                ->salutation('Best regards, Elkaavie');
        } catch (\Exception $e) {
            Log::error('Failed to send verification email: ' . $e->getMessage());
            throw $e;
        }
    }
} 