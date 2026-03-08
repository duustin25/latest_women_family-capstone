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
        // 1. Create Super Admin (System Administrator)
        $admin = User::factory()->create([
            'name' => 'Gerald Sobrevega',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'), // simple password for testing
            'role' => User::ROLE_ADMIN,
        ]);

        // 2. Add Gerald to the Public-Facing Officials Chart
        // We link this to the Users table because the public chart 
        // represents the "Office Structure", while Users represent "System Logins".
        \App\Models\OrganizationalMember::create([
            'user_id' => $admin->id,
            'position' => 'Head Committee',
            'committee' => 'Office of the Women and Family',
            'level' => 'head',
            'display_order' => 1,
            'is_active' => true,
        ]);

        // 3. Create Sample Staff/Officer (VAWC)
        User::factory()->create([
            'name' => 'Officer Sarah (VAWC)',
            'email' => 'vawc@gmail.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_HEAD,
        ]);

        // ==========================================
        // MOCK DATA FOR MOCK DEFENSE
        // ==========================================

        // 4. Create 5 Organizations and their Presidents
        $orgs = [
            ['name' => 'KALIPI Women\'s Federation', 'desc' => 'Kalipunan ng Liping Pilipina, empowering women across the barangay.', 'president' => 'Maria Santos'],
            ['name' => 'SOLO PARENT Association', 'desc' => 'Support group and livelihood cooperative for solo parents.', 'president' => 'Juanita dela Cruz'],
            ['name' => 'ERPAT', 'desc' => 'Empowerment and Reaffirmation of Paternal Abilities Training.', 'president' => 'Roberto Bautista'],
            ['name' => 'KABAHAGI', 'desc' => 'Community volunteers for disaster risk reduction and social welfare.', 'president' => 'Elena Reyes'],
            ['name' => 'Villamor Childrens Organization (VCO)', 'desc' => 'Advocating for children\'s rights, education, and nutrition. ', 'president' => 'Carmela Reyes'],
        ];

        foreach ($orgs as $index => $orgData) {
            $org = \App\Models\Organization::create([
                'name' => $orgData['name'],
                'description' => $orgData['desc'],
                'color_theme' => ['bg-blue-600', 'bg-red-600', 'bg-green-600', 'bg-orange-600', 'bg-purple-600'][$index],
            ]);

            // Create the President User and link to the Org
            User::factory()->create([
                'name' => $orgData['president'],
                'email' => 'president' . ($index + 1) . '@gmail.com',
                'password' => bcrypt('password'),
                'role' => User::ROLE_PRESIDENT,
                'organization_id' => $org->id,
            ]);
        }
    }
}
