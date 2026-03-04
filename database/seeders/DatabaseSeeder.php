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

        // 5. Create 10 Mock Case Reports
        // We need some lookup statuses first
        $statusNew = \App\Models\CaseStatus::firstOrCreate(['name' => 'Pending Review', 'type' => 'Both', 'is_active' => true]);
        $statusOngoing = \App\Models\CaseStatus::firstOrCreate(['name' => 'Under Investigation', 'type' => 'Both', 'is_active' => true]);
        $statusResolved = \App\Models\CaseStatus::firstOrCreate(['name' => 'Case Closed/Resolved', 'type' => 'Both', 'is_active' => true]);

        $abuseType = \App\Models\CaseAbuseType::firstOrCreate(['name' => 'Physical Abuse', 'category' => 'VAWC', 'is_active' => true]);

        $cases = [
            ['vic' => 'Juana M.', 'comp' => 'Pedro M.', 'type' => 'VAWC', 'desc' => 'Neighbor reported loud shouting and physical altercation.', 'status' => 'New', 'status_id' => $statusNew->id],
            ['vic' => 'K. Lim', 'comp' => 'Anonymous', 'type' => 'BCPC', 'desc' => 'Child found wandering alone late at night.', 'status' => 'Ongoing', 'status_id' => $statusOngoing->id],
            ['vic' => 'Anita Perez', 'comp' => 'Anita Perez', 'type' => 'VAWC', 'desc' => 'Seeking protection order against estranged partner.', 'status' => 'Resolved', 'status_id' => $statusResolved->id],
            ['vic' => 'Rene O.', 'comp' => 'School Principal', 'type' => 'BCPC', 'desc' => 'Signs of physical abuse noticed by class adviser.', 'status' => 'Ongoing', 'status_id' => $statusOngoing->id],
            ['vic' => 'Lourdes C.', 'comp' => 'Lourdes C.', 'type' => 'VAWC', 'desc' => 'Verbal abuse and economic deprivation.', 'status' => 'New', 'status_id' => null],
            ['vic' => 'Baby Boy R.', 'comp' => 'Health Worker', 'type' => 'BCPC', 'desc' => 'Severe malnutrition and neglect reported by BHW.', 'status' => 'Resolved', 'status_id' => $statusResolved->id],
            ['vic' => 'Teresa G.', 'comp' => 'Sister', 'type' => 'VAWC', 'desc' => 'Victim locked inside the house by husband.', 'status' => 'Ongoing', 'status_id' => $statusOngoing->id],
            ['vic' => 'J. Santos', 'comp' => 'Kagawad on Duty', 'type' => 'BCPC', 'desc' => 'Curfew violation involving minors drinking liquor.', 'status' => 'Resolved', 'status_id' => $statusResolved->id],
            ['vic' => 'Maria L.', 'comp' => 'Maria L.', 'type' => 'VAWC', 'desc' => 'Cyber harassment from ex-boyfriend.', 'status' => 'New', 'status_id' => null],
            ['vic' => 'P. Cruz', 'comp' => 'Social Worker', 'type' => 'BCPC', 'desc' => 'Bullying incident inside the barangay covered court.', 'status' => 'Resolved', 'status_id' => $statusResolved->id],
        ];

        foreach ($cases as $index => $c) {
            \App\Models\CaseReport::create([
                'case_number' => $c['type'] . '-202603' . str_pad($index + 1, 2, '0', STR_PAD_LEFT),
                'type' => $c['type'],
                'victim_name' => $c['vic'],
                'victim_age' => rand(7, 45),
                'victim_gender' => $c['type'] == 'VAWC' ? 'Female' : (rand(0, 1) ? 'Male' : 'Female'),
                'complainant_name' => $c['comp'],
                'incident_date' => now()->subDays(rand(1, 45)),
                'incident_location' => 'Zone ' . rand(1, 7) . ', Brgy 183',
                'description' => $c['desc'],
                'lifecycle_status' => $c['status'],
                'case_status_id' => $c['status_id'],
                'abuse_type_id' => $abuseType->id,
                'handled_by_id' => $c['status'] !== 'New' ? $admin->id : null,
            ]);
        }
    }
}
