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

// Public booking routes
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings', [BookingController::class, 'index']);

// Protected routes - any authenticated user
Route::middleware('auth:sanctum')->group(function () {
    // User profile and authentication
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // User bookings
    Route::get('/bookings/user', [BookingController::class, 'userBookings']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Users management
    Route::get('/users', [UserController::class, 'index']);
    
    // Rooms management
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{room}', [RoomController::class, 'update']);
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);
    Route::post('/rooms/{room}/toggle-availability', [RoomController::class, 'toggleAvailability']);
    
    // Bookings management
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
