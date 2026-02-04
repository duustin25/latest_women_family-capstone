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
        // 1. Create Core Organizations
        $kalipi = \App\Models\Organization::create([
            'name' => 'KALIPI',
            'slug' => 'kalipi',
            'description' => 'Kalipunan ng Liping Pilipina - Women\'s Organization',
            'color_theme' => 'bg-purple-600',
        ]);

        $soloParent = \App\Models\Organization::create([
            'name' => 'Solo Parents Assessment',
            'slug' => 'solo-parents',
            'description' => 'Association for Solo Parents of Brgy 183',
            'color_theme' => 'bg-orange-500',
        ]);

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

        // 4. Create Org President (KALIPI)
        User::factory()->create([
            'name' => 'Madam President (KALIPI)',
            'email' => 'kalipi@gmail.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_PRESIDENT,
            'organization_id' => $kalipi->id,
        ]);

        // 5. Create Org President (Solo Parents)
        User::factory()->create([
            'name' => 'Sir President (SoloP)',
            'email' => 'solo@gmail.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_PRESIDENT,
            'organization_id' => $soloParent->id,
        ]);
    }
}
