import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft, Save, Building2, ListChecks, Plus,
    Trash2, Upload, User, Palette, FileText
} from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

export default function Create() {
    const [newRequirement, setNewRequirement] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        president_name: '',
        color_theme: 'bg-[#0038a8]',
        image: null as File | null,
        requirements: [] as string[],
    });

    const addRequirement = () => {
        if (!newRequirement.trim()) return;
        setData('requirements', [...data.requirements, newRequirement]);
        setNewRequirement('');
    };

    const removeRequirement = (index: number) => {
        setData('requirements', data.requirements.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/organizations', {
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

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Organizations', href: '/admin/organizations' }, { title: 'Create Profile', href: '#' }]}>
            <Head title="Create Organization" />

            <div className="min-h-screen transition-colors py-12">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Navigation */}
                    <Link href="/admin/organizations" className="flex items-center text-[10px] font-black tracking-widest text-neutral-400 hover:text-blue-600 mb-8 group transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> CANCEL & RETURN
                    </Link>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Main Content Column */}
                        <div className="lg:col-span-8">
                            <header className="mb-10 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${data.color_theme}`}></div>
                                    <span className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">New Profile Registration</span>
                                </div>

                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-neutral-400 tracking-widest ml-1 uppercase">Organization Formal Name</label>
                                    <input
                                        className="w-full text-4xl md:text-5xl font-black text-neutral-900 dark:text-white bg-transparent border-b-4 border-neutral-200 dark:border-neutral-800 focus:border-blue-600 focus:ring-0 px-0 py-4 transition-all tracking-tighter placeholder:text-neutral-200 dark:placeholder:text-neutral-800"
                                        placeholder="ENTER NAME..."
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1">{errors.name}</p>}
                                </div>
                            </header>

                            {/* Image Upload Area */}
                            <div className="aspect-video w-full overflow-hidden rounded-sm mb-12 border-4 border-white dark:border-neutral-800 shadow-xl relative bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center group">
                                {data.image ? (
                                    <img src={URL.createObjectURL(data.image)} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-neutral-400">
                                        <Building2 size={64} className="mb-4 opacity-50" />
                                        <span className="text-xs font-bold uppercase tracking-widest">No Cover Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-neutral-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                                    <Upload size={32} className="mb-2 animate-bounce" />
                                    <label className="cursor-pointer bg-white text-black px-8 py-3 font-black text-[10px] tracking-widest hover:bg-yellow-400 transition-colors uppercase">
                                        Upload Cover Image
                                        <input type="file" className="hidden" accept="image/*" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} />
                                    </label>
                                    <p className="mt-4 text-[10px] text-neutral-400 font-medium uppercase">Recommended: 1920x1080px JPG/PNG</p>
                                </div>
                            </div>
                            {errors.image && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mb-6">{errors.image}</p>}


                            {/* Form Fields Section */}
                            <div className="space-y-12">

                                {/* President / Leader */}
                                <div className="bg-white dark:bg-neutral-800 p-8 rounded-sm shadow-sm border border-neutral-100 dark:border-neutral-700/50">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-sm text-blue-600 dark:text-blue-400">
                                            <User size={24} />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wide">Presiding Officer</h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">The current head or president of the organization.</p>
                                            </div>
                                            <Input
                                                value={data.president_name}
                                                onChange={e => setData('president_name', e.target.value)}
                                                className="h-12 border-neutral-200 dark:border-neutral-700 font-bold"
                                                placeholder="e.g. Juan A. Dela Cruz"
                                            />
                                            {errors.president_name && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">{errors.president_name}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="bg-white dark:bg-neutral-800 p-8 rounded-sm shadow-sm border border-neutral-100 dark:border-neutral-700/50">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-sm text-emerald-600 dark:text-emerald-400">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wide">Mission & Description</h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">A verified description of the organization's purpose and goals.</p>
                                            </div>
                                            <Textarea
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                className="min-h-[150px] border-neutral-200 dark:border-neutral-700 resize-y p-4 leading-relaxed text-sm"
                                                placeholder="Enter description here..."
                                            />
                                            {errors.description && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">{errors.description}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Theme Selector */}
                                <div className="bg-white dark:bg-neutral-800 p-8 rounded-sm shadow-sm border border-neutral-100 dark:border-neutral-700/50">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-sm text-violet-600 dark:text-violet-400">
                                            <Palette size={24} />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wide">Brand Color Theme</h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Select a primary color for the organization's branding.</p>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {colorOptions.map((color) => (
                                                    <button
                                                        key={color.class}
                                                        type="button"
                                                        onClick={() => setData('color_theme', color.class)}
                                                        className={`w-10 h-10 rounded-full ${color.class} transition-all ${data.color_theme === color.class ? 'ring-4 ring-offset-2 ring-neutral-900 dark:ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                                                        title={color.name}
                                                    />
                                                ))}
                                            </div>
                                            {errors.color_theme && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">{errors.color_theme}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <aside className="lg:col-span-4 max-w-sm ml-auto w-full">
                            <div className="sticky top-10 space-y-6">

                                <div className="bg-neutral-900 dark:bg-black p-8 rounded-sm shadow-2xl text-white border-t-8 border-yellow-500">
                                    <h3 className="text-xs font-black tracking-widest flex items-center gap-2 mb-6 text-yellow-500 uppercase">
                                        <ListChecks className="w-5 h-5" /> Membership Requirements
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newRequirement}
                                                onChange={e => setNewRequirement(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                                className="h-10 bg-neutral-800 border-neutral-700 text-[10px] font-bold text-white placeholder:text-neutral-500 focus-visible:ring-yellow-500"
                                                placeholder="ADD REQUIREMENT..."
                                            />
                                            <Button type="button" onClick={addRequirement} className="bg-yellow-500 hover:bg-yellow-400 text-black h-10 w-10 p-0 shrink-0">
                                                <Plus size={18} strokeWidth={3} />
                                            </Button>
                                        </div>

                                        <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {data.requirements.length === 0 ? (
                                                <li className="text-[10px] text-neutral-500 italic text-center py-4">No requirements added yet.</li>
                                            ) : (
                                                data.requirements.map((req, i) => (
                                                    <li key={i} className="flex items-center justify-between gap-3 bg-white/5 p-3 rounded-sm border border-white/10 group hover:border-white/30 transition-colors">
                                                        <span className="text-[10px] font-bold tracking-tight text-neutral-300 uppercase">{req}</span>
                                                        <button type="button" onClick={() => removeRequirement(i)} className="text-neutral-500 hover:text-red-500 transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-16 rounded-sm tracking-widest text-[11px] shadow-xl uppercase transition-all hover:-translate-y-1"
                                    >
                                        {processing ? 'Creating Profile...' : 'Save Organization Profile'} <Save className="ml-2 w-4 h-4" />
                                    </Button>
                                    <p className="text-[9px] text-neutral-400 text-center font-bold uppercase pt-2">
                                        All fields are subject to administrator review.
                                    </p>
                                </div>

                            </div>
                        </aside>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}