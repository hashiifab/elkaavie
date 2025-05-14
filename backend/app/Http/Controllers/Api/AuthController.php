<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Models\User;
use App\Notifications\SimpleEmailVerification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user',
            ]);

            // Send verification email
            try {
                $user->notify(new SimpleEmailVerification);
                Log::info('Verification email sent to: ' . $user->email);
            } catch (\Exception $e) {
                Log::error('Failed to send verification email: ' . $e->getMessage());
                // Continue with registration even if email fails
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Registration successful. Please check your email for verification code.',
                'user' => $user,
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Registration failed. Please try again.',
            ], 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'message' => 'Invalid login credentials',
                ], 401);
            }

            $user = User::where('email', $request->email)->firstOrFail();

            // Check if email is verified for non-admin users
            if (!$user->email_verified_at && $user->role !== 'admin') {
                return response()->json([
                    'message' => 'Please verify your email address first.',
                    'code' => 'EMAIL_NOT_VERIFIED'
                ], 403);
            }

            // Check if user is admin for admin routes
            if ($request->is('api/admin/*') && $user->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized: Admin access required',
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            Log::error('Login failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Login failed. Please try again.',
            ], 500);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            Auth::user()->currentAccessToken()->delete();
            return response()->json([
                'message' => 'Successfully logged out',
            ]);
        } catch (\Exception $e) {
            Log::error('Logout failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Logout failed. Please try again.',
            ], 500);
        }
    }

    public function user(): JsonResponse
    {
        return response()->json(Auth::user());
    }

    public function update(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            ]);

            $user->update($validated);

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Profile update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete the authenticated user's account and all related data
     *
     * @return JsonResponse
     */
    public function destroy(): JsonResponse
    {
        try {
            $user = Auth::user();

            // Get all bookings associated with this user to update room status
            $bookings = $user->bookings()->with('room')->get();

            // Update room status for each booking
            foreach ($bookings as $booking) {
                if ($booking->room) {
                    $booking->room->update(['is_available' => true]);
                }
            }

            // Delete all bookings associated with this user
            $user->bookings()->delete();

            // Delete the user
            $user->tokens()->delete(); // Delete all tokens
            $user->delete();

            return response()->json([
                'message' => 'Account deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Account deletion failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete account',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function resendVerificationEmail(): JsonResponse
    {
        try {
            $user = Auth::user();

            if ($user->email_verified_at) {
                return response()->json([
                    'message' => 'Email already verified.',
                ], 400);
            }

            $user->notify(new SimpleEmailVerification);
            Log::info('Resent verification email to: ' . $user->email);

            return response()->json([
                'message' => 'Verification email sent successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to resend verification email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to resend verification email.',
            ], 500);
        }
    }

    public function resendVerificationEmailForUnverified(): JsonResponse
    {
        try {
            $credentials = request()->only('email', 'password');

            if (!Auth::attempt($credentials)) {
                return response()->json([
                    'message' => 'Invalid credentials',
                ], 401);
            }

            $user = Auth::user();

            if ($user->email_verified_at) {
                return response()->json([
                    'message' => 'Email already verified.',
                ], 400);
            }

            $user->notify(new SimpleEmailVerification);
            Log::info('Resent verification email to unverified user: ' . $user->email);

            return response()->json([
                'message' => 'Verification email sent successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to resend verification email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to resend verification email.',
            ], 500);
        }
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        try {
            $code = $request->input('code');
            $user = User::where('verification_code', $code)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Invalid verification code',
                ], 400);
            }

            $user->email_verified_at = now();
            $user->verification_code = null;
            $user->save();

            return response()->json([
                'message' => 'Email verified successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Email verification failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Email verification failed',
            ], 500);
        }
    }

    public function verifyEmailAndLogin(Request $request): JsonResponse
    {
        try {
            $code = $request->input('code');
            $user = User::where('verification_code', $code)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Invalid verification code',
                ], 400);
            }

            // Verify the email
            $user->email_verified_at = now();
            $user->verification_code = null;
            $user->save();

            // Generate auth token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Email verified successfully and logged in',
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            Log::error('Email verification and login failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Email verification and login failed',
            ], 500);
        }
    }

    public function redirectToGoogle(): JsonResponse
    {
        try {
            // Save remember_me preference from query parameter if present
            if (request()->has('remember_me')) {
                session(['google_remember_me' => request()->get('remember_me')]);
            }

            $url = Socialite::driver('google')
                ->stateless()
                ->redirect()
                ->getTargetUrl();

            return response()->json(['url' => $url]);
        } catch (\Exception $e) {
            Log::error('Google redirect failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Google redirect failed. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function handleGoogleCallback(Request $request)
    {
        try {
            \Log::info('Google callback received', ['request' => $request->all()]);

            // Use stateless to avoid session issues
            $googleUser = Socialite::driver('google')->stateless()->user();
            \Log::info('Google user data received', ['email' => $googleUser->email]);

            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                \Log::info('Creating new user from Google data');
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Hash::make(Str::random(16)),
                    'email_verified_at' => now(),
                    'google_id' => $googleUser->id
                ]);
            } else if (!$user->google_id) {
                \Log::info('Updating existing user with Google ID');
                $user->update([
                    'google_id' => $googleUser->id
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            \Log::info('Auth token created for user', ['user_id' => $user->id]);

            // Get remember_me preference from session
            $rememberMe = session('google_remember_me', 'false');
            \Log::info('Remember me preference', ['remember_me' => $rememberMe]);

            // Redirect to frontend with token and remember_me parameter
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            $redirectUrl = $frontendUrl . '/auth/google/callback?token=' . $token . '&remember_me=' . $rememberMe;
            \Log::info('Redirecting to frontend', ['url' => $redirectUrl]);

            return redirect($redirectUrl);

        } catch (\Exception $e) {
            \Log::error('Google callback error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);

            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            $redirectUrl = $frontendUrl . '/login?error=google_login_failed';
            \Log::info('Redirecting to login with error', ['url' => $redirectUrl]);

            return redirect($redirectUrl);
        }
    }

    /**
     * Get all users (admin only)
     *
     * @return JsonResponse
     */
    public function getUsers(): JsonResponse
    {
        try {
            // Check if user is admin
            if (!auth()->user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.'
                ], 403);
            }

            $users = User::all();
            return response()->json([
                'message' => 'Users retrieved successfully',
                'data' => $users
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to get users: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to get users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate an auto-login redirect URL with token
     *
     * @param int $bookingId
     * @param int $userId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function generateAutoLoginRedirect($bookingId, $userId)
    {
        try {
            // Find the user
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Generate token
            $token = $user->createAutoLoginToken($bookingId);

            // Log token generation
            Log::info('Auto-login token generated for redirect', [
                'user_id' => $userId,
                'booking_id' => $bookingId,
                'token_length' => strlen($token)
            ]);

            // Redirect to frontend with token
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            $redirectUrl = $frontendUrl . '/auto-login?token=' . urlencode($token);

            return redirect($redirectUrl);
        } catch (\Exception $e) {
            Log::error('Auto-login redirect generation failed: ' . $e->getMessage());
            return redirect(config('app.frontend_url', 'http://localhost:3000') . '/login?error=auto_login_failed');
        }
    }

    /**
     * Auto-login a user using a secure token
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function autoLogin(Request $request): JsonResponse
    {
        try {
            // Validate the token parameter
            $request->validate([
                'token' => 'required|string',
            ]);

            $token = $request->input('token');

            // Log token for debugging
            Log::info('Auto-login attempt', [
                'token_length' => strlen($token),
                'token_parts' => explode('.', $token)
            ]);

            // Split token into payload and signature
            $parts = explode('.', $token);
            if (count($parts) !== 2) {
                return response()->json(['message' => 'Invalid token format'], 400);
            }

            [$base64Payload, $signature] = $parts;

            // Verify signature
            $expectedSignature = hash_hmac('sha256', $base64Payload, config('app.key'));
            if (!hash_equals($expectedSignature, $signature)) {
                return response()->json(['message' => 'Invalid token signature'], 401);
            }

            // Decode payload
            $jsonPayload = base64_decode($base64Payload);
            $payload = json_decode($jsonPayload, true);

            // Validate payload structure
            if (!isset($payload['user_id']) || !isset($payload['booking_id']) || !isset($payload['expires_at'])) {
                return response()->json(['message' => 'Invalid token payload'], 400);
            }

            // Check if token is expired
            if ($payload['expires_at'] < now()->timestamp) {
                return response()->json(['message' => 'Token has expired'], 401);
            }

            // Find the user
            $user = User::find($payload['user_id']);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Create a new token for the user
            $newToken = $user->createToken('auto-login')->plainTextToken;

            // Return the token and booking ID for redirection
            return response()->json([
                'token' => $newToken,
                'user' => $user,
                'booking_id' => $payload['booking_id'],
                'redirect_to' => "/bookings/{$payload['booking_id']}"
            ]);

        } catch (\Exception $e) {
            Log::error('Auto-login error: ' . $e->getMessage());
            return response()->json(['message' => 'Auto-login failed: ' . $e->getMessage()], 500);
        }
    }
}
