import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Printer, CheckCircle, XCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReviewGeneral({ application }: { application: any }) {
    const record = application.data;
    const { processing } = useForm();

    const handleAction = (status: 'Approved' | 'Disapproved') => {
        if (confirm(`Set status to ${status}?`)) {
            router.patch(`/admin/applications/${record.id}/status`,
                { status: status },
                { preserveScroll: true }
            );
        }
    };

    const FormBox = ({ label, value, className = "" }: { label: string, value: any, className?: string }) => (
        <div className={`border-b border-r border-slate-300 dark:border-slate-600 p-2 ${className}`}>
            <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 leading-none mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase break-words">
                {value || <span className="text-slate-300 dark:text-slate-700 italic">-</span>}
            </p>
        </div>
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Queue', href: '/admin/applications' }, { title: 'Review Application', href: '#' }]}>
            <Head title={`Review - ${record.fullname}`} />

            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 transition-colors">
                <div className="max-w-[8.5in] mx-auto">

                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
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
                                    <Printer className="w-4 h-4 mr-2" /> Print Official Form
                                </Button>
                            </a>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700">
                        {/* HEADER */}
                        <div className="p-8 pb-4 text-center border-b-4 border-double border-slate-800 dark:border-slate-100 mx-8 mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <div className="w-20 h-20 bg-slate-100 rounded-full border border-slate-300 flex items-center justify-center overflow-hidden text-slate-300">
                                    <Building2 size={32} />
                                </div>

                                <div className="flex-1 px-4">
                                    <h1 className="font-serif font-bold text-lg md:text-xl text-slate-900 dark:text-white uppercase leading-tight">
                                        {record.organization_name}
                                    </h1>
                                    <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 uppercase mt-1">
                                        Barangay 183 Villamor<br />
                                        Pasay City
                                    </p>
                                </div>

                                <div className="w-20 h-20 bg-slate-100 rounded-full border border-slate-300 flex items-center justify-center overflow-hidden">
                                    <img src="/Logo/women&family_logo.png" alt="Brgy Logo" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white mt-6 underline decoration-2 underline-offset-4">
                                Membership Form
                            </h2>
                        </div>

                        {/* BODY */}
                        <div className="p-8">
                            <h3 className="font-black uppercase text-sm mb-4 flex items-center">
                                <span className="mr-2">I.</span> Applicant Information
                            </h3>
                            <div className="border-t border-l border-slate-300 dark:border-slate-600 grid grid-cols-12 text-slate-900 dark:text-slate-100">
                                <FormBox className="col-span-12" label="Full Name" value={record.fullname} />
                                <FormBox className="col-span-12" label="Address" value={record.address} />

                                {/* Dynamic Personal Data Rendering */}
                                {Object.entries(record.personal_data || {}).map(([key, value]: [string, any], index) => (
                                    <FormBox key={index} className="col-span-6" label={key.replace(/_/g, ' ')} value={typeof value === 'object' ? JSON.stringify(value) : value} />
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Form Data */}
                        {record.submission_data && Object.keys(record.submission_data).length > 0 && (
                            <div className="p-8 pt-0">
                                <h3 className="font-black uppercase text-sm mb-4 flex items-center">
                                    <span className="mr-2">II.</span> Questionnaire Responses
                                </h3>
                                <div className="border-t border-l border-slate-300 dark:border-slate-600 grid grid-cols-12 text-slate-900 dark:text-slate-100">
                                    {Object.entries(record.submission_data).map(([key, value]: [string, any], index) => (
                                        <FormBox key={index} className="col-span-12" label={key} value={
                                            Array.isArray(value) ? value.join(', ') :
                                                typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value
                                        } />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FOOTER */}
                        <div className="p-8 pt-0 flex flex-col md:flex-row gap-8 mt-8">
                            <div className="flex-1 text-center">
                                <div className="border-b border-black dark:border-white h-8 mb-2"></div>
                                <p className="text-[10px] font-bold uppercase">Signature over Printed Name of Applicant</p>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="border-b border-black dark:border-white h-8 mb-2">
                                    <span className="font-black text-sm uppercase">{record.approved_by || ''}</span>
                                </div>
                                <p className="text-[10px] font-bold uppercase">Evaluated / Approved By</p>
                                <p className="text-[9px] italic text-slate-500">Date: {record.actioned_at}</p>
                            </div>
                        </div>

                        {/* CONTROLS */}
                        {record.status === 'Pending' && (
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
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
            </div>
        </AppLayout>
    );
}
