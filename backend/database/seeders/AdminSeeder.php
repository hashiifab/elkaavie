<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@elkaavie.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $this->command->info('Admin user created successfully!');
    }
} 