<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Room routes - public access
Route::get('/rooms', [RoomController::class, 'index']);
Route::post('/rooms/initialize', [RoomController::class, 'initialize']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);

// Protected routes - any authenticated user
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // User bookings
    Route::get('/bookings/user', [BookingController::class, 'userBookings']);
    Route::post('/bookings', [BookingController::class, 'store']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Users
    Route::get('/users', [UserController::class, 'index']);
    
    // Rooms
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{room}', [RoomController::class, 'update']);
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);
    Route::post('/rooms/{room}/toggle-availability', [RoomController::class, 'toggleAvailability']);
    
    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::put('/bookings/{booking}', [BookingController::class, 'update']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);
});
