<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ForgotPasswordRequest;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            // Check if user exists
            $user = User::where('email', $request->email)->first();
            
            if (!$user) {
                return response()->json([
                    'message' => 'We could not find a user with that email address.',
                ], 404);
            }

            // Send password reset link
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                Log::info('Password reset link sent to: ' . $request->email);
                return response()->json([
                    'message' => 'Password reset link sent to your email address.',
                ]);
            }

            Log::error('Password reset failed for: ' . $request->email . ' Status: ' . $status);
            return response()->json([
                'message' => 'Unable to send password reset link. Please try again later.',
            ], 400);
        } catch (\Exception $e) {
            Log::error('Password reset error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while processing your request. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
} 