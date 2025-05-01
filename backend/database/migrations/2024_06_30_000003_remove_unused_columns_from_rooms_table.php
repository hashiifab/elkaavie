<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveUnusedColumnsFromRoomsTable extends Migration
{
    public function up()
    {
        Schema::table('rooms', function (Blueprint $table) {
            if (Schema::hasColumn('rooms', 'name')) {
                $table->dropColumn('name');
            }
            
            if (Schema::hasColumn('rooms', 'description')) {
                $table->dropColumn('description');
            }
            
            if (Schema::hasColumn('rooms', 'image_url')) {
                $table->dropColumn('image_url');
            }
        });
    }

    public function down()
    {
        Schema::table('rooms', function (Blueprint $table) {
            if (!Schema::hasColumn('rooms', 'name')) {
                $table->string('name')->default('Standard')->after('id');
            }
            
            if (!Schema::hasColumn('rooms', 'description')) {
                $table->text('description')->nullable()->after('is_available');
            }
            
            if (!Schema::hasColumn('rooms', 'image_url')) {
                $table->string('image_url')->nullable()->after('description');
            }
        });
    }
} 