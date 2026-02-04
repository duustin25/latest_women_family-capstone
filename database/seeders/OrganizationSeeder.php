<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;

class OrganizationSeeder extends Seeder
{
    public function run()
    {
        Organization::updateOrCreate(
            ['slug' => 'kalipi-association'],
            [
                'name' => 'KALIPI (Kalipunan ng Liping Pilipina)',
                'description' => 'National federation of women\'s organizations for livelihood and empowerment.',
                'president_name' => 'Maria Santos',
                'color_theme' => 'bg-purple-600',
                'requirements' => [
                    'Valid Government ID',
                    'Barangay Residency',
                    '2x2 Photo'
                ]
            ]
        );

        Organization::updateOrCreate(
            ['slug' => 'solo-parent-association'],
            [
                'name' => 'Solo Parent Association',
                'description' => 'Support group for solo parents advocating for rights and benefits under RA 8972.',
                'president_name' => 'Juan Dela Cruz',
                'color_theme' => 'bg-pink-500',
                'requirements' => [
                    'Solo Parent ID Application Form',
                    'Birth Certificate of Child',
                    'Barangay Certification'
                ]
            ]
        );
    }
}
