<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddRoomTypeFieldsToRoomsTable extends Migration
{
    public function up()
    {
        // Step 1: Add new columns to rooms table
        Schema::table('rooms', function (Blueprint $table) {
            $table->string('name')->default('Standard')->after('id');
            $table->decimal('price', 10, 2)->default(1500000)->after('floor');
            $table->integer('capacity')->default(2)->after('price');
        });

        // Step 2: Transfer data from room_types to rooms
        if (Schema::hasTable('room_types')) {
            $rooms = DB::table('rooms')->get();
            
            foreach ($rooms as $room) {
                $roomType = DB::table('room_types')->where('id', $room->room_type_id)->first();
                
                if ($roomType) {
                    DB::table('rooms')
                        ->where('id', $room->id)
                        ->update([
                            'name' => $roomType->name,
                            'price' => $roomType->price,
                            'capacity' => $roomType->capacity,
                        ]);
                }
            }
        }
    }

    public function down()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn(['name', 'price', 'capacity']);
        });
    }
} 