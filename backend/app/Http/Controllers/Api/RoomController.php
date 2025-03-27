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
        $rooms = Room::with('roomType')->get();

        return response()->json($rooms);
    }

    public function show(Room $room): JsonResponse
    {
        $room->load('roomType');

        return response()->json($room);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'number' => 'required|string',
            'floor' => 'required|integer|between:1,3',
            'type' => 'required|string',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
        ]);
        
        // Check if room number already exists
        $existingRoom = Room::where('number', $validated['number'])->first();
        if ($existingRoom) {
            return response()->json([
                'message' => 'Room with this number already exists',
            ], 422);
        }
        
        // Find or create room type
        $roomType = RoomType::firstOrCreate(
            ['name' => $validated['type']],
            [
                'description' => "A {$validated['type']} room",
                'price' => $validated['price'],
                'capacity' => 2, // Default capacity
            ]
        );
        
        // Create room
        $room = new Room();
        $room->room_type_id = $roomType->id;
        $room->number = $validated['number'];
        $room->floor = $validated['floor'];
        $room->status = 'available';
        $room->description = $validated['description'] ?? null;
        $room->is_available = $validated['is_available'] ?? true;
        $room->save();
        
        return response()->json($room->load('roomType'), 201);
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'price' => 'sometimes|numeric|min:0',
            'is_available' => 'sometimes|boolean',
        ]);
        
        // Update room availability
        if (isset($validated['is_available'])) {
            $room->is_available = $validated['is_available'];
        }
        
        // Update room type price if provided
        if (isset($validated['price'])) {
            $roomType = $room->roomType;
            $roomType->price = $validated['price'];
            $roomType->save();
        }
        
        $room->save();
        
        return response()->json($room->load('roomType'));
    }

    public function destroy(Room $room): JsonResponse
    {
        $room->delete();
        
        return response()->json(['message' => 'Room deleted successfully']);
    }

    public function toggleAvailability(Room $room): JsonResponse
    {
        $room->is_available = !$room->is_available;
        $room->save();
        
        return response()->json(['is_available' => $room->is_available]);
    }
    
    public function initialize(): JsonResponse
    {
        // Delete existing rooms first to avoid conflicts
        Room::query()->delete();
        
        // Create a default room type with the standardized price of 1,500,000
        $roomType = RoomType::firstOrCreate(
            ['name' => 'Standard'],
            [
                'description' => 'Comfortable standard room, fully furnished',
                'price' => 1500000, // Rp 1,500,000 per month as requested
                'capacity' => 2,
            ]
        );
        
        // Update price if the room type already existed
        if ($roomType->price != 1500000) {
            $roomType->price = 1500000;
            $roomType->save();
        }
        
        // Create rooms using the floor-based naming scheme (A1-A5, B1-B5, C1-C5)
        $rooms = [];
        $floorPrefixes = [1 => 'A', 2 => 'B', 3 => 'C'];
        
        for ($floor = 1; $floor <= 3; $floor++) {
            $prefix = $floorPrefixes[$floor];
            
            for ($i = 1; $i <= 5; $i++) {
                $roomNumber = $prefix . $i; // This creates A1, A2, ..., B1, B2, ..., etc.
                
                $room = Room::create([
                    'room_type_id' => $roomType->id,
                    'number' => $roomNumber,
                    'floor' => $floor,
                    'status' => 'available',
                    'is_available' => true,
                    'description' => "Standard room on floor $floor",
                ]);
                $rooms[] = $room;
            }
        }
        
        return response()->json([
            'message' => 'Rooms initialized successfully', 
            'count' => count($rooms)
        ]);
    }
}
