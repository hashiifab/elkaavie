<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\BookingRequest;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(): JsonResponse
    {
        $bookings = auth()->user()->isAdmin()
            ? Booking::with(['user', 'room.roomType'])->get()
            : auth()->user()->bookings()->with(['room.roomType'])->get();

        return response()->json($bookings);
    }

    public function store(BookingRequest $request): JsonResponse
    {
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

        $booking = Booking::create([
            'user_id' => auth()->id(),
            'room_id' => $request->room_id,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'id_card_number' => $request->id_card_number,
            'whatsapp_number' => $request->whatsapp_number,
            'total_price' => $this->calculateTotalPrice($room, $request->check_in, $request->check_out),
            'status' => 'pending',
        ]);

        return response()->json($booking->load(['room.roomType']), 201);
    }

    public function show(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        return response()->json($booking->load(['user', 'room.roomType']));
    }

    public function update(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('update', $booking);

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed,cancelled',
        ]);

        $booking->update($validated);

        if ($validated['status'] === 'approved') {
            $booking->room->update(['status' => 'booked']);
        } elseif ($validated['status'] === 'rejected' || $validated['status'] === 'cancelled') {
            $booking->room->update(['status' => 'available']);
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
