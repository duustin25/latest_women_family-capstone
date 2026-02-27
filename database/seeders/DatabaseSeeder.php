<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 2. Create Super Admin (The Overseer)
        User::factory()->create([
            'name' => 'Dustin Los Bandido',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('dustin123'),
            'role' => User::ROLE_ADMIN,
        ]);

        // 3. Create Head Committee (The Protector - VAWC)
        User::factory()->create([
            'name' => 'Officer Sarah (VAWC)',
            'email' => 'vawc@gmail.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_HEAD,
        ]);

    }
}
