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

    // Parse submission_data
    let submissionData = typeof record.submission_data === 'string'
        ? JSON.parse(record.submission_data)
        : record.submission_data || {};

    // BACKWARD COMPATIBILITY: Inject legacy fields if missing in dynamic data
    if (!submissionData.fullname && record.fullname) {
        submissionData.fullname = record.fullname;
    }
    if (!submissionData.address && record.address) {
        submissionData.address = record.address;
    }

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
            <header className="mb-8 relative">
                {/* Grid Layout for Header: Logo - Text - Logo */}
                <div className="grid grid-cols-[1.5in_1fr_1.5in] items-center gap-4 text-center">
                    {/* Left Logo */}
                    <div className="flex justify-center">
                        <img
                            src="/Logo/barangay183LOGO.png"
                            className="h-28 w-28 object-contain"
                            alt="Barangay Logo"
                        />
                    </div>

                    {/* Center Text */}
                    <div className="flex flex-col items-center justify-center">
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
                    </div>

                    {/* Right Logo */}
                    <div className="flex justify-center">
                        <img
                            src="/Logo/women&family_logo.png"
                            className="h-28 w-28 object-contain"
                            alt="WFP Logo"
                        />
                    </div>
                </div>

                {/* Application Title */}
                <div className="mt-8 text-center">
                    <h2 className="text-[14pt] font-bold uppercase underline tracking-wide">APPLICATION</h2>
                    <h3 className="text-[12pt] mt-1">{org.name}</h3>
                </div>
            </header>

            {/* --- DYNAMIC CONTENT (Replaces hardcoded sections) --- */}
            <section className="mb-6 px-2">
                <DynamicFields
                    schema={org.form_schema || []}
                    data={submissionData}
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
