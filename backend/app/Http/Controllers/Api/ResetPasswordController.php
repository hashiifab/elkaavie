<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
    public function reset(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);
        
        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->setRememberToken(Str::random(60));
                    
                    $user->save();
                    
                    event(new PasswordReset($user));
                }
            );
            
            if ($status === Password::PASSWORD_RESET) {
                return response()->json(['message' => 'Password has been reset successfully']);
            } else {
                Log::error('Password reset failed: ' . $status);
                return response()->json(['message' => trans($status)], 400);
            }
        } catch (\Exception $e) {
            Log::error('Password reset error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while resetting your password.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
} 