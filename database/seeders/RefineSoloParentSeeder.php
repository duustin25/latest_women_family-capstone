<?php

namespace Database\Seeders;

use App\Models\Organization;
use Illuminate\Database\Seeder;

class RefineSoloParentSeeder extends Seeder
{
    public function run(): void
    {
        $soloParent = Organization::where('slug', 'solo-parent-federation')->first();

        if (!$soloParent) {
            // Should exist, but fail safe
            $this->command->error('Solo Parent organization not found. Run previous seeder first.');
            return;
        }

        $schema = [
            // SECTION 1: Personal Information
            [
                'type' => 'section',
                'label' => 'I. Personal Information',
            ],
            // ... (Standard Fields - Keeping existing ones, adding request specific)
            //  Common fields
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
                'id' => 'employment_status',
                'type' => 'select',
                'label' => 'Employment Status',
                'width' => 'w-1/3',
                'required' => true,
                'options' => ['Employed', 'Self-employed', 'Unemployed']
            ],

            // SECTION 2: Classification Details
            [
                'type' => 'section',
                'label' => 'II. Classification & Application Type',
            ],
            [
                'id' => 'classification',
                'type' => 'select',
                'label' => 'Classification (Solo Parent Category)',
                'width' => 'w-1/2',
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
                'id' => 'application_type',
                'type' => 'select',
                'label' => 'Application Type',
                'width' => 'w-1/2',
                'options' => ['New', 'Renewal'],
                'required' => true,
            ],


            // SECTION 3: Requirements (Dynamic based on Classification AND Application Type)
            [
                'type' => 'section',
                'label' => 'III. Requirements Checklist',
            ],

            // --- RAPE VICTIM ---
            // New
            [
                'id' => 'req_rape_new',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Rape Victim (NEW)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Rape Victim'],
                    ['application_type', 'eq', 'New']
                ],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Complaint Affidavit',
                    'Medical Records on Rape',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official (Residency & Sole Guardianship)',
                    'Income Proof: Payslip/COE (Employed) OR Certificate of No/Low Income (Unemployed)',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)'
                ]
            ],
            // Renewal
            [
                'id' => 'req_rape_renewal',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Rape Victim (RENEWAL)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Rape Victim'],
                    ['application_type', 'eq', 'Renewal']
                ],
                'options' => [
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Income Proof: Payslip/COE (Employed) OR Certificate of No/Low Income (Unemployed)',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)',
                    'Old Solo Parent ID'
                ]
            ],

            // --- LEGAL GUARDIAN ---
            // New
            [
                'id' => 'req_guardian_new',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Legal Guardian (NEW)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Legal Guardian'],
                    ['application_type', 'eq', 'New']
                ],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Proof of Guardianship / Foster Care / Adoption',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof: Payslip/COE (Employed) OR Certificate of No/Low Income (Unemployed)',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)'
                ]
            ],
            // Renewal
            [
                'id' => 'req_guardian_renewal',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Legal Guardian (RENEWAL)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Legal Guardian'],
                    ['application_type', 'eq', 'Renewal']
                ],
                'options' => [
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)',
                    'Old Solo Parent ID'
                ]
            ],

            // --- ANNULMENT ---
            // New
            [
                'id' => 'req_annulment_new',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Annulment (NEW)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Annulment'],
                    ['application_type', 'eq', 'New']
                ],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Marriage Certificate',
                    'Judicial Decree of Nullity / Annulment',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)'
                ]
            ],
            // Renewal
            [
                'id' => 'req_annulment_renewal',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Annulment (RENEWAL)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Annulment'],
                    ['application_type', 'eq', 'Renewal']
                ],
                'options' => [
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Income Proof',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)',
                    'Old Solo Parent ID'
                ]
            ],

            // --- LEGAL SEPARATION ---
            // New
            [
                'id' => 'req_sep_new',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Legal Separation (NEW)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Legal Separation'],
                    ['application_type', 'eq', 'New']
                ],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Marriage Certificate',
                    'Affidavit of 2 Disinterested Persons',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)'
                ]
            ],
            // Renewal
            [
                'id' => 'req_sep_renewal',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Legal Separation (RENEWAL)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Legal Separation'],
                    ['application_type', 'eq', 'Renewal']
                ],
                'options' => [
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Income Proof',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)',
                    'Old Solo Parent ID'
                ]
            ],

            // --- WIDOW/WIDOWER ---
            // New
            [
                'id' => 'req_widow_new',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Widow/Widower (NEW)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Widow/Widower'],
                    ['application_type', 'eq', 'New']
                ],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Marriage Certificate',
                    'Death Certificate of Spouse',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)'
                ]
            ],
            // Renewal
            [
                'id' => 'req_widow_renewal',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Widow/Widower (RENEWAL)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Widow/Widower'],
                    ['application_type', 'eq', 'Renewal']
                ],
                'options' => [
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Income Proof',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)',
                    'Old Solo Parent ID'
                ]
            ],

            // --- ABANDONMENT ---
            // New
            [
                'id' => 'req_abandon_new',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Abandonment (NEW)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Abandonment'],
                    ['application_type', 'eq', 'New']
                ],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Marriage Certificate',
                    'Affidavit of 2 Disinterested Persons',
                    'Police or Barangay Records',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)'
                ]
            ],
            // Renewal
            [
                'id' => 'req_abandon_renewal',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Abandonment (RENEWAL)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Abandonment'],
                    ['application_type', 'eq', 'Renewal']
                ],
                'options' => [
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Income Proof', // #07 referenced in prompt? Assumed income/brgy
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)',
                    'Old Solo Parent ID'
                ]
            ],

            // --- UNMARRIED ---
            // New
            [
                'id' => 'req_unmarried_new',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Unmarried (NEW)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Unmarried'],
                    ['application_type', 'eq', 'New']
                ],
                'options' => [
                    'Birth Certificate of Dependent(s)',
                    'Certificate of No Marriage (CENOMAR)',
                    'Sworn Affidavit of Sole Parental Care and Support',
                    'Affidavit of Barangay Official',
                    'Income Proof',
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)'
                ]
            ],
            // Renewal
            [
                'id' => 'req_unmarried_renewal',
                'type' => 'checkbox_group',
                'label' => 'Requirements for Unmarried (RENEWAL)',
                'width' => 'w-full',
                'visible_if' => [
                    ['classification', 'eq', 'Unmarried'],
                    ['application_type', 'eq', 'Renewal']
                ],
                'options' => [
                    'Certificate of No Marriage (CENOMAR)',
                    'Sworn Affidavit of Sole Parental Care and Support', // #03
                    'Affidavit of Barangay Official', // #04
                    'Income Proof', // #05
                    'Application Form (from PSWDD)',
                    '1x1 ID Picture (2pcs)',
                    'Old Solo Parent ID'
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
        $this->command->info('Refined Solo Parent form schema updated successfully.');
    }
}
