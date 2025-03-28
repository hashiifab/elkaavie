<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\BookingRequest;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function __construct()
    {
        // Remove auth middleware since we want public access
    }

    public function index(): JsonResponse
    {
        try {
            $bookings = Booking::with(['user', 'room.roomType'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($booking) {
                    // Format identity card URL
                    if ($booking->identity_card) {
                        $booking->identity_card_url = asset('storage/' . $booking->identity_card);
                    }
                    
                    // Add room info directly to booking object for easier access
                    if ($booking->room) {
                        $booking->room_number = $booking->room->number;
                        $booking->room_floor = $booking->room->floor;
                        $booking->room_type = $booking->room->roomType->name ?? 'Standard';
                        $booking->room_capacity = $booking->room->roomType->capacity ?? 1;
                    }
                    
                    return $booking;
                });

            return response()->json([
                'success' => true,
                'data' => $bookings
            ]);
        } catch (\Exception $e) {
            Log::error('Booking index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(BookingRequest $request): JsonResponse
    {
        try {
            // Log the incoming request for debugging
            Log::info('Booking request received', $request->validated());
            
            // Get the validated data
            $data = $request->validated();

            // Handle file upload
            if ($request->hasFile('identity_card')) {
                $data['identity_card'] = $request->file('identity_card')->store('identity-cards', 'public');
                Log::info('File uploaded successfully', ['path' => $data['identity_card']]);
            }

            // Set default values
            $data['status'] = 'pending';
            $data['total_price'] = 1500000 * $this->calculateMonths($data['check_in'], $data['check_out']);
            
            // Set user_id to null for unauthenticated users
            $data['user_id'] = auth()->check() ? auth()->id() : null;

            // Create the booking
            $booking = Booking::create($data);
            Log::info('Booking created successfully', ['id' => $booking->id]);

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'data' => $booking->load(['room.roomType'])
            ], 201);

        } catch (\Exception $e) {
            Log::error('Booking creation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Booking $booking): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if (!$user->isAdmin() && $user->id !== $booking->user_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            return response()->json($booking->load(['user', 'room.roomType']));
        } catch (\Exception $e) {
            Log::error('Booking show error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to get booking details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Booking $booking): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'check_in' => 'sometimes|date',
            'check_out' => 'sometimes|date|after:check_in',
            'guests' => 'sometimes|integer|min:1',
            'special_requests' => 'sometimes|string',
            'payment_method' => 'sometimes|in:credit_card,bank_transfer',
            'phone_number' => 'sometimes|string',
        ]);

        $booking->update($validated);

        return response()->json($booking->load(['user', 'room.roomType']));
    }

    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:pending,confirmed,cancelled,completed',
            ]);

            $booking->update($validated);

            // Update room availability based on booking status
            if ($validated['status'] === 'confirmed') {
                $booking->room->update(['is_available' => false]);
            } elseif ($validated['status'] === 'cancelled' || $validated['status'] === 'completed') {
                $booking->room->update(['is_available' => true]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Booking status updated successfully',
                'data' => $booking->load(['user', 'room.roomType'])
            ]);
        } catch (\Exception $e) {
            Log::error('Booking status update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Booking $booking): JsonResponse
    {
        if (!auth()->user()->isAdmin() && auth()->id() !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->delete();
        return response()->json(['message' => 'Booking deleted successfully']);
    }

    public function userBookings(): JsonResponse
    {
        try {
            $bookings = auth()->user()->bookings()
                ->with(['room.roomType'])
                ->get();

            return response()->json($bookings);
        } catch (\Exception $e) {
            Log::error('User bookings error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to get user bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function uploadPaymentProof(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('update', $booking);

        $request->validate([
            'payment_proof' => 'required|image|max:2048',
        ]);

        $path = $request->file('payment_proof')->store('payment-proofs', 'public');
        $booking->update(['payment_proof' => $path]);

        return response()->json($booking);
    }

    private function calculateMonths($checkIn, $checkOut): int
    {
        $checkInDate = \Carbon\Carbon::parse($checkIn);
        $checkOutDate = \Carbon\Carbon::parse($checkOut);
        
        // If dates are in the same month and year, return 1
        if ($checkInDate->month === $checkOutDate->month && 
            $checkInDate->year === $checkOutDate->year) {
            return 1;
        }
        
        // Calculate months difference
        $months = ($checkOutDate->year - $checkInDate->year) * 12 + 
                ($checkOutDate->month - $checkInDate->month);
        
        // If check-out day is less than check-in day, it's not a full month
        if ($checkOutDate->day < $checkInDate->day) {
            return max(1, $months);
        }
        
        return max(1, $months);
    }
}
