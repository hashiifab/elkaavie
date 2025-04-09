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
        // Remove auth middleware since we want public access for store
    }

    private function formatBookingData($booking)
    {
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

        // Add user info if available
        if ($booking->user) {
            $booking->user_name = $booking->user->name;
            $booking->user_email = $booking->user->email;
        }

        return $booking;
    }

    public function index(): JsonResponse
    {
        try {
            // Ensure only admin can access this
            if (!auth()->user()->isAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Only get bookings with real users
            $bookings = Booking::with(['user', 'room.roomType'])
                ->whereNotNull('user_id')  // Only get bookings with user_id
                ->whereHas('user')         // Ensure user exists
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($booking) {
                    return $this->formatBookingData($booking);
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
            // Ensure user is authenticated
            if (!auth()->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User must be authenticated to create a booking'
                ], 401);
            }

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
            
            // Always set user_id from authenticated user
            $data['user_id'] = auth()->id();

            // Create the booking
            $booking = Booking::create($data);
            Log::info('Booking created successfully', ['id' => $booking->id]);

            $booking = $this->formatBookingData($booking->load(['user', 'room.roomType']));

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'data' => $booking
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

            $booking = $this->formatBookingData($booking->load(['user', 'room.roomType']));

            return response()->json([
                'success' => true,
                'data' => $booking
            ]);
        } catch (\Exception $e) {
            Log::error('Booking show error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
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
            // Ensure only admin can update status
            if (!auth()->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only admin can update booking status.'
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:pending,approved,rejected,completed,cancelled',
            ]);

            // Load the booking with relationships
            $booking->load(['user', 'room.roomType']);

            // Update booking status
            $booking->update($validated);

            // Set payment due date when booking is approved
            if ($validated['status'] === 'approved') {
                // Set payment due date to 24 hours from now
                $booking->update(['payment_due_at' => now()->addHours(24)]);
                
                // Check if room exists and is available before updating
                if ($booking->room && $booking->room->is_available) {
                    $booking->room->update(['is_available' => false]);
                }
            } elseif ($validated['status'] === 'rejected' || $validated['status'] === 'completed' || $validated['status'] === 'cancelled') {
                // Check if room exists before updating
                if ($booking->room) {
                    $booking->room->update(['is_available' => true]);
                }
            }

            // Format the booking data
            $booking = $this->formatBookingData($booking);

            return response()->json([
                'success' => true,
                'message' => 'Booking status updated successfully',
                'data' => $booking
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
            $user = auth()->user();
            
            $bookings = Booking::where('user_id', $user->id)
                ->with(['room.roomType'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($booking) {
                    return $this->formatBookingData($booking);
                });

            return response()->json([
                'success' => true,
                'data' => $bookings
            ]);
        } catch (\Exception $e) {
            Log::error('User bookings error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
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

    // Add new method to associate bookings with user after login
    public function associateBookingsWithUser(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $email = $request->input('email');
            $phoneNumber = $request->input('phone_number');

            // Find bookings with matching email or phone number but no user_id
            $bookings = Booking::whereNull('user_id')
                ->where(function ($query) use ($email, $phoneNumber) {
                    $query->where('email', $email)
                        ->orWhere('phone_number', $phoneNumber);
                })
                ->get();

            // Associate found bookings with the user
            foreach ($bookings as $booking) {
                $booking->update(['user_id' => $user->id]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Bookings associated successfully',
                'count' => $bookings->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Associate bookings error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to associate bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
