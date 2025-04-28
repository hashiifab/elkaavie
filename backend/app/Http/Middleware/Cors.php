<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    public function handle(Request $request, Closure $next): Response
    {
        // Handle preflight OPTIONS request
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
        } else {
            $response = $next($request);
        }

        // Get the origin from the request
        $origin = $request->header('Origin');
        
        // Allow specific origins or use '*' for development
        $allowed_origins = [
            'http://localhost:3000',     // React development server
            'http://localhost:59705',    // Flutter web port
            'http://127.0.0.1:59705',    // Flutter web port alternative
        ];
        
        // If the origin is in our allowed list, set it specifically
        if (in_array($origin, $allowed_origins)) {
            $response->header('Access-Control-Allow-Origin', $origin);
            $response->header('Access-Control-Allow-Credentials', 'true');
        } else {
            // For requests without credentials, we can use wildcard
            $response->header('Access-Control-Allow-Origin', '*');
            // Don't set Allow-Credentials when using wildcard
        }

        return $response
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN, Accept')
            ->header('Access-Control-Max-Age', '86400'); // 24 hours
    }
} 