<?php

namespace App\Providers;

use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Create storage link if it doesn't exist
        if (!file_exists(public_path('storage'))) {
            \Artisan::call('storage:link');
        }

        // Ensure storage directory is writable
        $storagePath = storage_path('app/public');
        if (!is_writable($storagePath)) {
            chmod($storagePath, 0755);
        }

        // Configure Scramble API documentation
        Scramble::configure()
            ->withDocumentTransformers(function (OpenApi $openApi) {
                // Add Bearer token authentication
                $openApi->secure(
                    SecurityScheme::http('bearer', 'JWT')
                );
            });

        // Define who can access the API documentation
        // In production, only admin users can view the docs
        // In local environment, everyone can view the docs
        Gate::define('viewApiDocs', function ($user = null) {
            if (app()->environment('local')) {
                return true;
            }

            return $user && $user->is_admin;
        });
    }
}
