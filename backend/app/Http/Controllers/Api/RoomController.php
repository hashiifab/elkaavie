<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomController extends Controller
{
    public function index(): JsonResponse
    {
        $rooms = Room::with(['roomType', 'amenities'])->get();

        return response()->json($rooms);
    }

    public function show(Room $room): JsonResponse
    {
        $room->load(['roomType', 'amenities']);

        return response()->json($room);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        // Find or create room type
        $roomType = RoomType::firstOrCreate(
            ['name' => $validated['type']],
            [
                'description' => "A {$validated['type']} room",
                'price' => $validated['price'],
                'capacity' => $validated['capacity'],
            ]
        );
        
        // Create room data
        $roomData = [
            'room_type_id' => $roomType->id,
            'number' => 'R' . substr(uniqid(), -6), // Generate a unique room number
            'floor' => rand(1, 5), // Random floor between 1-5
            'description' => $validated['description'] ?? '',
            'is_available' => $validated['is_available'] ?? true,
        ];

        $room = Room::create($roomData);
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = 'room_' . $room->id . '_' . time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/rooms', $imageName);
            
            // Update room with image URL
            $room->update([
                'image_url' => url('storage/rooms/' . $imageName),
            ]);
        }

        return response()->json($room->load(['roomType', 'amenities']), 201);
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'type' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'capacity' => 'sometimes|integer|min:1',
            'description' => 'nullable|string',
            'is_available' => 'sometimes|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        // Update room data directly
        if (isset($validated['description'])) {
            $room->description = $validated['description'];
        }
        
        if (isset($validated['is_available'])) {
            $room->is_available = $validated['is_available'];
        }
        
        // If type, price, or capacity is changed, update or create a new room type
        if (isset($validated['type']) || isset($validated['price']) || isset($validated['capacity'])) {
            // Get the existing room type
            $roomType = $room->roomType;
            
            // If type is changed, find or create a new room type
            if (isset($validated['type']) && $validated['type'] !== $roomType->name) {
                $roomType = RoomType::firstOrCreate(
                    ['name' => $validated['type']],
                    [
                        'description' => "A {$validated['type']} room",
                        'price' => $validated['price'] ?? $roomType->price,
                        'capacity' => $validated['capacity'] ?? $roomType->capacity,
                    ]
                );
                $room->room_type_id = $roomType->id;
            } else {
                // Update existing room type
                if (isset($validated['price'])) {
                    $roomType->price = $validated['price'];
                }
                
                if (isset($validated['capacity'])) {
                    $roomType->capacity = $validated['capacity'];
                }
                
                $roomType->save();
            }
        }
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($room->image_url) {
                $oldImagePath = str_replace(url('storage/'), 'public/', $room->image_url);
                Storage::delete($oldImagePath);
            }
            
            $image = $request->file('image');
            $imageName = 'room_' . $room->id . '_' . time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/rooms', $imageName);
            
            // Update room with image URL
            $room->image_url = url('storage/rooms/' . $imageName);
        }
        
        $room->save();

        return response()->json($room->load(['roomType', 'amenities']));
    }

    public function destroy(Room $room): JsonResponse
    {
        // Delete image if exists
        if ($room->image_url) {
            $imagePath = str_replace(url('storage/'), 'public/', $room->image_url);
            Storage::delete($imagePath);
        }
        
        $room->delete();

        return response()->json(null, 204);
    }

    public function available(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
        ]);

        $availableRooms = Room::where('status', 'available')
            ->where('is_available', true)
            ->whereDoesntHave('bookings', function ($query) use ($validated) {
                $query->where(function ($q) use ($validated) {
                    $q->whereBetween('check_in', [$validated['check_in'], $validated['check_out']])
                        ->orWhereBetween('check_out', [$validated['check_in'], $validated['check_out']])
                        ->orWhere(function ($q) use ($validated) {
                            $q->where('check_in', '<=', $validated['check_in'])
                                ->where('check_out', '>=', $validated['check_out']);
                        });
                });
            })
            ->with(['roomType', 'amenities'])
            ->get();

        return response()->json($availableRooms);
    }
}
