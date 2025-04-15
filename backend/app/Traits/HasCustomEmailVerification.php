<?php

namespace App\Traits;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\URL;

trait HasCustomEmailVerification
{
    /**
     * Get the email address that should be used for verification.
     *
     * @return string
     */
    public function getEmailForVerification()
    {
        return $this->email;
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new \App\Notifications\VerifyEmail);
    }
} 