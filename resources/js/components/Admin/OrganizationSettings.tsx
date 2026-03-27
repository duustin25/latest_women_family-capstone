import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Palette, Building2, Upload, ListChecks, Plus, CheckCircle2, Trash2, Info } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useState, useEffect } from 'react';

export interface OrganizationSettingsProps {
    data: any;
    setData: (key: string, value: any) => void;
    record: any;
    users?: any[];
}

export default function OrganizationSettings({ data, setData, record, users = [] }: OrganizationSettingsProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Synchronize preview URL for new uploads
    useEffect(() => {
        if (!data.image) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(data.image);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [data.image]);

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

    const addRequirement = (req: string) => {
        if (!req.trim()) return;
        setData('requirements', [...data.requirements, req]);
    };

    const removeRequirement = (index: number) => {
        setData('requirements', data.requirements.filter((_: any, i: any) => i !== index));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <header className="bg-white dark:bg-neutral-900 shadow-sm rounded-lg p-8 relative group border-2 border-transparent hover:border-blue-200 transition-all">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase pointer-events-none">
                    Editable Region
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className={`w-4 h-4 rounded-full ${data.color_theme}`}></div>
                    <span className={`text-xs font-black uppercase tracking-[0.2em] ${data.color_theme.replace('bg-', 'text-')} dark:text-blue-400`}>Official Organization Profile</span>
                </div>

                <Input
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white mb-6 leading-none tracking-tighter uppercase border-none bg-transparent shadow-none focus:bg-neutral-200 dark:focus:bg-neutral-800 focus:ring-2 h-auto py-3 px-3 -ml-3 rounded-md transition-all"
                    placeholder="ORGANIZATION NAME"
                />

                <div className="flex flex-wrap gap-6 text-neutral-500 dark:text-neutral-400 font-bold tracking-wider items-center">
                    <span className="flex items-center gap-3 px-4 py-2 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-100 dark:border-neutral-800 transition-colors shadow-sm">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-xs uppercase font-black tracking-widest text-neutral-400">President:</span>
                        {/* President Selection */}
                        <div className="w-64">
                            <Select
                                value={data.president_name}
                                onValueChange={(val) => setData('president_name', val)}
                            >
                                <SelectTrigger className="h-10 border-none bg-transparent shadow-none text-sm font-black p-0 px-1 focus:ring-0">
                                    <SelectValue placeholder="Select President..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-[350px]">
                                    {users && users.map((user: any) => (
                                        <SelectItem key={user.id} value={user.name} className="py-3 font-bold">
                                            {user.name} <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded ml-2 uppercase opacity-60 tracking-tighter">({user.role})</span>
                                        </SelectItem>
                                    ))}
                                    {/* Fallback if current president name is not in list (e.g. manually typed before) */}
                                    {data.president_name && !users?.some(u => u.name === data.president_name) && (
                                        <SelectItem value={data.president_name} className="py-3 font-bold italic">{data.president_name} (Legacy)</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </span>
                </div>

                <div className="mt-8">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-2">
                        <Info size={14} className="text-blue-500" /> Organization Mission & Description
                    </label>
                    <RichTextEditor
                        value={data.description}
                        onChange={(val: string) => setData('description', val)}
                        className="min-h-[120px] bg-neutral-50 dark:bg-neutral-950/50 text-base"
                    />
                </div>
            </header>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Brand Color */}
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Palette size={18} className="text-blue-500" /> Branding Color Theme
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {colorOptions.map((color) => (
                            <button
                                key={color.class}
                                type="button"
                                onClick={() => setData('color_theme', color.class)}
                                className={`w-10 h-10 rounded-xl ${color.class} transition-all duration-300 ${data.color_theme === color.class ? 'ring-4 ring-offset-4 ring-neutral-900 dark:ring-white scale-110 shadow-xl' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Image Upload */}
                <div className="aspect-video w-full overflow-hidden rounded-xl border-4 border-dashed border-neutral-300 dark:border-neutral-800 relative bg-neutral-100 dark:bg-neutral-900 group shadow-inner transition-all hover:border-blue-400">
                    {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-cover" />
                    ) : record.image ? (
                        <img src={record.image} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-40 text-neutral-400">
                            <Building2 size={64} className="mb-3" />
                            <span className="text-xs font-black uppercase tracking-widest">No Cover Image Uploaded</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white z-10 backdrop-blur-[2px]">
                        <label className="cursor-pointer flex flex-col items-center p-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all">
                            <Upload size={32} className="mb-2" />
                            <span className="text-xs font-black uppercase tracking-widest">Update Cover Photo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Requirements List */}
            <div className="bg-neutral-900 p-8 rounded-xl shadow-2xl text-white border-l-[12px] border-yellow-500 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 mb-8 text-yellow-500 drop-shadow-sm">
                    <ListChecks className="w-6 h-6" /> Required Documents for Membership
                </h3>

                <div className="space-y-6">
                    <div className="flex gap-3">
                        <Input
                            id="new_req_input"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const target = e.currentTarget as HTMLInputElement;
                                    addRequirement(target.value);
                                    target.value = '';
                                }
                            }}
                            className="h-12 bg-neutral-800 border-neutral-700 text-sm font-bold text-white placeholder:text-neutral-500 focus-visible:ring-yellow-500 rounded-xl px-5 shadow-inner"
                            placeholder="TYPE REQUIREMENT & HIT ENTER TO ADD..."
                        />
                        <Button type="button" onClick={() => {
                            const input = document.getElementById('new_req_input') as HTMLInputElement;
                            addRequirement(input.value);
                            input.value = '';
                        }} className="bg-yellow-500 hover:bg-yellow-400 text-black h-12 px-6 rounded-xl shrink-0 shadow-lg active:scale-95 transition-all">
                            <Plus size={20} strokeWidth={3} />
                        </Button>
                    </div>

                    <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                        {data.requirements.length === 0 ? (
                            <li className="text-neutral-500 italic text-sm py-4 border-2 border-dashed border-neutral-800 rounded-xl text-center">No requirements listed yet.</li>
                        ) : (
                            data.requirements.map((req: any, i: any) => (
                                <li key={i} className="flex items-center gap-4 group bg-white/5 p-4 rounded-xl border border-white/5 hover:border-yellow-500/30 hover:bg-white/10 transition-all shadow-sm">
                                    <CheckCircle2 size={18} className="text-yellow-500 shrink-0" />
                                    <span className="text-sm font-black uppercase tracking-tight text-neutral-100 flex-1">{req}</span>
                                    <button type="button" onClick={() => removeRequirement(i)} className="text-neutral-600 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
