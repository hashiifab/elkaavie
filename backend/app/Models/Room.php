<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
            'price' => 'decimal:2',
            'capacity' => 'integer',
        ];
    }

    // Untuk kompatibilitas dengan frontend, metode ini akan mengembalikan 
    // data yang mirip dengan RoomType
    public function getRoomTypeAttribute()
    {
        return [
            'id' => $this->id,
            'name' => 'Standard',
            'price' => $this->price,
            'capacity' => $this->capacity,
        ];
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class);
    }
} 