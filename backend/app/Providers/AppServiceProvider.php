<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Storage;

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
    }
}
