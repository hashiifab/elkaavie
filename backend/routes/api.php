<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);
Route::get('/rooms/available', [RoomController::class, 'available']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Booking routes
    Route::apiResource('bookings', BookingController::class);
    Route::post('bookings/{booking}/payment-proof', [BookingController::class, 'uploadPaymentProof']);

    // Admin only routes
    Route::middleware('admin')->group(function () {
        Route::apiResource('rooms', RoomController::class)->except(['index', 'show']);
        Route::get('/users', [UserController::class, 'index']);
    });
});
