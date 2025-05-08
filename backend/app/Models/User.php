<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\HasCustomEmailVerification;

/**
 * User Model
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Carbon\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property string|null $verification_code
 * @property string $role
 * @property string|null $google_id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Booking[] $bookings
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasCustomEmailVerification;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'google_id',
        'email_verified_at',
        'verification_code',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'verification_code',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Generate a secure auto-login token for this user
     *
     * @param int $bookingId The booking ID to include in the token
     * @param int $expiresInMinutes How long the token should be valid (default: 1440 minutes = 24 hours)
     * @return string The generated token
     */
    public function createAutoLoginToken(int $bookingId, int $expiresInMinutes = 1440): string
    {
        // Create a payload with user ID, booking ID and expiration time
        $payload = [
            'user_id' => $this->id,
            'booking_id' => $bookingId,
            'expires_at' => now()->addMinutes($expiresInMinutes)->timestamp
        ];

        // Encode and sign the payload
        $jsonPayload = json_encode($payload);
        $base64Payload = base64_encode($jsonPayload);
        $signature = hash_hmac('sha256', $base64Payload, config('app.key'));

        // Return the complete token
        return $base64Payload . '.' . $signature;
    }
}
