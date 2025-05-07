<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Room Model
 * 
 * @property int $id
 * @property string $number
 * @property int $floor
 * @property float $price
 * @property int $capacity
 * @property string $status
 * @property bool $is_available
 * @property string|null $image_url
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'floor',
        'price',
        'capacity',
        'status',
        'is_available',
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
            'price' => 'decimal:2',
            'capacity' => 'integer',
        ];
    }

    // Relasi dengan model lain
    

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }


}