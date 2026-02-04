import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Printer, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReviewKalipi({ application }: { application: any }) {
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

    // Reusable "Form Field" component to mimic the printed boxes
    const FormBox = ({ label, value, className = "" }: { label: string, value: any, className?: string }) => (
        <div className={`border-b border-r border-slate-300 dark:border-slate-600 p-2 ${className}`}>
            <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 leading-none mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase break-words">
                {value || <span className="text-slate-300 dark:text-slate-700 italic">-</span>}
            </p>
        </div>
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Queue', href: '/admin/applications' }, { title: 'Review KALIPI', href: '#' }]}>
            <Head title={`Review - ${record.fullname}`} />

            {/* BACKGROUND WRAPPER */}
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 print:p-0 print:bg-white transition-colors">
                <div className="max-w-[8.5in] mx-auto"> {/* Standard Letter Width */}

                    {/* --- CONTROLS (HIDDEN ON PRINT) --- */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 print:hidden">
                        <Link href="/admin/applications" className="flex items-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Queue
                        </Link>
                        <div className="flex items-center gap-3">
                            <Badge className={`uppercase font-black tracking-widest ${record.status === 'Approved' ? 'bg-emerald-600' :
                                record.status === 'Disapproved' ? 'bg-red-600' : 'bg-amber-500'
                                }`}>
                                Status: {record.status}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => window.print()} className="border-2 uppercase font-black text-xs">
                                <Printer className="w-4 h-4 mr-2" /> Print Form
                            </Button>
                        </div>
                    </div>

                    {/* --- THE "OFFICIAL PAPER" --- */}
                    <div className="bg-white dark:bg-slate-900 shadow-2xl print:shadow-none border border-slate-200 dark:border-slate-700 print:border-none">

                        {/* 1. OFFICIAL HEADER (Replicating the Image) */}
                        <div className="p-8 pb-4 text-center border-b-4 border-double border-slate-800 dark:border-slate-100 mx-8 mt-8">
                            <div className="flex justify-between items-center mb-4">
                                {/* LOGO LEFT (KALIPI) */}
                                <div className="w-20 h-20 bg-slate-100 rounded-full border border-slate-300 flex items-center justify-center overflow-hidden">
                                    {/* Ideally, put <img src="/logo/kalipi.png" /> here */}
                                    <span className="text-[9px] font-bold text-slate-400">KALIPI LOGO</span>
                                </div>

                                {/* CENTER TEXT */}
                                <div className="flex-1 px-4">
                                    <h1 className="font-serif font-bold text-lg md:text-xl text-slate-900 dark:text-white uppercase leading-tight">
                                        Kalipunan ng Liping Pilipina (KALIPI) Nasyonal, Inc.
                                    </h1>
                                    <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 uppercase mt-1">
                                        National Capital Region<br />
                                        Metro Manila<br />
                                        Pasay City<br />
                                        <span className="font-black">Barangay 183 Villamor</span>
                                    </p>
                                </div>

                                {/* LOGO RIGHT (BARANGAY) */}
                                <div className="w-20 h-20 bg-slate-100 rounded-full border border-slate-300 flex items-center justify-center overflow-hidden">
                                    <img src="/Logo/women&family_logo.png" alt="Brgy Logo" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white mt-6 underline decoration-2 underline-offset-4">
                                Membership Form
                            </h2>
                        </div>

                        {/* 2. SECTION I: PERSONAL DATA (Grid Layout) */}
                        <div className="p-8">
                            <h3 className="font-black uppercase text-sm mb-4 flex items-center">
                                <span className="mr-2">I.</span> Personal Data
                            </h3>

                            {/* The "Box" Grid */}
                            <div className="border-t border-l border-slate-300 dark:border-slate-600 grid grid-cols-12 text-slate-900 dark:text-slate-100">
                                {/* Row 1 */}
                                <FormBox className="col-span-12" label="Full Name" value={record.fullname} />

                                {/* Row 2 */}
                                <FormBox className="col-span-8" label="Address" value={record.address} />
                                <FormBox className="col-span-4" label="Age" value={record.personal_data.age} />

                                {/* Row 3 */}
                                <FormBox className="col-span-4" label="Date of Birth" value={record.personal_data.dob} />
                                <FormBox className="col-span-4" label="Religion" value={record.personal_data.religion} />
                                <FormBox className="col-span-4" label="Civil Status" value={record.personal_data.civil_status} />

                                {/* Row 4 */}
                                <FormBox className="col-span-4" label="Cellphone No." value={record.personal_data.company?.tel} />
                                <FormBox className="col-span-8" label="Sectoral Categories (PWD/Solo Parent/IP)" value={record.personal_data.sectoral_category} />

                                {/* Row 5 */}
                                <FormBox className="col-span-12" label="Highest Educational Attainment" value={record.personal_data.education} />

                                {/* Row 6 */}
                                <FormBox className="col-span-6" label="Occupation" value={record.personal_data.occupation} />
                                <FormBox className="col-span-6" label="Monthly Income" value={record.personal_data.monthly_income} />

                                {/* Row 7 - Employment */}
                                <FormBox className="col-span-6" label="Name of Company (If Applicable)" value={record.personal_data.company?.name} />
                                <FormBox className="col-span-6" label="Company Address" value={record.personal_data.company?.address} />

                                {/* Row 8 */}
                                <FormBox className="col-span-12" label="Skills / Hobbies" value={record.personal_data.skills} />

                                {/* Row 9 - Org History */}
                                <FormBox className="col-span-4" label="Name of Organization (If Any)" value={record.personal_data.org_history?.name} />
                                <FormBox className="col-span-4" label="Position" value={record.personal_data.org_history?.position} />
                                <FormBox className="col-span-4" label="Date of Membership" value={record.personal_data.org_history?.date} />
                            </div>
                        </div>

                        {/* 3. SECTION II: FAMILY DATA (Table Layout) */}
                        <div className="px-8 pb-8">
                            <h3 className="font-black uppercase text-sm mb-4 flex items-center">
                                <span className="mr-2">II.</span> Family Occupation
                            </h3>

                            <div className="border border-slate-300 dark:border-slate-600">
                                <table className="w-full text-xs text-left">
                                    <thead className="uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-600">
                                        <tr>
                                            <th className="p-2 border-r border-slate-300 dark:border-slate-600">Name</th>
                                            <th className="p-2 border-r border-slate-300 dark:border-slate-600 w-16">Age</th>
                                            <th className="p-2 border-r border-slate-300 dark:border-slate-600">Relation</th>
                                            <th className="p-2 border-r border-slate-300 dark:border-slate-600">Education</th>
                                            <th className="p-2 border-r border-slate-300 dark:border-slate-600">Occupation</th>
                                            <th className="p-2 border-r border-slate-300 dark:border-slate-600">Income</th>
                                            <th className="p-2">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-300 dark:divide-slate-600 text-slate-800 dark:text-slate-200">
                                        {record.family_data.map((m: any, i: number) => (
                                            <tr key={i}>
                                                <td className="p-2 border-r border-slate-300 dark:border-slate-600 font-bold uppercase">{m.name}</td>
                                                <td className="p-2 border-r border-slate-300 dark:border-slate-600 text-center">{m.age}</td>
                                                <td className="p-2 border-r border-slate-300 dark:border-slate-600 uppercase">{m.relation}</td>
                                                <td className="p-2 border-r border-slate-300 dark:border-slate-600 uppercase">{m.education}</td>
                                                <td className="p-2 border-r border-slate-300 dark:border-slate-600 uppercase">{m.occupation}</td>
                                                <td className="p-2 border-r border-slate-300 dark:border-slate-600">{m.income}</td>
                                                <td className="p-2 uppercase">{m.remarks}</td>
                                            </tr>
                                        ))}
                                        {/* Empty Rows to maintain form look if few members */}
                                        {[...Array(Math.max(0, 3 - record.family_data.length))].map((_, i) => (
                                            <tr key={`empty-${i}`}>
                                                <td className="p-4 border-r border-slate-300 dark:border-slate-600">&nbsp;</td>
                                                <td className="p-4 border-r border-slate-300 dark:border-slate-600">&nbsp;</td>
                                                <td className="p-4 border-r border-slate-300 dark:border-slate-600">&nbsp;</td>
                                                <td className="p-4 border-r border-slate-300 dark:border-slate-600">&nbsp;</td>
                                                <td className="p-4 border-r border-slate-300 dark:border-slate-600">&nbsp;</td>
                                                <td className="p-4 border-r border-slate-300 dark:border-slate-600">&nbsp;</td>
                                                <td className="p-4">&nbsp;</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 4. OFFICIAL APPROVAL FOOTER */}
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

                        {/* 5. ADMIN ACTION BUTTONS (Hidden on Print) */}
                        {record.status === 'Pending' && (
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4 print:hidden">
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