<?php

use App\Console\Commands\TestCommand;
use App\Http\Middleware\Admin;
use App\Http\Middleware\Cors;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Routing\Middleware\SubstituteBindings;

return Application::configure(dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        api: __DIR__.'/../routes/api.php',
        health: '/up',
    )
    ->withCommands([
        TestCommand::class,
    ])
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->use([
            Cors::class,
        ]);

        $middleware->group('api', [
            SubstituteBindings::class,
            Cors::class,
        ]);
        
        $middleware->alias([
            'admin' => Admin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
