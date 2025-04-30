<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveRoomTypeIdFromRoomsTable extends Migration
{
    public function up()
    {
        Schema::table('rooms', function (Blueprint $table) {
            // Drop foreign key constraint first
            $table->dropForeign(['room_type_id']);
            // Then drop the column
            $table->dropColumn('room_type_id');
        });
    }

    public function down()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->foreignId('room_type_id')->nullable()->after('id');
        });
    }
} 