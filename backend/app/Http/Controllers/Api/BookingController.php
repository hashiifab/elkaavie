<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\BookingRequest;
use App\Http\Requests\Api\UpdateBookingStatusRequest;
use App\Models\Booking;
use App\Models\Room;
use App\Notifications\BookingApproved;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    protected $bookingService;

    /**
     * Constructor - no auth middleware used to allow public access for store method
     */
    public function __construct(BookingService $bookingService)
    {
        // Remove auth middleware since we want public access for store
        $this->bookingService = $bookingService;
    }

    /**
     * Format booking data for API response
     * Adds computed properties and asset URLs for easier frontend consumption
     *
     * @param Booking $booking - The booking model to format
     * @return Booking - The formatted booking with additional data
     */
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
            $booking->room_type = 'Standard';
            $booking->room_capacity = $booking->room->capacity ?? 1;
        }

        // Add user info if available
        if ($booking->user) {
            $booking->user_name = $booking->user->name;
            $booking->user_email = $booking->user->email;
        }

        return $booking;
    }

    /**
     * List all bookings in the system (admin only)
     * Returns a paginated list of bookings with related user and room data
     *
     * @return JsonResponse - JSON formatted list of bookings
     */
    public function index(): JsonResponse
    {
        try {
            // Ensure only admin can access this
            if (!auth()->user()->isAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Only get bookings with real users
            $bookings = Booking::with(['user', 'room'])
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
            // Log and return error
            Log::error('Booking index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new booking
     * Handles validation, file uploads, and creation of booking record
     *
     * @param BookingRequest $request - Validated booking request data
     * @return JsonResponse - Success/failure response
     */
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

            // Handle ID card file upload and store in public storage
            if ($request->hasFile('identity_card')) {
                $data['identity_card'] = $request->file('identity_card')->store('identity-cards', 'public');
                Log::info('File uploaded successfully', ['path' => $data['identity_card']]);
            }

            // Calculate duration_months if not provided
            if (!isset($data['duration_months'])) {
                // Calculate months between check-in and check-out dates
                $checkIn = new \DateTime($data['check_in']);
                $checkOut = new \DateTime($data['check_out']);
                $interval = $checkIn->diff($checkOut);
                $months = ($interval->y * 12) + $interval->m;
                $months = max(1, $months); // Ensure at least 1 month
            } else {
                $months = $data['duration_months'];
            }

            // Set default status and calculate price
            $data['status'] = BookingService::STATUS_PENDING;
            $data['total_price'] = 1500000 * $months; // Standard monthly rate

            // Always set user_id from authenticated user
            $data['user_id'] = auth()->id();

            // Ensure duration_months is set (the column exists in the database)
            if (!isset($data['duration_months'])) {
                $data['duration_months'] = $months; // Use the calculated months value
            }

            // Create the booking record in database
            $booking = Booking::create($data);
            Log::info('Booking created successfully', ['id' => $booking->id]);

            // Format response with relationships loaded
            $booking = $this->formatBookingData($booking->load(['user', 'room']));

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'data' => $booking
            ], 201);

        } catch (\Exception $e) {
            // Log error and return failure response
            Log::error('Booking creation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get details for a specific booking
     * Accessible by admin or the booking owner only
     *
     * @param Booking $booking - The booking to view (auto-resolved by Laravel route model binding)
     * @return JsonResponse - Booking details
     */
    public function show(Booking $booking): JsonResponse
    {
        try {
            $user = auth()->user();

            // Authorization check - only allow admin or booking owner
            if (!$user->isAdmin() && $user->id !== $booking->user_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Format booking data with relationships loaded
            $booking = $this->formatBookingData($booking->load(['user', 'room']));

            return response()->json([
                'success' => true,
                'data' => $booking
            ]);
        } catch (\Exception $e) {
            // Log and return error response
            Log::error('Booking show error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get booking details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update booking details (admin only)
     * Allows modification of booking dates, guests, and other details
     *
     * @param Request $request - Update data
     * @param Booking $booking - The booking to update
     * @return JsonResponse - Updated booking data
     */
    public function update(Request $request, Booking $booking): JsonResponse
    {
        // Admin-only endpoint
        if (!auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate update data
        $validated = $request->validate([
            'check_in' => 'sometimes|date',
            'check_out' => 'sometimes|date|after:check_in',
            'duration_months' => 'sometimes|integer|min:1|max:12',
            'guests' => 'sometimes|integer|min:1',
            'special_requests' => 'sometimes|string',
            'payment_method' => 'sometimes|in:credit_card,bank_transfer',
            'phone_number' => 'sometimes|string',
        ]);

        // Update booking with validated data
        $booking->update($validated);

        // Return updated booking with relationships
        return response()->json($booking->load(['user', 'room']));
    }

    /**
     * Update booking status (admin only)
     * Handles workflow state transitions and related actions
     *
     * @param UpdateBookingStatusRequest $request - Contains validated status change
     * @param Booking $booking - The booking to update
     * @return JsonResponse - Updated booking with new status
     */
    public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking): JsonResponse
    {
        try {
            // Get validated data
            $validated = $request->validated();

            // Use the service to handle status update logic
            $booking = $this->bookingService->updateStatus($booking, $validated['status']);

            return response()->json([
                'success' => true,
                'message' => 'Booking status updated successfully',
                'data' => $this->formatBookingData($booking)
            ]);
        } catch (\Exception $e) {
            // Log and return error
            Log::error('Booking status update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete functionality removed to avoid ambiguity
     * Bookings should be managed through status changes (cancelled, rejected, etc.)
     * rather than being deleted from the system
     */

    public function userBookings(): JsonResponse
    {
        try {
            $user = auth()->user();

            $bookings = Booking::where('user_id', $user->id)
                ->with(['room'])
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
        try {
            // Use Gate facade instead of $this->authorize
            Gate::authorize('uploadPaymentProof', $booking);

            $request->validate([
                'payment_proof' => 'required|image|max:2048',
            ]);

            $path = $request->file('payment_proof')->store('payment-proofs', 'public');
            $booking->update(['payment_proof' => $path]);

            // Return the full URL for the uploaded image
            return response()->json([
                'success' => true,
                'message' => 'Payment proof uploaded successfully',
                'payment_proof' => $path,
                'payment_proof_url' => asset('storage/' . $path)
            ]);
        } catch (\Exception $e) {
            Log::error('Payment proof upload error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload payment proof',
                'error' => $e->getMessage()
            ], 500);
        }
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
