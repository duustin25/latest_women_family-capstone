import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DynamicFields from '@/components/DynamicFields';

interface PrintProps {
    application: any;
    organization: any;
}

export default function Print({ application, organization }: PrintProps) {
    const record = application.data;
    const org = organization.data;

    // Parse form_data
    let formData = typeof record.form_data === 'string'
        ? JSON.parse(record.form_data)
        : record.form_data || {};

    // BACKWARD COMPATIBILITY: Inject legacy fields if missing in dynamic data
    if (!formData.fullname && record.fullname) {
        formData.fullname = record.fullname;
    }
    if (!formData.address && record.address) {
        formData.address = record.address;
    }

    // Print settings
    const printSettings = org.print_settings || {
        form_title: 'APPLICATION',
        alignment: 'center',
        include_barangay_header: true,
        left_logo_url: '/Logo/barangay183LOGO.png',
        right_logo_url: '/Logo/women&family_logo.png',
    };

    // Auto-trigger print dialog on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white min-h-screen text-black p-0 mx-auto" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '8.5in' }}>
            <Head title={`Print Application - ${record.fullname}`} />

            {/* --- OFFICIAL HEADER --- */}
            <header className={`mb-8 relative pb-4 ${printSettings.alignment === 'left' ? 'text-left' : 'text-center'}`}>
                <div className={`grid ${printSettings.alignment === 'left' ? 'grid-cols-[auto_1fr] md:grid-cols-[1.5in_1fr]' : 'grid-cols-[1.5in_1fr_1.5in]'} items-center gap-4`}>
                    {/* Left Logo */}
                    {(printSettings.alignment === 'center' || printSettings.left_logo_url) && (
                        <div className={`flex ${printSettings.alignment === 'left' ? 'justify-start' : 'justify-center'}`}>
                            {printSettings.left_logo_url && (
                                <img src={printSettings.left_logo_url} className="h-28 w-28 object-contain" alt="Left Logo" />
                            )}
                        </div>
                    )}

                    {/* Center Text */}
                    <div className={`flex flex-col ${printSettings.alignment === 'left' ? 'items-start justify-center' : 'items-center justify-center'}`}>
                        {printSettings.include_barangay_header !== false && (
                            <>
                                <p className="text-[12pt] leading-tight">Republic of the Philippines</p>
                                <h1 className="text-[14pt] font-bold uppercase leading-tight mt-1">
                                    {import.meta.env.VITE_BARANGAY_NAME}
                                </h1>
                                <p className="text-[11pt] leading-tight mt-1">
                                    {import.meta.env.VITE_BARANGAY_ADDRESS}
                                </p>
                                <p className="text-[11pt] leading-tight text-gray-800">
                                    {import.meta.env.VITE_BARANGAY_LANDLINE}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Right Logo */}
                    {printSettings.alignment === 'center' && (
                        <div className="flex justify-center">
                            {printSettings.right_logo_url && (
                                <img src={printSettings.right_logo_url} className="h-28 w-28 object-contain" alt="Right Logo" />
                            )}
                        </div>
                    )}
                </div>

                {/* Application Title */}
                <div className={`mt-8 ${printSettings.alignment === 'left' ? 'text-left' : 'text-center'}`}>
                    <h2 className={`text-[14pt] font-bold uppercase tracking-wide ${printSettings.alignment === 'center' ? 'underline' : ''}`}>
                        {printSettings.form_title || 'APPLICATION'}
                    </h2>
                    <h3 className="text-[12pt] mt-1 font-bold">{org.name}</h3>
                </div>
            </header>

            {/* --- DYNAMIC CONTENT (Replaces hardcoded sections) --- */}
            <section className="mb-6 px-2">
                <DynamicFields
                    schema={org.form_schema || []}
                    data={formData}
                    setData={() => { }} // Read-only for print
                    mode="view"
                />
            </section>

            {/* --- SIGNATURES --- */}
            <section className="mt-16 px-2 text-[11pt] break-inside-avoid">
                <div className="flex justify-end mb-16">
                    <div className="text-center w-64">
                        <div className="h-8 border-b border-black mb-1 relative font-bold">
                            {record.fullname}
                        </div>
                        <p className="italic text-[10pt]">Applicant's Signature over Printed name</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mt-8">
                    <div className="text-center">
                        <p className="mb-8 italic text-left pl-8">Noted by:</p>
                        <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                        <p className="font-bold">Kagawad In-Charge</p>
                    </div>

                    <div className="text-center">
                        <p className="mb-8 italic text-left pl-8">Recommending Approval:</p>
                        <div className="border-b border-black w-3/4 mx-auto mb-1 font-bold">
                            {org.president_name || 'Kathleen Kaye D. Amarille'}
                        </div>
                        <p className="font-bold">{org.name} President</p>
                    </div>
                </div>

                <div className="text-center mt-12 w-1/2 mx-auto">
                    <p className="mb-8 italic">Approved by:</p>
                    <div className="border-b border-black w-full mb-1 font-bold uppercase">
                        Gerald John M. Sobrevega
                    </div>
                    <p className="font-bold">BARANGAY KAGAWAD</p>
                    <p className="text-[10pt]">Committee Head, Women and Family</p>
                </div>
            </section>

            <style>
                {`
                    @media print {
                        @page { 
                            size: letter; 
                            margin: 1in; 
                        }
                        body { 
                            -webkit-print-color-adjust: exact; 
                        }
                    }
                    /* Screen preview simulation */
                    @media screen {
                        body {
                            background: #f0f0f0;
                            padding: 2rem;
                        }
                        div[class*="min-h-screen"] {
                            margin: 0 auto;
                            padding: 1in; /* Match print margin for preview */
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                    }
                `}
            </style>
        </div>
    );
}
