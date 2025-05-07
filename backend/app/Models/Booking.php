<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Booking Model
 * 
 * @property int $id
 * @property int $user_id
 * @property int $room_id
 * @property \Carbon\Carbon $check_in
 * @property \Carbon\Carbon $check_out
 * @property string $status
 * @property int $guests
 * @property string|null $special_requests
 * @property string|null $payment_method
 * @property string|null $phone_number
 * @property string|null $identity_card
 * @property float $total_price
 * @property string|null $payment_proof
 * @property \Carbon\Carbon|null $payment_due_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * 
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Room $room
 */
class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'room_id',
        'check_in',
        'check_out',
        'status',
        'guests',
        'special_requests',
        'payment_method',
        'phone_number',
        'identity_card',
        'total_price',
        'payment_proof',
        'payment_due_at',
    ];

    protected function casts(): array
    {
        return [
            'check_in' => 'date',
            'check_out' => 'date',
            'total_price' => 'decimal:2',
            'payment_due_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}