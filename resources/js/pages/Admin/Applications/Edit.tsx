import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Info, Building2 } from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import DynamicFields from '@/components/DynamicFields';

export default function Edit({ application, organization }: { application: any, organization: any }) {

    // Parse submission_data
    let initialSubmissionData = typeof application.submission_data === 'string'
        ? JSON.parse(application.submission_data)
        : application.submission_data || {};

    // Helper to ensure core fields exist (Runtime Injection for Admin View)
    const ensureCoreFields = (schema: any[]) => {
        const coreFields = [
            { id: 'fullname', type: 'text', label: 'Full Name', required: true, width: 'w-full', layout: 'block', is_core: true },
            { id: 'address', type: 'text', label: 'Address', required: true, width: 'w-full', layout: 'block', is_core: true },
        ];

        const existingIds = new Set(schema.map(f => f.id));
        const missingCore = coreFields.filter(f => !existingIds.has(f.id));

        // If we have missing core fields, prepend them. 
        const updatedSchema = schema.map(f => {
            if (f.id === 'fullname' || f.id === 'address') {
                return { ...f, is_core: true, required: true };
            }
            return f;
        });

        return [...missingCore, ...updatedSchema];
    };

    const finalSchema = ensureCoreFields(organization.form_schema || []);

    const { data, setData, put, processing, errors } = useForm({
        fullname: application.fullname || '',
        address: application.address || '',
        submission_data: initialSubmissionData,
    });

    const handleInputChange = (newData: any) => {
        setData('submission_data', newData);
    };

    // Sync core fields from submission_data to top-level state
    useEffect(() => {
        if (data.submission_data.fullname) {
            setData('fullname', data.submission_data.fullname);
        }
        if (data.submission_data.address) {
            setData('address', data.submission_data.address);
        }
    }, [data.submission_data.fullname, data.submission_data.address]);

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

                {/* --- TOP ADMIN BAR --- */}
                <div className="max-w-[8.5in] mx-auto mb-6 flex items-center justify-between">
                    <Link
                        href={`/admin/applications/${application.id}`}
                        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Review
                    </Link>

                    {/* Organization Tag */}
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${organization.color_theme?.replace('bg-', 'border-') || 'border-blue-500'} bg-white dark:bg-slate-900 shadow-sm`}>
                        <Building2 className={`w-4 h-4 ${organization.color_theme?.replace('bg-', 'text-') || 'text-blue-600'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{organization.name}</span>
                    </div>
                </div>

                {/* --- PAPER CONTAINER --- */}
                <div
                    className="bg-white mx-auto shadow-2xl overflow-hidden text-black relative"
                    style={{ maxWidth: '8.5in', minHeight: '11in', padding: '0.5in', fontFamily: 'Arial, sans-serif' }}
                >
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* --- OFFICIAL HEADER --- */}
                        <div className="grid grid-cols-[1.5in_1fr_1.5in] items-center gap-4 text-center border-b-2 border-black pb-4 mb-8">
                            {/* Left Logo */}
                            <div className="flex justify-center">
                                <img
                                    src="/Logo/barangay183LOGO.png"
                                    className="h-24 w-24 object-contain"
                                    alt="Barangay Logo"
                                />
                            </div>

                            {/* Center Text */}
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

                            {/* Right Logo */}
                            <div className="flex justify-center">
                                <img
                                    src="/Logo/women&family_logo.png"
                                    className="h-24 w-24 object-contain"
                                    alt="WFP Logo"
                                />
                            </div>
                        </div>

                        {/* Application Title */}
                        <div className="text-center mb-10">
                            <h2 className="text-[14pt] font-bold uppercase underline tracking-wide">APPLICATION - EDIT MODE</h2>
                            <h3 className="text-[12pt] mt-1 font-bold">{organization.name}</h3>
                            {/* Alert for Accountability */}
                            <p className="text-[9pt] text-red-600 uppercase font-bold mt-2 bg-red-50 inline-block px-2">
                                Audit Warning: Changes will be logged.
                            </p>
                        </div>


                        {/* DYNAMIC FIELDS (Using same layout as Public Form) */}
                        <section>
                            {finalSchema && finalSchema.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
                                    <DynamicFields
                                        schema={finalSchema}
                                        data={data.submission_data}
                                        setData={handleInputChange}
                                        errors={errors}
                                    />
                                </div>
                            ) : (
                                <p className="italic text-gray-400 text-sm">No additional questions required.</p>
                            )}
                        </section>

                        {/* Admin Footer Controls */}
                        <div className="pt-12 mt-12 border-t-2 border-dashed border-gray-300 flex justify-end gap-3 no-print">
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

            {/* Override Styles for DynamicFields */}
            <style>{`
                 /* Target inputs inside the form to look like underlines */
                 .bg-white input:not([type="checkbox"]):not([type="file"]), 
                 .bg-white textarea,
                 .bg-white select {
                      background-color: transparent !important;
                      border-radius: 0 !important;
                      border: 1px solid transparent !important;
                      border-bottom: 1px solid black !important;
                      padding-left: 0 !important;
                      box-shadow: none !important;
                 }
                 .bg-white input:focus, 
                 .bg-white textarea:focus,
                 .bg-white select:focus {
                     border-bottom: 2px solid black !important;
                     outline: none !important;
                 }
                 .bg-white label {
                     text-transform: uppercase;
                     font-size: 10pt;
                     color: black !important;
                 }
            `}</style>
        </AppLayout>
    );
}
