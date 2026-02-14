import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Printer, CheckCircle, XCircle, Building2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DynamicFields from '@/components/DynamicFields';

export default function ReviewGeneral({ application, organization }: { application: any, organization: any }) {
    const record = application.data; // Resource wraps it in data
    const { processing } = useForm();

    // Prepare Submission Data (Backward Compatibility)
    let submissionData = typeof record.submission_data === 'string'
        ? JSON.parse(record.submission_data)
        : record.submission_data || {};

    if (!submissionData.fullname && record.fullname) submissionData.fullname = record.fullname;
    if (!submissionData.address && record.address) submissionData.address = record.address;

    const handleAction = (status: 'Approved' | 'Disapproved') => {
        if (confirm(`Set status to ${status}?`)) {
            router.patch(`/admin/applications/${record.id}/status`,
                { status: status },
                { preserveScroll: true }
            );
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Queue', href: '/admin/applications' }, { title: 'Review Application', href: '#' }]}>
            <Head title={`Review - ${record.fullname}`} />

            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 transition-colors">

                {/* TOP BAR CONTROLS */}
                <div className="max-w-[8.5in] mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link href="/admin/applications" className="flex items-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Queue
                    </Link>
                    <div className="flex items-center gap-3">
                        <Badge className={`uppercase font-black tracking-widest ${record.status === 'Approved' ? 'bg-emerald-600' :
                            record.status === 'Disapproved' ? 'bg-red-600' : 'bg-amber-500'
                            }`}>
                            Status: {record.status}
                        </Badge>
                        <a href={`/admin/applications/${record.id}/print`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="border-2 uppercase font-black text-xs">
                                <Printer className="w-4 h-4 mr-2" /> Print
                            </Button>
                        </a>
                        <Link href={`/admin/applications/${record.id}/edit`}>
                            <Button variant="outline" size="sm" className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 uppercase font-black text-xs">
                                <Edit className="w-4 h-4 mr-2" /> Edit Details
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* PAPER CONTAINER */}
                <div
                    className="bg-white mx-auto shadow-2xl overflow-hidden text-black relative"
                    style={{ maxWidth: '8.5in', minHeight: '11in', padding: '0.5in', fontFamily: 'Arial, sans-serif' }}
                >
                    {/* OFFICIAL HEADER */}
                    <div className="grid grid-cols-[1.5in_1fr_1.5in] items-center gap-4 text-center border-b-2 border-black pb-4 mb-4">
                        <div className="flex justify-center">
                            <img src="/Logo/barangay183LOGO.png" className="h-24 w-24 object-contain" alt="Barangay Logo" />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-[10pt] leading-tight">Republic of the Philippines</p>
                            <h1 className="text-[12pt] font-bold uppercase leading-tight mt-1">
                                {import.meta.env.VITE_BARANGAY_NAME || "BARANGAY 183 VILLAMOR"}
                            </h1>
                            <p className="text-[10pt] leading-tight mt-1">
                                {import.meta.env.VITE_BARANGAY_ADDRESS || "Zone 20 District 1 Pasay City, Metro Manila"}
                            </p>
                            <p className="text-[10pt] leading-tight text-gray-800">
                                {import.meta.env.VITE_BARANGAY_LANDLINE || "Telephone No. (02) 853-0907 / (02) 835-1953"}
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <img src="/Logo/women&family_logo.png" className="h-24 w-24 object-contain" alt="WFP Logo" />
                        </div>
                    </div>

                    {/* FORM TITLE */}
                    <div className="text-center mb-8">
                        <h2 className="text-[14pt] font-bold uppercase underline tracking-wide">MEMBERSHIP APPLICATION</h2>
                        <h3 className="text-[12pt] mt-1 font-bold">{organization.data?.name || organization.name}</h3>
                    </div>

                    {/* DYNAMIC FIELDS (VIEW MODE) */}
                    <div className="mb-8">
                        {/* We iterate logic similar to Print.tsx but using DynamicFields */}
                        {/* DynamicFields will handle parsing the schema and showing data */}
                        {/* We pass mode='view' so it renders text instead of inputs */}
                        <DynamicFields
                            schema={organization.data?.form_schema || organization.form_schema || []}
                            data={submissionData}
                            setData={() => { }} // Read only
                            errors={{}}
                            mode="view"
                        />
                    </div>

                    {/* FOOTER / SIGNATURES */}
                    <div className="mt-12 grid grid-cols-2 gap-12 pt-8 border-t-2 border-black">
                        <div className="text-center">
                            <div className="font-bold text-lg uppercase border-b border-black inline-block min-w-[200px] mb-1">
                                {record.fullname}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Applicant Signature</p>
                        </div>

                        <div className="text-center">
                            <div className="font-bold text-lg uppercase border-b border-black inline-block min-w-[200px] mb-1">
                                {record.approved_by || '______________________'}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest">
                                {record.status === 'Approved' ? 'Approved By' : 'Verified By'}
                            </p>
                            {record.actioned_at && (
                                <p className="text-[9px] italic text-slate-500 mt-1">Date: {record.actioned_at}</p>
                            )}
                        </div>
                    </div>

                    {/* ADMIN ACTION BUTTONS (Inside Paper, at bottom, or maybe mostly for screen) */}
                    {record.status === 'Pending' && (
                        <div className="mt-12 pt-6 border-t border-dashed border-gray-300 flex justify-end gap-4 no-print">
                            <Button onClick={() => handleAction('Disapproved')} disabled={processing} variant="destructive" className="uppercase font-black tracking-widest">
                                <XCircle className="w-4 h-4 mr-2" /> Disapprove
                            </Button>
                            <Button onClick={() => handleAction('Approved')} disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white uppercase font-black tracking-widest">
                                <CheckCircle className="w-4 h-4 mr-2" /> Approve Membership
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
