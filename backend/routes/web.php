<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Return a simple JSON response instead of redirecting
Route::get('/login', function () {
    return response()->json([
        'message' => 'Please use POST request to /api/login with email and password'
    ]);
})->name('login');

// Password Reset Routes
Route::get('/reset-password/{token}', function (string $token) {
    return redirect(env('APP_FRONTEND_URL', 'http://localhost:3000') . '/reset-password/' . $token);
})->name('password.reset');
