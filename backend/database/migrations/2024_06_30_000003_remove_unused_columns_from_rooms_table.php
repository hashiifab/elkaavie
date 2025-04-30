<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveUnusedColumnsFromRoomsTable extends Migration
{
    public function up()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn(['name', 'description', 'image_url']);
        });
    }

    public function down()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->string('name')->default('Standard')->after('id');
            $table->text('description')->nullable()->after('is_available');
            $table->string('image_url')->nullable()->after('description');
        });
    }
} 