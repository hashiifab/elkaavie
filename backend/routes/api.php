<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\ResetPasswordController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/auto-login', [AuthController::class, 'autoLogin']);
Route::get('/auto-login-redirect/{bookingId}/{userId}', [AuthController::class, 'generateAutoLoginRedirect']);
Route::middleware(['web'])->group(function () {
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// Email verification routes
Route::post('/email/verify', [AuthController::class, 'verifyEmail']);
Route::post('/email/verify-and-login', [AuthController::class, 'verifyEmailAndLogin']);
Route::post('/email/verification-notification', [AuthController::class, 'resendVerificationEmail'])
    ->middleware('auth:sanctum');
Route::post('/email/verification-notification/unverified', [AuthController::class, 'resendVerificationEmailForUnverified']);

// Room routes - public access
Route::get('/rooms', [RoomController::class, 'index']);
Route::post('/rooms/initialize', [RoomController::class, 'initialize']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);

// Protected routes - any authenticated user
Route::middleware('auth:sanctum')->group(function () {
    // User profile and authentication
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'update']);
    Route::delete('/user', [AuthController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // User bookings - with full data but filtered by user
    Route::get('/bookings/user', [BookingController::class, 'userBookings']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::post('/bookings/associate', [BookingController::class, 'associateBookingsWithUser']);
    Route::post('/bookings/{booking}/payment-proof', [BookingController::class, 'uploadPaymentProof']);

    // Create booking - now requires authentication
    Route::post('/bookings', [BookingController::class, 'store']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Users management
    Route::get('/users', [AuthController::class, 'getUsers']);

    // Rooms management
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{room}', [RoomController::class, 'update']);
    Route::post('/rooms/{room}/toggle-availability', [RoomController::class, 'toggleAvailability']);

    // Bookings management
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::put('/bookings/{booking}', [BookingController::class, 'update']);
    Route::put('/bookings/{booking}/status', [BookingController::class, 'updateStatus']);
});

// Serve identity card images
Route::get('identity-cards/{filename}', function ($filename) {
    $path = storage_path('app/public/identity-cards/' . $filename);
    if (!file_exists($path)) {
        return response()->json(['message' => 'Image not found'], 404);
    }
    return response()->file($path);
});

Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);
