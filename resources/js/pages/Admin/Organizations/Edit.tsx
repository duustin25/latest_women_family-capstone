import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Save, Building2, ListChecks, Plus,
    Trash2, Upload, User, Palette, FileText, Settings2,
    Calendar, CheckCircle2, ShieldCheck, Briefcase, Info, Users
} from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

    // --- FORM BUILDER LOGIC ---
    const addFormField = (type: string) => {
        const newField = {
            id: `field_${Date.now()}`,
            type,
            label: 'New Question',
            required: false,
            options: type === 'select' || type === 'radio' ? ['Option 1'] : [],
        };
        setData('form_schema', [...(data.form_schema || []), newField]);
    };

    const updateFormField = (index: number, key: string, value: any) => {
        const updatedSchema = [...(data.form_schema || [])];
        updatedSchema[index] = { ...updatedSchema[index], [key]: value };
        setData('form_schema', updatedSchema);
    };

    const removeFormField = (index: number) => {
        const updatedSchema = [...(data.form_schema || [])];
        updatedSchema.splice(index, 1);
        setData('form_schema', updatedSchema);
    };

    const addOption = (fieldIndex: number) => {
        const updatedSchema = [...(data.form_schema || [])];
        updatedSchema[fieldIndex].options.push(`Option ${updatedSchema[fieldIndex].options.length + 1}`);
        setData('form_schema', updatedSchema);
    };

    const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
        const updatedSchema = [...(data.form_schema || [])];
        updatedSchema[fieldIndex].options[optionIndex] = value;
        setData('form_schema', updatedSchema);
    };

    const removeOption = (fieldIndex: number, optionIndex: number) => {
        const updatedSchema = [...(data.form_schema || [])];
        updatedSchema[fieldIndex].options.splice(optionIndex, 1);
        setData('form_schema', updatedSchema);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/organizations/${record.slug}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const colorOptions = [
        { name: 'WFP Blue', class: 'bg-[#0038a8]' },
        { name: 'Red', class: 'bg-red-600' },
        { name: 'Emerald', class: 'bg-emerald-600' },
        { name: 'Violet', class: 'bg-violet-600' },
        { name: 'Amber', class: 'bg-amber-600' },
        { name: 'Cyan', class: 'bg-cyan-600' },
        { name: 'Pink', class: 'bg-pink-600' },
        { name: 'Slate', class: 'bg-slate-600' },
    ];

    if (!record) return <div className="p-20 text-center font-black text-neutral-400">Data not found.</div>;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Organizations', href: '/admin/organizations' }, { title: 'Edit Profile', href: '#' }]}>
            <Head title={`Edit - ${record.name}`} />

            {/* FLOATING SAVE BUTTON */}
            <div className="fixed bottom-8 right-8 z-50">
                <Button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                >
                    {processing ? <span className="animate-spin text-xl">⏳</span> : <Save size={28} />}
                </Button>
            </div>

            <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors py-12">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Navigation */}
                    <Link href="/admin/organizations" className="flex items-center text-[10px] font-black tracking-widest text-neutral-400 hover:text-blue-600 mb-8 group transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> CANCEL & RETURN
                    </Link>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Main Content Column (WYSIWYG) */}
                        <div className="lg:col-span-8">

                            {/* Header Section from Show.tsx */}
                            <header className="mb-10 group relative border-2 border-dashed border-transparent hover:border-blue-200 dark:hover:border-blue-900 rounded-lg p-4 -m-4 transition-all">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase pointer-events-none">
                                    Editable Region
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`w-3 h-3 rounded-full ${data.color_theme}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${data.color_theme.replace('bg-', 'text-')} dark:text-blue-400`}>Official Organization</span>
                                </div>

                                <Input
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white mb-6 leading-none tracking-tighter uppercase border-none bg-transparent shadow-none hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 h-auto py-2 px-2 -ml-2 rounded-sm"
                                    placeholder="ORGANIZATION NAME"
                                />

                                <div className="flex flex-wrap gap-6 text-neutral-500 dark:text-neutral-400 font-bold tracking-wider items-center">
                                    <span className="flex items-center gap-2 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 rounded-sm hover:bg-neutral-100 transition-colors">
                                        <Users className="w-4 h-4 text-neutral-400" /> Pres.
                                        <Input
                                            value={data.president_name}
                                            onChange={e => setData('president_name', e.target.value)}
                                            className="h-6 w-48 border-none bg-transparent shadow-none text-current font-bold focus:bg-white p-0 px-1"
                                            placeholder="President Name"
                                        />
                                    </span>
                                    <span className="flex items-center gap-2 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 rounded-sm">
                                        <Calendar className="w-4 h-4 text-neutral-400" /> Accredited since {record.created_at}
                                    </span>
                                </div>
                            </header>

                            {/* Image Upload Area */}
                            <div className="aspect-video w-full overflow-hidden rounded-sm mb-12 border-4 border-neutral-50 dark:border-neutral-900 shadow-2xl relative bg-neutral-100 dark:bg-neutral-900 group">
                                {data.image ? (
                                    <img src={URL.createObjectURL(data.image)} className="w-full h-full object-cover" />
                                ) : record.image ? (
                                    <img src={record.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-10">
                                        <Building2 size={120} className="dark:text-white" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-neutral-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 z-10">
                                    <Upload size={32} className="mb-2 animate-bounce" />
                                    <label className="cursor-pointer bg-white text-black px-8 py-3 font-black text-[10px] tracking-widest hover:bg-yellow-400 transition-colors uppercase">
                                        Change Cover Image
                                        <input type="file" className="hidden" accept="image/*" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} />
                                    </label>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="prose dark:prose-invert max-w-none mb-12 group relative border-2 border-dashed border-transparent hover:border-blue-200 dark:hover:border-blue-900 rounded-lg p-4 -m-4 transition-all">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase pointer-events-none">
                                    Editable Region
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Info className={`w-5 h-5 ${data.color_theme.replace('bg-', 'text-')} dark:text-blue-400`} /> Mission & Description
                                </h3>
                                <div className="border-l-4 border-neutral-100 dark:border-neutral-800 pl-6">
                                    <Textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="min-h-[200px] border-none bg-transparent resize-y p-0 leading-relaxed text-lg text-neutral-700 dark:text-neutral-300 italic focus:ring-0 focus:bg-neutral-50 dark:focus:bg-neutral-900 rounded w-full"
                                        placeholder="Enter the organization's mission and description here..."
                                    />
                                </div>
                            </div>

                            {/* --- FORM BUILDER SECTION --- */}
                            <div className="mt-20 pt-12 border-t-4 border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-sm text-indigo-600 dark:text-indigo-400 h-fit">
                                            <Settings2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wide">Application Form Builder</h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Customize the questions asked during membership application.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <span className="text-[10px] uppercase font-bold text-neutral-400 self-center mr-2">Add Field:</span>
                                        {['text', 'number', 'textarea', 'select', 'file', 'checkbox'].map(type => (
                                            <Button
                                                key={type}
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addFormField(type)}
                                                className="text-[10px] font-black uppercase hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                + {type}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {data.form_schema && data.form_schema.length > 0 ? (
                                        data.form_schema.map((field: any, index: number) => (
                                            <div key={index} className="bg-white dark:bg-neutral-900 p-6 rounded border border-neutral-200 dark:border-neutral-800 shadow-sm relative group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                                                    {/* Ordering / ID */}
                                                    <div className="md:col-span-1 flex justify-center pt-3">
                                                        <Badge variant="outline" className="text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800">{index + 1}</Badge>
                                                    </div>

                                                    {/* Field Config */}
                                                    <div className="md:col-span-7 space-y-4">
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] font-bold uppercase text-neutral-400">Question Label</Label>
                                                            <Input
                                                                value={field.label}
                                                                onChange={e => updateFormField(index, 'label', e.target.value)}
                                                                className="font-bold bg-neutral-50 dark:bg-neutral-950 border-neutral-200"
                                                                placeholder="e.g. Current Occupation"
                                                            />
                                                        </div>

                                                        {(field.type === 'select' || field.type === 'radio') && (
                                                            <div className="pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/30">
                                                                <Label className="text-[10px] font-bold uppercase text-indigo-400 mb-2 block">Answer Options</Label>
                                                                <div className="space-y-2">
                                                                    {field.options && field.options.map((option: string, optIndex: number) => (
                                                                        <div key={optIndex} className="flex items-center gap-2">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                                                                            <Input
                                                                                value={option}
                                                                                onChange={e => updateOption(index, optIndex, e.target.value)}
                                                                                className="h-8 text-xs bg-white dark:bg-neutral-950 w-full"
                                                                            />
                                                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index, optIndex)} className="h-8 w-8 p-0 text-red-400 hover:text-red-600">
                                                                                <Trash2 size={12} />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                    <Button type="button" variant="ghost" size="sm" onClick={() => addOption(index)} className="text-[10px] font-bold text-indigo-600 h-auto p-0 hover:bg-transparent hover:underline">
                                                                        + Add Another Option
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Settings */}
                                                    <div className="md:col-span-4 space-y-4 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-sm">
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] font-bold uppercase text-neutral-400">Input Type</Label>
                                                            <Select
                                                                value={field.type}
                                                                onValueChange={(val) => updateFormField(index, 'type', val)}
                                                            >
                                                                <SelectTrigger className="h-9">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="text">Text Input</SelectItem>
                                                                    <SelectItem value="number">Number</SelectItem>
                                                                    <SelectItem value="textarea">Long Text</SelectItem>
                                                                    <SelectItem value="select">Dropdown Select</SelectItem>
                                                                    <SelectItem value="radio">Radio Buttons</SelectItem>
                                                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                                                    <SelectItem value="file">File Upload</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2">
                                                            <Label className="text-[10px] font-bold uppercase text-neutral-400">Required Field?</Label>
                                                            <div className="flex items-center h-5">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={field.required}
                                                                    onChange={e => updateFormField(index, 'required', e.target.checked)}
                                                                    className="w-4 h-4 text-blue-600 rounded border-neutral-300 focus:ring-blue-600"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFormField(index)}
                                                    className="absolute top-2 right-2 text-neutral-300 hover:text-red-500 p-2 transition-colors"
                                                    title="Remove Field"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded bg-neutral-50 dark:bg-neutral-900/50">
                                            <div className="flex justify-center mb-4">
                                                <ListChecks className="text-neutral-300" size={48} />
                                            </div>
                                            <p className="text-neutral-400 text-sm font-bold">No custom application form fields defined.</p>
                                            <p className="text-neutral-400 text-xs mt-1">Click the buttons above to build the application form for this organization.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column (Settings) */}
                        <aside className="lg:col-span-4 max-w-sm ml-auto w-full">
                            <div className="sticky top-10 space-y-6">

                                {/* Theme Selector */}
                                <div className="bg-white dark:bg-neutral-900 p-6 rounded-sm shadow-sm border border-neutral-100 dark:border-neutral-800">
                                    <h3 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <Palette size={14} /> Brand Color
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.class}
                                                type="button"
                                                onClick={() => setData('color_theme', color.class)}
                                                className={`w-8 h-8 rounded-full ${color.class} transition-all ${data.color_theme === color.class ? 'ring-2 ring-offset-2 ring-neutral-900 dark:ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-neutral-400 mt-4 leading-normal">
                                        This color will be applied to the public page background and accents.
                                    </p>
                                </div>

                                {/* Requirements List (Editable) */}
                                <div className="bg-neutral-900 p-8 rounded-sm shadow-xl text-white border-t-8 border-yellow-500">
                                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 text-yellow-500">
                                        <ListChecks className="w-5 h-5" /> Membership Requirements
                                    </h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newRequirement}
                                                onChange={e => setNewRequirement(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                                className="h-9 bg-neutral-800 border-neutral-700 text-[10px] font-bold text-white placeholder:text-neutral-500 focus-visible:ring-yellow-500"
                                                placeholder="ADD REQUIREMENT..."
                                            />
                                            <Button type="button" onClick={addRequirement} className="bg-yellow-500 hover:bg-yellow-400 text-black h-9 w-9 p-0 shrink-0">
                                                <Plus size={16} strokeWidth={3} />
                                            </Button>
                                        </div>

                                        <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {data.requirements.map((req: any, i: any) => (
                                                <li key={i} className="flex items-start gap-3 group bg-white/5 p-2 rounded-sm border border-white/5 hover:border-white/20 transition-colors">
                                                    <div className="mt-1">
                                                        <CheckCircle2 size={12} className="text-yellow-500" />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-tight text-neutral-300 flex-1">
                                                        {req}
                                                    </span>
                                                    <button type="button" onClick={() => removeRequirement(i)} className="text-neutral-500 hover:text-red-500 transition-colors">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </li>
                                            ))}
                                            {data.requirements.length === 0 && (
                                                <li className="text-xs text-neutral-500 italic text-center py-4">No specific requirements listed.</li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="bg-white/5 p-4 rounded text-center border border-white/10">
                                        <Briefcase className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                                        <p className="text-[10px] text-neutral-400 font-bold uppercase">Button Preview</p>
                                        <Button disabled className="w-full mt-2 bg-[#ce1126] text-white font-black uppercase h-10 rounded-none tracking-widest text-[10px] opacity-70 cursor-not-allowed">
                                            Open Membership Form
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-neutral-900 p-6 rounded-sm border border-blue-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <ShieldCheck className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                                        <h4 className="font-black uppercase text-[10px] text-blue-600 dark:text-blue-400 tracking-widest">Inclusion Verified</h4>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed uppercase">
                                        This organization is accredited by the Barangay 183 council and follows standard GAD inclusion policies.
                                    </p>
                                </div>

                                <div className="pt-6">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-black h-14 rounded-sm tracking-widest text-[11px] shadow-xl uppercase transition-all hover:-translate-y-1"
                                    >
                                        {processing ? 'Saving...' : 'Save All Changes'} <Save className="ml-2 w-4 h-4" />
                                    </Button>
                                    <p className="text-[9px] text-neutral-400 font-bold uppercase text-center mt-4">
                                        Changes will be live immediately.
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