<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropRoomTypesTable extends Migration
{
    public function up()
    {
        Schema::dropIfExists('room_types');
    }

    public function down()
    {
        // Recreate room_types table if we need to roll back
        Schema::create('room_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->integer('capacity');
            $table->timestamps();
        });
    }
} 