import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Palette, Building2, Upload, ListChecks, Plus, CheckCircle2, Trash2, Info } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";

interface OrganizationSettingsProps {
    data: any;
    setData: (key: string, value: any) => void;
    record: any;
}

export default function OrganizationSettings({ data, setData, record }: OrganizationSettingsProps) {
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
                    <div className={`w-3 h-3 rounded-full ${data.color_theme}`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${data.color_theme.replace('bg-', 'text-')} dark:text-blue-400`}>Official Organization</span>
                </div>

                <Input
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-6 leading-none tracking-tighter uppercase border-none bg-transparent shadow-none hover:bg-neutral-50 focus:bg-white focus:ring-2 h-auto py-2 px-2 -ml-2 rounded-sm"
                    placeholder="ORGANIZATION NAME"
                />

                <div className="flex flex-wrap gap-6 text-neutral-500 dark:text-neutral-400 font-bold tracking-wider items-center">
                    <span className="flex items-center gap-2 px-3 py-1 bg-neutral-50 dark:bg-neutral-950 rounded-sm hover:bg-neutral-100 transition-colors">
                        <Users className="w-4 h-4 text-neutral-400" /> Pres.
                        <Input
                            value={data.president_name}
                            onChange={e => setData('president_name', e.target.value)}
                            className="h-6 w-48 border-none bg-transparent shadow-none text-current font-bold focus:bg-white p-0 px-1"
                            placeholder="President Name"
                        />
                    </span>
                </div>

                <div className="mt-6">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                        <Info size={12} /> Organization Mission / Description
                    </label>
                    <RichTextEditor
                        value={data.description}
                        onChange={(val: string) => setData('description', val)}
                        className="min-h-[100px] bg-neutral-50 dark:bg-neutral-950/50"
                    />
                </div>
            </header>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Brand Color */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                        <Palette size={14} /> Brand Color
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color.class}
                                type="button"
                                onClick={() => setData('color_theme', color.class)}
                                className={`w-8 h-8 rounded-full ${color.class} transition-all ${data.color_theme === color.class ? 'ring-2 ring-offset-2 ring-neutral-900 dark:ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Image Upload */}
                <div className="aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-800 relative bg-neutral-100 dark:bg-neutral-900 group">
                    {data.image ? (
                        <img src={URL.createObjectURL(data.image)} className="w-full h-full object-cover" />
                    ) : record.image ? (
                        <img src={record.image} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-40 text-neutral-400">
                            <Building2 size={48} className="mb-2" />
                            <span className="text-[10px] font-bold uppercase">No Cover Image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white z-10">
                        <label className="cursor-pointer flex flex-col items-center">
                            <Upload size={24} className="mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Change Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Requirements List */}
            <div className="bg-neutral-900 p-8 rounded-lg shadow-xl text-white border-l-8 border-yellow-500">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 text-yellow-500">
                    <ListChecks className="w-5 h-5" /> Membership Requirements
                </h3>
                <div className="space-y-4">
                    <div className="flex gap-2">
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
                            className="h-9 bg-neutral-800 border-neutral-700 text-[10px] font-bold text-white placeholder:text-neutral-500 focus-visible:ring-yellow-500"
                            placeholder="ADD REQUIREMENT & PRESS ENTER..."
                        />
                        <Button type="button" onClick={() => {
                            const input = document.getElementById('new_req_input') as HTMLInputElement;
                            addRequirement(input.value);
                            input.value = '';
                        }} className="bg-yellow-500 hover:bg-yellow-400 text-black h-9 w-9 p-0 shrink-0">
                            <Plus size={16} strokeWidth={3} />
                        </Button>
                    </div>
                    <ul className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {data.requirements.map((req: any, i: any) => (
                            <li key={i} className="flex items-start gap-3 group bg-white/5 p-2 rounded-sm border border-white/5 hover:border-white/20 transition-colors">
                                <CheckCircle2 size={12} className="text-yellow-500 mt-0.5" />
                                <span className="text-[10px] font-bold uppercase tracking-tight text-neutral-300 flex-1">{req}</span>
                                <button type="button" onClick={() => removeRequirement(i)} className="text-neutral-500 hover:text-red-500 transition-colors">
                                    <Trash2 size={12} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
