<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class MailTestCommand extends Command
{
    protected $signature = 'mail:test {email}';

    protected $description = 'Send test email';

    public function handle()
    {
        try {
            Mail::raw('Test email content', function ($message) {
                $message->to($this->argument('email'))
                    ->subject('Elkaavie Test Email');
            });
            $this->info('Test email sent successfully');
            return 0;
        } catch (\Exception $e) {
            $this->error('Error sending email: ' . $e->getMessage());
            return 1;
        }
    }
}
