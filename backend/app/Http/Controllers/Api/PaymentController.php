<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function uploadPaymentProof(Request $request, Booking $booking): JsonResponse
    {
        // Validate the user owns this booking or is admin
        if ($request->user()->id !== $booking->user_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'payment_proof' => 'required|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            if ($request->hasFile('payment_proof')) {
                // Delete old payment proof if exists
                if ($booking->payment_proof) {
                    Storage::disk('public')->delete($booking->payment_proof);
                }

                // Store the new payment proof
                $path = $request->file('payment_proof')->store('payment-proofs', 'public');
                $booking->payment_proof = $path;

                // If the booking is already approved, keep it approved
                // Otherwise, set it to pending
                if ($booking->status !== 'approved') {
                    $booking->status = 'pending';
                }

                $booking->save();

                return response()->json([
                    'message' => 'Payment proof uploaded successfully',
                    'booking' => $booking
                ]);
            }

            return response()->json([
                'message' => 'No payment proof file found'
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload payment proof',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyPayment(Request $request, Booking $booking): JsonResponse
    {
        // Only admin can verify payments
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'is_verified' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $booking->status = $request->is_verified ? 'paid' : 'pending';
            $booking->save();

            return response()->json([
                'message' => $request->is_verified
                    ? 'Payment verified successfully'
                    : 'Payment verification rejected',
                'booking' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to verify payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}