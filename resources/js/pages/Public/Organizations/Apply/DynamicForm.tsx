import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import PublicLayout from '@/layouts/PublicLayout';
import DynamicFields from '@/components/DynamicFields';

export default function DynamicForm({ organization }: { organization: any }) {
    const { data, setData, post, processing, errors } = useForm({
        fullname: '',
        address: '',
        submission_data: {} as Record<string, any>,
    });

    const handleInputChange = (fieldId: string, value: any) => {
        setData('submission_data', {
            ...data.submission_data,
            [fieldId]: value
        });
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
        post(`/organizations/${organization.slug}/apply`, {
            forceFormData: true,
        });
    };

    return (
        <PublicLayout>
            <Head title={`Apply - ${organization.name}`} />

            <div className="min-h-screen bg-neutral-100 py-12 px-4">
                {/* Back Button */}
                <div className="max-w-[8.5in] mx-auto mb-6">
                    <Link href={`/organizations/${organization.slug}`} className="inline-flex items-center text-xs font-black tracking-widest text-neutral-500 hover:text-blue-600 uppercase transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Back to Profile
                    </Link>
                </div>

                {/* PAPER CONTAINER */}
                <div
                    className="bg-white mx-auto shadow-2xl overflow-hidden text-black relative"
                    style={{ maxWidth: '8.5in', minHeight: '11in', padding: '0.5in', fontFamily: 'Arial, sans-serif' }}
                >
                    {/* --- OFFICIAL HEADER --- */}
                    <header className="mb-8 relative pb-4">
                        <div className="grid grid-cols-[1.5in_1fr_1.5in] items-center gap-4 text-center">
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
                        <div className="mt-6 text-center">
                            <h2 className="text-[14pt] font-bold uppercase underline tracking-wide">APPLICATION</h2>
                            <h3 className="text-[12pt] mt-1 font-bold">{organization.name}</h3>
                        </div>
                    </header>

                    {/* --- FORM CONTENT --- */}
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* DYNAMIC FIELDS (Includes Core Fields now) */}
                        {organization.form_schema && organization.form_schema.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                <DynamicFields
                                    schema={organization.form_schema}
                                    data={data.submission_data}
                                    setData={handleInputChange} // Keep using handleInputChange to update submission_data
                                    errors={errors}
                                />
                            </div>
                        ) : (
                            <p className="italic text-gray-400 text-sm">No additional questions required.</p>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-[9pt] text-justify italic mb-6 leading-relaxed">
                                I hereby certify that the information provided in this form is true and correct to the best of my knowledge.
                                I understand that any false statement may be grounds for the rejection of this application or revocation of membership.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 no-print pb-8">
                            <Button
                                type="submit"
                                disabled={processing}
                                className={`h-12 px-8 text-sm font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 ${organization.color_theme?.replace('bg-', 'bg-') || 'bg-black'} text-white`}
                            >
                                {processing ? 'Submitting...' : 'Submit Official Application'} <CheckCircle2 className="ml-2 w-5 h-5" />
                            </Button>
                        </div>

                    </form>
                </div>

                {/* Footer Brand */}
                <div className="max-w-[8.5in] mx-auto mt-8 text-center opacity-50">
                    <img src="/Logo/women&family_logo.png" className="h-8 mx-auto grayscale opacity-50 mb-2" />
                    <p className="text-[10px] uppercase font-bold tracking-widest">Barangay 183 Villamor Women & Family Portal</p>
                </div>
            </div>

            {/* Override Styles for DynamicFields to make them match the paper theme better if possible */}
            <style>{`
                /* Target inputs inside the form to look like underlines */
                .min-h-screen input:not([type="checkbox"]):not([type="file"]), 
                .min-h-screen textarea,
                .min-h-screen select {
                     background-color: transparent !important;
                     border-radius: 0 !important;
                     border: none !important;
                     border-bottom: 1px solid black !important;
                     padding-left: 0 !important;
                     box-shadow: none !important;
                }
                .min-h-screen input:focus, 
                .min-h-screen textarea:focus,
                .min-h-screen select:focus {
                    border-bottom: 2px solid black !important;
                    outline: none !important;
                }
                .min-h-screen label {
                    text-transform: uppercase;
                    font-size: 10pt;
                    color: black !important;
                }
            `}</style>
        </PublicLayout>
    );
}
