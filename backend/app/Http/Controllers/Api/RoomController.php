<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
            'room_type_id' => 'required|exists:room_types,id',
            'number' => 'required|string|unique:rooms,number',
            'floor' => 'required|integer',
            'description' => 'nullable|string',
            'amenities' => 'array',
            'amenities.*' => 'exists:amenities,id',
        ]);

        $room = Room::create($validated);

        if (isset($validated['amenities'])) {
            $room->amenities()->sync($validated['amenities']);
        }

        return response()->json($room->load(['roomType', 'amenities']), 201);
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'room_type_id' => 'sometimes|exists:room_types,id',
            'number' => 'sometimes|string|unique:rooms,number,' . $room->id,
            'floor' => 'sometimes|integer',
            'status' => 'sometimes|in:available,booked,maintenance',
            'description' => 'nullable|string',
            'amenities' => 'array',
            'amenities.*' => 'exists:amenities,id',
        ]);

        $room->update($validated);

        if (isset($validated['amenities'])) {
            $room->amenities()->sync($validated['amenities']);
        }

        return response()->json($room->load(['roomType', 'amenities']));
    }

    public function destroy(Room $room): JsonResponse
    {
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
