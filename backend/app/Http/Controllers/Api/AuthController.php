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

            // Check if email is verified
            if (!$user->email_verified_at) {
                return response()->json([
                    'message' => 'Please verify your email address first.',
                    'code' => 'EMAIL_NOT_VERIFIED'
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
}
