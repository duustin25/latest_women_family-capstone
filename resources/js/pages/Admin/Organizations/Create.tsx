import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Building2, UserCircle, ListChecks, Upload } from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Organizations', href: '/admin/organizations' },
    { title: 'Create', href: '#' },
];

export default function Create() {
    const [newRequirement, setNewRequirement] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        president_name: '',
        color_theme: 'bg-blue-600',
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
            onSuccess: () => {
                // Clear state if needed, though usually redirects to index
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Organization" />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href="/admin/organizations" className="inline-flex items-center text-sm font-medium text-slate-500 mb-6 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Management
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <Building2 className="w-6 h-6 text-blue-600" />
                            <h1 className="text-xl font-bold uppercase tracking-tight">New Organization Profile</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* Logo & Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                                        <Upload className="w-3 h-3"/> Org Logo
                                    </label>
                                    <div className="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center overflow-hidden group">
                                        {data.image ? (
                                            <img src={URL.createObjectURL(data.image)} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <Building2 className="w-10 h-10 text-slate-300" />
                                        )}
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 opacity-0 cursor-pointer" 
                                            onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                        />
                                    </div>
                                    <p className="text-[9px] text-slate-400 text-center uppercase font-bold">Click to upload PNG/JPG</p>
                                </div>

                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold flex items-center gap-2"><Building2 className="w-4 h-4"/> Org Name</label>
                                        <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g., KALIPI" className="h-11" />
                                        {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold flex items-center gap-2"><UserCircle className="w-4 h-4"/> President Name</label>
                                        <Input value={data.president_name} onChange={e => setData('president_name', e.target.value)} className="h-11" placeholder="Full Name" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold">About / Description</label>
                                <Textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={4} placeholder="Describe the organization's mission and purpose..." className="resize-none" />
                                {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.description}</p>}
                            </div>

                            {/* Requirements Section */}
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                                <label className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-2 tracking-[0.1em]">
                                    <ListChecks className="w-4 h-4"/> Membership Requirements
                                </label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={newRequirement} 
                                        onChange={e => setNewRequirement(e.target.value)} 
                                        onKeyDown={(e) => {
                                           if (e.key === 'Enter') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            addRequirement();
                                           } 
                                        }}
                                        placeholder="Add requirement (e.g. Valid ID, Brgy Clearance)" 
                                        className="h-11"
                                    />
                                    <Button 
                                        type="button" //
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addRequirement();
                                        }}
                                        className="bg-blue-600 h-11 w-11 p-0 border-2">
                                        <Plus size={20}/>
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {data.requirements.map((req, index) => (
                                        <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 border dark:border-slate-700 rounded-lg text-xs font-bold uppercase shadow-sm">
                                            {req}
                                            <button type="button" onClick={() => removeRequirement(index)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" disabled={processing} className="w-full bg-[#0038a8] hover:bg-blue-800 h-14 font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-500/10">
                                {processing ? 'Creating Profile...' : 'Register Organization Profile'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}