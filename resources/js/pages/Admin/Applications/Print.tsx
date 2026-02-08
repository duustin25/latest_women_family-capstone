import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

interface PrintProps {
    application: any;
    organization: any;
}

export default function Print({ application, organization }: PrintProps) {
    const record = application.data;
    const org = organization.data;
    const submission = record.submission_data || {};

    // Auto-trigger print dialog on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 500); // 500ms delay to ensure images load
        return () => clearTimeout(timer);
    }, []);

    // Helper to format values (handle arrays like checkboxes)
    const formatAnswer = (value: any) => {
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (!value) return 'N/A';
        return value;
    };

    return (
        <div className="bg-white min-h-screen text-black font-serif p-8 md:p-12 max-w-[8.5in] mx-auto">
            <Head title={`Print Application - ${record.fullname}`} />

            {/* --- OFFICIAL HEADER --- */}
            <header className="text-center mb-10 border-b-2 border-black pb-6">
                <div className="flex justify-center items-center gap-6 mb-4">
                    <img src="/Logo/women&family_logo.png" className="h-20 w-auto object-contain grayscale" alt="Logo" />
                    <div>
                        <p className="text-sm uppercase tracking-widest font-bold">Republic of the Philippines</p>
                        <p className="text-sm uppercase tracking-widest font-bold">City of Pasay</p>
                        <h1 className="text-xl font-black uppercase tracking-widest mt-1">Barangay 183 Villamor</h1>
                        <p className="text-xs uppercase font-bold mt-1">Office of the Punong Barangay</p>
                    </div>
                    {/* Placeholder for Barangay Logo if desired, duplicating left logo for symmetry */}
                    <div className="h-20 w-20 opacity-0"></div>
                </div>

                <div className="mt-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight">{org.name}</h2>
                    <p className="text-sm font-bold uppercase tracking-widest border border-black inline-block px-4 py-1 mt-2">
                        Official Membership Application Form
                    </p>
                </div>
            </header>

            {/* --- APPLICANT INFORMATION --- */}
            <section className="mb-8">
                <h3 className="text-sm font-bold uppercase border-b border-black mb-4 pb-1">I. Applicant Information</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-1">Full Name</p>
                        <p className="font-bold border-b border-gray-400 pb-1">{record.fullname}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-1">Date Filed</p>
                        <p className="font-bold border-b border-gray-400 pb-1">{record.created_at}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs font-bold uppercase text-gray-500 mb-1">Address</p>
                        <p className="font-bold border-b border-gray-400 pb-1">{record.address}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-1">Application Status</p>
                        <p className="font-bold border-b border-gray-400 pb-1 uppercase">{record.status}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-1">Application ID</p>
                        <p className="font-bold border-b border-gray-400 pb-1 font-mono">#{record.id}</p>
                    </div>
                </div>
            </section>

            {/* --- DYNAMIC FORM ANSWERS --- */}
            <section className="mb-12">
                <h3 className="text-sm font-bold uppercase border-b border-black mb-4 pb-1">II. Questionnaire Responses</h3>

                {org.form_schema && org.form_schema.length > 0 ? (
                    <div className="flex flex-wrap gap-x-6 gap-y-6 text-sm">
                        {org.form_schema.map((field: any, index: number) => (
                            <div
                                key={index}
                                className={`break-inside-avoid ${field.width === 'w-1/2' ? 'w-[calc(50%-12px)]' : field.width === 'w-1/3' ? 'w-[calc(33.33%-16px)]' : field.width === 'w-1/4' ? 'w-[calc(25%-18px)]' : 'w-full'}`}
                            >
                                <p className="text-xs font-bold uppercase text-gray-500 mb-1">
                                    {index + 1}. {field.label}
                                </p>

                                {field.type === 'table' ? (
                                    <div className="border border-black mt-2">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-black bg-gray-100">
                                                    {field.columns?.map((col: any, cIdx: number) => (
                                                        <th key={cIdx} className="px-2 py-1 text-left border-r border-black last:border-r-0">
                                                            {col.name}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(submission[field.id] || []).length > 0 ? (
                                                    (submission[field.id] || []).map((row: any, rIdx: number) => (
                                                        <tr key={rIdx} className="border-b border-black last:border-b-0">
                                                            {field.columns?.map((col: any, cIdx: number) => (
                                                                <td key={cIdx} className="px-2 py-1 border-r border-black last:border-r-0">
                                                                    {row[col.name]}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={field.columns?.length || 1} className="px-2 py-4 text-center italic text-gray-500">
                                                            No entries.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="border-b border-gray-400 pb-1 min-h-[1.5em]">
                                        <p className="font-medium whitespace-pre-wrap">
                                            {formatAnswer(submission[field.id])}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="italic text-gray-500 text-sm text-center py-4">No additional questions were required for this application.</p>
                )}
            </section>

            {/* --- OATH & SIGNATURES --- */}
            <section className="mt-auto pt-8 break-inside-avoid">
                <p className="text-xs text-justify italic mb-8 leading-relaxed">
                    I hereby certify that the information provided in this form is true and correct to the best of my knowledge.
                    I understand that any false statement may be grounds for the rejection of this application or revocation of membership.
                </p>

                <div className="grid grid-cols-2 gap-12 mt-16 text-center">
                    <div>
                        <div className="border-b-2 border-black w-full mb-2"></div>
                        <p className="text-xs font-bold uppercase">Signature over Printed Name of Applicant</p>
                    </div>

                    <div>
                        <div className="border-b-2 border-black w-full mb-2 relative">
                            {/* Ideally, digital signature if available */}
                            {record.approved_by && (
                                <span className="absolute bottom-1 left-0 right-0 font-script text-lg text-blue-900">
                                    /s/ {record.approved_by}
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-bold uppercase">Approved By: {org.president_name || 'Organization President'}</p>
                    </div>
                </div>

                <div className="mt-12 text-[10px] text-center text-gray-400 border-t pt-4">
                    <p>Generated by Barangay 183 Villamor Women & Family Portal System on {new Date().toLocaleDateString()}</p>
                    <p>{org.name} | Application Ref: {record.id}</p>
                </div>
            </section>

            <style>
                {`
                    @media print {
                        body { 
                            background: white; 
                            -webkit-print-color-adjust: exact; 
                        }
                        @page { 
                            size: letter; 
                            margin: 0.5in; 
                        }
                        .no-print { display: none; }
                    }
                `}
            </style>
        </div>
    );
}
