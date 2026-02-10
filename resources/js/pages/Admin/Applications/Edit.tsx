import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Upload, CheckCircle2, Trash2, Building2 } from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import DynamicFields from '@/components/DynamicFields';

export default function Edit({ application, organization }: { application: any, organization: any }) {

    // Parse submission_data if it's a string (though it should be cast by Laravel)
    const initialSubmissionData = typeof application.submission_data === 'string'
        ? JSON.parse(application.submission_data)
        : application.submission_data || {};

    const { data, setData, put, processing, errors } = useForm({
        fullname: application.fullname || '',
        address: application.address || '',
        submission_data: initialSubmissionData,
    });

    const handleInputChange = (fieldId: string, value: any) => {
        setData('submission_data', {
            ...data.submission_data,
            [fieldId]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/applications/${application.id}`);
    };



    return (
        <AppLayout breadcrumbs={[
            { title: 'Applications', href: '/admin/applications' },
            { title: `Edit ${application.case_number || 'Application'}`, href: '#' }
        ]}>
            <Head title={`Edit Application - ${application.fullname}`} />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-12">
                <div className="max-w-4xl mx-auto">

                    {/* --- HEADER --- */}
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <Link
                                href={`/admin/applications/${application.id}`}
                                className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Review
                            </Link>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                Edit Application
                            </h2>
                            <p className="text-slate-500 font-medium">
                                Updating record for <span className="font-bold text-slate-900 dark:text-white">{application.fullname}</span>
                            </p>
                        </div>
                        <div className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border ${organization.color_theme?.replace('bg-', 'border-') || 'border-blue-500'} bg-white dark:bg-slate-900`}>
                            <Building2 className={`w-5 h-5 ${organization.color_theme?.replace('bg-', 'text-') || 'text-blue-600'}`} />
                            <span className="text-xs font-black uppercase tracking-widest">{organization.name}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">

                            {/* Alert for Accountability */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-yellow-800 text-xs">
                                <Info className="w-5 h-5 shrink-0" />
                                <div>
                                    <span className="font-bold block mb-1">AUDIT LOG WARNING</span>
                                    You are about to modify a submitted application record. All changes will be recorded in the system audit trail for accountability.
                                </div>
                            </div>

                            {/* Standard Fields */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Basic Information</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullname" className="text-xs font-bold uppercase text-slate-500">Full Name</Label>
                                        <Input
                                            id="fullname"
                                            value={data.fullname}
                                            onChange={e => setData('fullname', e.target.value)}
                                            required
                                            className="font-bold"
                                        />
                                        {errors.fullname && <p className="text-red-500 text-xs">{errors.fullname}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-xs font-bold uppercase text-slate-500">Address</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            required
                                            className="font-bold"
                                        />
                                        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Fields */}
                            {organization.form_schema && organization.form_schema.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Organization Data</h3>
                                    <div className="flex flex-wrap gap-x-6 gap-y-6">
                                        <DynamicFields
                                            schema={organization.form_schema}
                                            data={data.submission_data}
                                            setData={handleInputChange}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <Link
                                    href={`/admin/applications/${application.id}`}
                                    className="px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
                                >
                                    {processing ? 'Saving Changes...' : 'Save Updates'}
                                </Button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}

function Info({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    );
}
