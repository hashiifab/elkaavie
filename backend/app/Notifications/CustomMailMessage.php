<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;

class CustomMailMessage extends MailMessage
{
    /**
     * The custom displayable action URL.
     *
     * @var string
     */
    protected $customDisplayableActionUrl;

    /**
     * Set the custom displayable action URL.
     *
     * @param  string  $url
     * @return $this
     */
    public function displayableActionUrl($url)
    {
        $this->customDisplayableActionUrl = $url;

        return $this;
    }

    /**
     * Get an array representation of the message.
     *
     * @return array
     */
    public function toArray()
    {
        $array = parent::toArray();

        if ($this->customDisplayableActionUrl) {
            $array['displayableActionUrl'] = $this->customDisplayableActionUrl;
        } else if ($this->actionUrl && strpos($this->actionUrl, 'auto-login-redirect') !== false) {
            // Extract booking ID from URL
            preg_match('/auto-login-redirect\/(\d+)\//', $this->actionUrl, $matches);
            if (isset($matches[1])) {
                $bookingId = $matches[1];
                $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
                $array['displayableActionUrl'] = $frontendUrl . '/bookings/' . $bookingId;
            }
        }

        return $array;
    }
}
