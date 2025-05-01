<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomController extends Controller
{
    public function index(): JsonResponse
    {
        $rooms = Room::all();
        return response()->json($rooms);
    }

    public function show(Room $room): JsonResponse
    {
        return response()->json($room);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'number' => 'required|string',
            'floor' => 'required|integer|between:1,3',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'is_available' => 'boolean',
        ]);
        
        // Check if room number already exists
        $existingRoom = Room::where('number', $validated['number'])->first();
        if ($existingRoom) {
            return response()->json([
                'message' => 'Room with this number already exists',
            ], 422);
        }
        
        // Create room with standardized info
        $room = new Room();
        $room->number = $validated['number'];
        $room->floor = $validated['floor'];
        $room->price = $validated['price'];
        $room->capacity = $validated['capacity'];
        $room->status = 'available';
        $room->is_available = $validated['is_available'] ?? true;
        $room->save();
        
        return response()->json($room, 201);
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'price' => 'sometimes|numeric|min:0',
            'capacity' => 'sometimes|integer|min:1',
            'is_available' => 'sometimes|boolean',
        ]);
        
        // Update room fields directly
        if (isset($validated['price'])) {
            $room->price = $validated['price'];
        }
        
        if (isset($validated['capacity'])) {
            $room->capacity = $validated['capacity'];
        }
        
        if (isset($validated['is_available'])) {
            $room->is_available = $validated['is_available'];
        }
        
        $room->save();
        
        return response()->json($room);
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
        
        // Create rooms using the floor-based naming scheme (A1-A5, B1-B5)
        $rooms = [];
        $floorPrefixes = [1 => 'A', 2 => 'B'];
        
        for ($floor = 1; $floor <= 2; $floor++) {
            $prefix = $floorPrefixes[$floor];
            
            for ($i = 1; $i <= 5; $i++) {
                $roomNumber = $prefix . $i; // This creates A1, A2, ..., B1, B2, etc.
                
                $room = Room::create([
                    'number' => $roomNumber,
                    'floor' => $floor,
                    'price' => 1500000, // Rp 1,500,000 per month as standardized
                    'capacity' => 1,
                    'status' => 'available',
                    'is_available' => true,
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
