<?php

namespace Database\Seeders;

use App\Models\Organization;
use Illuminate\Database\Seeder;

class SoloParentFormSeeder extends Seeder
{
    public function run(): void
    {
        $soloParent = Organization::where('slug', 'solo-parent-federation')->first();

        if (!$soloParent) {
            $soloParent = Organization::create([
                'name' => 'Solo Parent Federation',
                'slug' => 'solo-parent-federation',
                'description' => 'Organization for Solo Parents in the community.',
                'president_name' => 'Jane Doe', // Default placeholder
                'color_theme' => 'bg-emerald-600',
                'requirements' => [],
            ]);
        }

        $schema = [
            // SECTION 1: Personal Information (Already partially covered by standard fields, but adding specific ones)
            [
                'type' => 'section',
                'label' => 'I. Personal Information',
            ],
            [
                'id' => 'place_of_birth',
                'type' => 'text',
                'label' => 'Place of Birth',
                'width' => 'w-1/2',
                'required' => true,
            ],
            [
                'id' => 'date_of_birth',
                'type' => 'date',
                'label' => 'Date of Birth',
                'width' => 'w-1/4',
                'required' => true,
            ],
            [
                'id' => 'sex',
                'type' => 'select',
                'label' => 'Sex',
                'width' => 'w-1/4',
                'options' => ['Male', 'Female'],
                'required' => true,
            ],
            [
                'id' => 'civil_status',
                'type' => 'select',
                'label' => 'Civil Status',
                'width' => 'w-1/3',
                'options' => ['Single', 'Annulled', 'Separated', 'Widow/Widower'],
                'required' => true,
            ],
            [
                'id' => 'educational_attainment',
                'type' => 'select',
                'label' => 'Educational Attainment',
                'width' => 'w-1/3',
                'options' => ['Elementary', 'High School', 'College', 'Vocational', 'Post Graduate', 'None'],
                'required' => true,
            ],
            [
                'id' => 'occupation',
                'type' => 'text',
                'label' => 'Occupation',
                'width' => 'w-1/3',
                'required' => true,
            ],
            [
                'id' => 'monthly_income',
                'type' => 'number',
                'label' => 'Monthly Income',
                'width' => 'w-1/3',
                'required' => true,
            ],
            [
                'id' => 'contact_number',
                'type' => 'text',
                'label' => 'Contact Number',
                'width' => 'w-1/3',
                'required' => true,
            ],
            [
                'id' => 'pantawid_beneficiary',
                'type' => 'radio',
                'label' => 'Pantawid Pamilya Beneficiary?',
                'width' => 'w-1/3',
                'options' => ['Yes', 'No'],
                'required' => true,
            ],


            // SECTION 2: Classification / Circumstances of Being a Solo Parent
            [
                'type' => 'section',
                'label' => 'II. Classification / Circumstances',
            ],
            [
                'id' => 'classification',
                'type' => 'select',
                'label' => 'Classification',
                'width' => 'w-full',
                'options' => [
                    'Rape Victim',
                    'Legal Guardian',
                    'Annulment',
                    'Legal Separation',
                    'Widow/Widower',
                    'Abandonment',
                    'Unmarried'
                ],
                'required' => true,
            ],
            [
                'id' => 'needs_problems',
                'type' => 'textarea',
                'label' => 'Needs / Problems of Solo Parent',
                'width' => 'w-full',
                'required' => true,
            ],
            [
                'id' => 'family_resources',
                'type' => 'textarea',
                'label' => 'Family Resources',
                'width' => 'w-full',
                'required' => false,
            ],


            // SECTION 3: Requirements (Conditional based on Classification)
            [
                'type' => 'section',
                'label' => 'III. Requirements Checklist',
            ],
            // RAPE VICTIM REQUIREMENTS
            [
                'id' => 'req_rape_victim',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Rape Victim',
                'width' => 'w-full',
                'visible_if' => ['classification', 'eq', 'Rape Victim'],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Complaint Affidavit',
                    'Medical Records on Rape',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official (Residency & Sole Guardianship)',
                    'Income Proof: Payslip/COE (Employed) OR Certificate of No/Low Income (Unemployed)'
                ]
            ],
            // LEGAL GUARDIAN REQUIREMENTS
            [
                'id' => 'req_legal_guardian',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Legal Guardian',
                'width' => 'w-full',
                'visible_if' => ['classification', 'eq', 'Legal Guardian'],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Proof of Guardianship / Foster Care / Adoption',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof: Payslip/COE (Employed) OR Certificate of No/Low Income (Unemployed)'
                ]
            ],
            // ANNULMENT REQUIREMENTS
            [
                'id' => 'req_annulment',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Annulment',
                'width' => 'w-full',
                'visible_if' => ['classification', 'eq', 'Annulment'],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Marriage Certificate',
                    'Judicial Decree of Nullity / Annulment',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof: Payslip/COE (Employed) OR Certificate of No/Low Income (Unemployed)'
                ]
            ],
            // LEGAL SEPARATION REQUIREMENTS
            [
                'id' => 'req_legal_separation',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Legal Separation',
                'width' => 'w-full',
                'visible_if' => ['classification', 'eq', 'Legal Separation'],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Marriage Certificate',
                    'Affidavit of 2 Disinterested Persons',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof: Payslip/COE (Employed) OR Certificate of No/Low Income (Unemployed)'
                ]
            ],
            // WIDOW/WIDOWER REQUIREMENTS
            [
                'id' => 'req_widow',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Widow/Widower',
                'width' => 'w-full',
                'visible_if' => ['classification', 'eq', 'Widow/Widower'],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Marriage Certificate',
                    'Death Certificate of Spouse',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof: Payslip/COE (Employed) OR Certificate of No/Low Income (Unemployed)'
                ]
            ],
            // ABANDONMENT REQUIREMENTS
            [
                'id' => 'req_abandonment',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Abandonment',
                'width' => 'w-full',
                'visible_if' => ['classification', 'eq', 'Abandonment'],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Marriage Certificate',
                    'Affidavit of 2 Disinterested Persons',
                    'Police or Barangay Records',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof: Payslip/COE (Employed) OR Certificate of No/Low Income (Unemployed)'
                ]
            ],
            // UNMARRIED REQUIREMENTS
            [
                'id' => 'req_unmarried',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Unmarried',
                'width' => 'w-full',
                'visible_if' => ['classification', 'eq', 'Unmarried'],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Certificate of No Marriage (CENOMAR)',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof: Payslip/COE (Employed) OR Certificate of No/Low Income (Unemployed)'
                ]
            ],

            // SECTION 4: Family Composition (Dependents)
            [
                'type' => 'section',
                'label' => 'IV. Family Composition',
            ],
            [
                'id' => 'family_composition',
                'type' => 'repeater',
                'label' => 'Dependent(s) / Children',
                'width' => 'w-full',
                'schema' => [
                    [
                        'id' => 'name',
                        'type' => 'text',
                        'label' => 'Full Name',
                        'width' => 'w-1/4'
                    ],
                    [
                        'id' => 'relationship',
                        'type' => 'text',
                        'label' => 'Relationship',
                        'width' => 'w-1/4'
                    ],
                    [
                        'id' => 'age',
                        'type' => 'number',
                        'label' => 'Age',
                        'width' => 'w-1/6'
                    ],
                    [
                        'id' => 'birthday',
                        'type' => 'date',
                        'label' => 'Birthday',
                        'width' => 'w-1/4'
                    ],
                    [
                        'id' => 'status',
                        'type' => 'select',
                        'label' => 'Status',
                        'width' => 'w-1/4',
                        'options' => ['Single', 'Married', 'Employed', 'Student']
                    ]
                ]
            ]
        ];

        $soloParent->update(['form_schema' => $schema]);
        $this->command->info('Solo Parent form schema updated successfully.');
    }
}
