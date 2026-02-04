import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft, Save, Building2, ListChecks, Plus,
    Trash2, Settings2, Image as ImageIcon, Info, CheckCircle2, Upload
} from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

export default function Edit({ organization }: { organization: any }) {
    const record = organization?.data ?? organization;
    const [newRequirement, setNewRequirement] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: record?.name || '',
        description: record?.description || '',
        president_name: record?.president_name || '',
        color_theme: record?.color_theme || 'bg-[#0038a8]',
        image: null as File | null,
        requirements: record?.requirements || [],
        form_schema: record?.form_schema || [],
    });

    const addRequirement = () => {
        if (!newRequirement.trim()) return;
        setData('requirements', [...data.requirements, newRequirement]);
        setNewRequirement('');
    };

    const removeRequirement = (index: number) => {
        setData('requirements', data.requirements.filter((_: any, i: any) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/organizations/${record.slug}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    if (!record) return <div className="p-20 text-center font-black text-slate-400">Data not found.</div>;

    return (
        <AppLayout breadcrumbs={[{ title: 'Organizations', href: '/admin/organizations' }, { title: 'Edit Profile', href: '#' }]}>
            <Head title={`Edit - ${record.name}`} />

            <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors py-12">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Navigation */}
                    <Link href="/admin/organizations" className="flex items-center text-[10px] font-black tracking-widest text-slate-400 hover:text-blue-600 mb-8 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Return to Management
                    </Link>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        <div className="lg:col-span-8">
                            <header className="mb-10 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${data.color_theme}`}></div>
                                    <span className="text-[10px] font-black tracking-[0.2em] text-blue-600">Administrative Editor</span>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Organization Title</label>
                                    <input
                                        className="w-full text-4xl md:text-6xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border-b-4 border-transparent focus:border-blue-600 focus:ring-0 p-2 transition-all tracking-tighter"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-600 text-[10px] font-black mt-1">{errors.name}</p>}
                                </div>

                                <div className="w-full md:w-1/2">
                                    <label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Presiding Officer</label>
                                    <Input
                                        value={data.president_name}
                                        onChange={e => setData('president_name', e.target.value)}
                                        className="h-11 font-bold text-xs border-2 focus:border-blue-600"
                                    />
                                </div>
                            </header>

                            {/* Image Frame - With better "Replace" indicator */}
                            <div className="aspect-video w-full overflow-hidden rounded-sm mb-12 border-4 border-slate-100 dark:border-slate-800 shadow-2xl relative bg-slate-50 dark:bg-slate-900 flex items-center justify-center group">
                                {data.image ? (
                                    <img src={URL.createObjectURL(data.image)} className="w-full h-full object-cover" />
                                ) : record.image ? (
                                    <img src={record.image} className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 size={80} className="opacity-10" />
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                                    <Upload size={32} className="mb-2 animate-bounce" />
                                    <label className="cursor-pointer bg-white text-black px-8 py-3 font-black text-[10px] tracking-widest hover:bg-yellow-500 transition-colors">
                                        Upload New Header Image
                                        <input type="file" className="hidden" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} />
                                    </label>
                                </div>
                            </div>



                            {/* Form Builder Section */}
                            <div className="space-y-6 pt-12 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                    <Settings2 className="w-5 h-5 text-blue-600" /> Dynamic Membership Form
                                </h3>

                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-sm border border-slate-200 dark:border-slate-800 space-y-6">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Define the custom fields required for membership application.
                                    </p>

                                    {/* Field List */}
                                    <div className="space-y-3">
                                        {data.form_schema && data.form_schema.length > 0 ? (
                                            data.form_schema.map((field: any, index: number) => (
                                                <div key={index} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700 rounded-sm shadow-sm group">
                                                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                                                        <div className="col-span-5">
                                                            <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Label</span>
                                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{field.label}</p>
                                                        </div>
                                                        <div className="col-span-4">
                                                            <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Type</span>
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase">
                                                                {field.type}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Required</span>
                                                            {field.required ? (
                                                                <span className="text-green-600 font-black text-xs flex items-center gap-1"><CheckCircle2 size={12} /> Yes</span>
                                                            ) : (
                                                                <span className="text-slate-400 font-bold text-xs">Optional</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            const newSchema = [...data.form_schema];
                                                            newSchema.splice(index, 1);
                                                            setData('form_schema', newSchema);
                                                        }}
                                                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-sm">
                                                <p className="text-slate-400 text-sm font-bold">No custom fields defined.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Add New Field Form */}
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Add New Field</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-100 dark:bg-slate-800 p-4 rounded-sm">
                                            <div className="md:col-span-5 space-y-2">
                                                <label className="text-[10px] font-bold uppercase text-slate-500">Field Label</label>
                                                <Input
                                                    id="new-field-label"
                                                    placeholder="e.g. Mother's Maiden Name"
                                                    className="bg-white dark:bg-slate-900 h-9"
                                                />
                                            </div>
                                            <div className="md:col-span-4 space-y-2">
                                                <label className="text-[10px] font-bold uppercase text-slate-500">Input Type</label>
                                                <select
                                                    id="new-field-type"
                                                    className="w-full h-9 rounded-md border border-input bg-white dark:bg-slate-900 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                >
                                                    <option value="text">Text Input</option>
                                                    <option value="number">Number</option>
                                                    <option value="date">Date Picker</option>
                                                    <option value="textarea">Long Text</option>
                                                    <option value="checkbox">Checkbox (Yes/No)</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-bold uppercase text-slate-500">Required?</label>
                                                <div className="flex items-center h-9">
                                                    <input type="checkbox" id="new-field-required" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                                                </div>
                                            </div>
                                            <div className="md:col-span-1">
                                                <Button
                                                    type="button"
                                                    className="w-full h-9 bg-blue-600 hover:bg-blue-700"
                                                    onClick={() => {
                                                        const labelInput = document.getElementById('new-field-label') as HTMLInputElement;
                                                        const typeInput = document.getElementById('new-field-type') as HTMLSelectElement;
                                                        const reqInput = document.getElementById('new-field-required') as HTMLInputElement;

                                                        if (!labelInput.value) return;

                                                        const newField = {
                                                            label: labelInput.value,
                                                            type: typeInput.value,
                                                            required: reqInput.checked
                                                        };

                                                        setData('form_schema', [...(data.form_schema || []), newField]);

                                                        // Reset
                                                        labelInput.value = '';
                                                        reqInput.checked = false;
                                                    }}
                                                >
                                                    <Plus size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Actions & Meta */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-10 space-y-6">

                                <div className="bg-slate-900 p-8 rounded-sm shadow-xl text-white border-t-8 border-yellow-500">
                                    <h3 className="text-sm font-black tracking-widest flex items-center gap-2 mb-6 text-yellow-500">
                                        <ListChecks className="w-5 h-5" /> Requirements
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newRequirement}
                                                onChange={e => setNewRequirement(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                                className="h-10 bg-slate-800 border-slate-700 text-[10px] font-bold"
                                                placeholder="Add requirement..."
                                            />
                                            <Button type="button" onClick={addRequirement} className="bg-yellow-500 hover:bg-yellow-600 text-black h-10 w-10 p-0">
                                                <Plus size={18} />
                                            </Button>
                                        </div>

                                        <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {data.requirements.map((req: any, i: any) => (
                                                <li key={i} className="flex items-center justify-between gap-3 bg-white/5 p-3 rounded-sm border border-white/10 group">
                                                    <span className="text-[10px] font-bold tracking-tight text-slate-300">{req}</span>
                                                    <button type="button" onClick={() => removeRequirement(i)} className="text-slate-500 hover:text-red-500 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="pt-6 border-t border-white/10">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-none tracking-widest text-[10px] shadow-lg transition-all"
                                            >
                                                {processing ? 'Synchronizing...' : 'Save All Changes'} <Save className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-sm border border-slate-200 dark:border-slate-800">
                                    <p className="text-[9px] text-slate-400 font-bold">
                                        Organization Unique Slug: <span className="text-slate-900 dark:text-white">{record.slug}</span>
                                    </p>
                                </div>

                            </div>
                        </aside>
                    </form>
                </div>
            </div>
        </AppLayout >
    );
}