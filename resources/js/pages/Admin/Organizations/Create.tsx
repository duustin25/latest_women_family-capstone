import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, LayoutTemplate, Settings } from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import LivePaperPreview from "@/components/Admin/LivePaperPreview";
import OrganizationSettings from "@/components/Admin/OrganizationSettings";
import FormBuilder from "@/components/Admin/FormBuilder";

export default function Create({ users }: { users: any[] }) {
    const [activeTab, setActiveTab] = useState<'settings' | 'builder'>('settings');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        president_name: '',
        color_theme: 'bg-[#0038a8]',
        image: null as File | null,
        requirements: [] as string[],
        form_schema: [
            // CORE FIELDS (LOCKED)
            { id: 'fullname', type: 'text', label: 'Full Name', required: true, width: 'w-full', layout: 'block', is_core: true },
            { id: 'address', type: 'text', label: 'Address', required: true, width: 'w-full', layout: 'block', is_core: true }, // Verified: User prefers 'text' over 'textarea'

            // Example Dynamic Fields
            { id: 'contact_number', type: 'number', label: 'Contact Number', required: true, width: 'w-full' },
            { id: 'email', type: 'email', label: 'Email Address', required: false, width: 'w-full' },
        ] as any[], // Default schema to start with
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/organizations', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Organizations', href: '/admin/organizations' }, { title: 'Create Profile', href: '#' }]}>
            <Head title="Create Organization" />

            {/* FLOATING SAVE BUTTON */}
            <div className="fixed bottom-8 right-8 z-50">
                <Button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-4 border-white dark:border-neutral-900"
                >
                    {processing ? <span className="animate-spin text-xl">⏳</span> : <Save size={28} />}
                </Button>
            </div>

            <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 transition-colors py-8">
                <div className="max-w-[95%] mx-auto px-4">

                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/admin/organizations" className="flex items-center text-[10px] font-black tracking-widest text-neutral-400 hover:text-blue-600 group transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> CANCEL & RETURN
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8 items-start">

                        {/* LEFT COLUMN: BUILDER & SETTINGS */}
                        <div className="flex-1 w-full min-w-0">

                            {/* TABS NAVIGATION */}
                            <div className="bg-white dark:bg-neutral-900 p-1 rounded-lg inline-flex gap-1 mb-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('settings')}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'settings' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                                >
                                    <Settings size={14} /> Organization Helper
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('builder')}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'builder' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                                >
                                    <LayoutTemplate size={14} /> Form Builder
                                </button>
                            </div>

                            <div className="bg-transparent min-h-[500px]">
                                {activeTab === 'settings' ? (
                                    <OrganizationSettings data={data} setData={setData} record={{}} users={users} />
                                ) : (
                                    <FormBuilder schema={data.form_schema} onSchemaChange={(newSchema) => setData('form_schema', newSchema)} />
                                )}
                            </div>

                        </div>

                        {/* RIGHT COLUMN: LIVE PREVIEW (Sticky) */}
                        <LivePaperPreview data={data} />
                    </form>
                </div>
            </div>
        </AppLayout >
    );
}