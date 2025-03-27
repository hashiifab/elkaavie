<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\BookingRequest;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class BookingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(): JsonResponse
    {
        try {
            if (!auth()->check()) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $user = auth()->user();
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $bookings = $user->isAdmin()
                ? Booking::with(['user', 'room.roomType'])->get()
                : $user->bookings()->with(['room.roomType'])->get();

            return response()->json($bookings);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(BookingRequest $request): JsonResponse
    {
        try {
            $room = Room::findOrFail($request->room_id);

            // Check if room is available for the selected dates
            $isAvailable = !$room->bookings()
                ->where(function ($query) use ($request) {
                    $query->whereBetween('check_in', [$request->check_in, $request->check_out])
                        ->orWhereBetween('check_out', [$request->check_in, $request->check_out])
                        ->orWhere(function ($q) use ($request) {
                            $q->where('check_in', '<=', $request->check_in)
                                ->where('check_out', '>=', $request->check_out);
                        });
                })
                ->exists();

            if (!$isAvailable) {
                return response()->json([
                    'message' => 'Room is not available for the selected dates',
                ], 422);
            }

            // Store the identity card image
            $identityCardPath = $request->file('identity_card')->store('identity-cards', 'public');

            $booking = Booking::create([
                'user_id' => auth()->id(),
                'room_id' => $request->room_id,
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
                'guests' => $request->guests,
                'special_requests' => $request->special_requests,
                'payment_method' => $request->payment_method,
                'phone_number' => $request->phone_number,
                'identity_card' => $identityCardPath,
                'total_price' => $this->calculateTotalPrice($room, $request->check_in, $request->check_out),
                'status' => 'pending',
            ]);

            return response()->json($booking->load(['room.roomType']), 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to process your booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Booking $booking): JsonResponse
    {
        if (!auth()->user()->isAdmin() && auth()->id() !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($booking->load(['user', 'room.roomType']));
    }

    public function update(Request $request, Booking $booking): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed,cancelled',
        ]);

        $booking->update($validated);

        if ($validated['status'] === 'approved') {
            $booking->room->update(['is_available' => false]);
        } elseif ($validated['status'] === 'rejected' || $validated['status'] === 'cancelled') {
            $booking->room->update(['is_available' => true]);
        }

        return response()->json($booking->load(['user', 'room.roomType']));
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

    private function calculateTotalPrice(Room $room, string $checkIn, string $checkOut): float
    {
        $checkInDate = \Carbon\Carbon::parse($checkIn);
        $checkOutDate = \Carbon\Carbon::parse($checkOut);
        $nights = $checkInDate->diffInDays($checkOutDate);

        return $room->roomType->price * $nights;
    }
}
