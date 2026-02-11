import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { Landmark, UserCheck, Heart, ShieldAlert, Users } from "lucide-react";

interface Official {
    id: number;
    name: string;
    position: string;
    committee?: string;
    image_path: string;
    contact?: string;
    email?: string;
}

interface Props {
    head: Official | null;
    secretary: Official | null;
    staff: Official[];
}

export default function Index({ head, secretary, staff }: Props) {
    const brgyName = import.meta.env.VITE_APP_BARANGAY_NAME || 'Barangay 183 Villamor';
    const defaultImage = "https://ui-avatars.com/api/?background=random&color=fff&name=";

    const presidents = [
        { org: "KALIPI", name: "ELENA REYES", icon: <UserCheck size={18} /> },
        { org: "SOLO PARENTS", name: "MARIA DELA CRUZ", icon: <Heart size={18} /> },
        { org: "VCO", name: "JUANITO SAMPLE", icon: <ShieldAlert size={18} /> },
        { org: "ERPAT", name: "RAMIL RODRIGUEZ", icon: <Users size={18} /> },
    ];

    const OfficialCard = ({ image_path, name, position, committee, className = "", isHead = false }: any) => {
        const imgSrc = image_path || defaultImage + encodeURIComponent(name);

        return (
            <div className={`relative group z-10 flex flex-col items-center ${className}`}>
                {/* FIXED BACKGROUND LOGO */}
                <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-0">
                    <img
                        src="/Logo/barangay183LOGO.png"
                        alt="Barangay 183 Logo"
                        className="w-[500px] opacity-5"
                    />
                </div>
                <div className={`
                    relative w-64 bg-white rounded-2xl shadow-lg border transition-all duration-300
                    flex flex-col items-center p-6 text-center
                    ${isHead ? 'border-yellow-400 shadow-yellow-900/10 scale-105' : 'border-slate-100 hover:border-purple-200 hover:-translate-y-1 hover:shadow-xl'}
                `}>

                    {/* Role Badge */}
                    <div className={`
                        absolute -top-3 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm
                        ${isHead ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-900 text-white'}
                    `}>
                        {position}
                    </div>

                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full p-1 bg-white border border-slate-100 shadow-inner mb-4 mt-2 overflow-hidden">
                        <img src={imgSrc} alt={name} className="w-full h-full object-cover rounded-full" />
                    </div>

                    <h3 className="font-black text-slate-900 text-sm uppercase leading-tight mb-1 group-hover:text-purple-700 transition-colors">
                        {name}
                    </h3>

                    {committee && (
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mb-4 line-clamp-2">
                            {committee}
                        </p>
                    )}


                </div>
            </div>
        );
    };

    return (
        <PublicLayout>
            <Head title={`Officials - ${brgyName}`} />

            <div className="bg-slate-50 min-h-screen pb-32 font-sans selection:bg-purple-200">

                {/* --- HEADER --- */}
                <div className="bg-white border-b border-slate-100 py-16 text-center relative overflow-hidden">
                    <div className="relative z-10 container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                            Organizational <span className="text-purple-600">Chart</span>
                        </h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                            {brgyName} • Official Hierarchy
                        </p>
                    </div>
                </div>

                {/* --- TREE CONTAINER --- */}
                <div className="container mx-auto px-4 mt-16 overflow-x-auto">
                    {/* Add min-width to ensure the tree doesn't break on small screens, allowing horizontal scroll */}
                    <div className="min-w-[768px] flex flex-col items-center pb-20">

                        {/* LEVEL 1: HEAD */}
                        <div className="flex flex-col items-center relative z-30">
                            {head ? (
                                <OfficialCard {...head} isHead={true} />
                            ) : (
                                <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 text-xs font-black uppercase">Vacant Position</div>
                            )}
                            {/* Vertical Line from Head */}
                            <div className="w-0.5 h-16 bg-slate-300"></div>
                        </div>

                        {/* LEVEL 2: SECRETARY */}
                        <div className="flex flex-col items-center relative z-20">
                            {secretary ? (
                                <OfficialCard {...secretary} />
                            ) : (
                                <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 text-xs font-black uppercase">Vacant Position</div>
                            )}
                            {/* Vertical Line from Secretary */}
                            <div className="w-0.5 h-16 bg-slate-300"></div>
                        </div>

                        {/* LEVEL 3: STAFF BRANCHING */}
                        <div className="w-full max-w-6xl flex flex-col items-center relative z-10">

                            {/* Horizontal Connector Line */}
                            {staff.length > 0 && (
                                <div className="relative w-full h-0.5 bg-slate-300 mb-12">
                                    {/* Center Vertical Connect coming from above */}
                                    <div className="absolute left-1/2 -top-4  h-4 w-0.5 bg-slate-300 -translate-x-1/2"></div>

                                    {/* Left End Vertical Drop */}
                                    <div className="absolute left-[10%] top-0 h-12 w-0.5 bg-slate-300 translate-y-0.5"></div>
                                    {/* Right End Vertical Drop */}
                                    <div className="absolute right-[10%] top-0 h-12 w-0.5 bg-slate-300 translate-y-0.5"></div>

                                    {/* Center Group Vertical Drop (for multiple rows if needed, simplified here to distribute) */}
                                </div>
                            )}

                            {/* Staff Cards Grid - Positioned to align with line drops */}
                            <div className="grid grid-cols-3 gap-x-12 gap-y-16 w-full">
                                {staff.length > 0 ? staff.map((member, index) => {
                                    // Logic to determine connector line position based on index if strictly visual logic needed
                                    // For a simplified flexible grid that looks like a tree:
                                    return (
                                        <div key={member.id} className="flex flex-col items-center relative">
                                            {/* Connector from Horizontal Line above */}
                                            {/* We simulate specific connectors. For a pure CSS tree, we'd need exact width calcs. 
                                                Here we act as if the horizontal line covers them. 
                                                A simple robust way is: Center connector for middle items, Left/Right for edges.
                                            */}
                                            <div className="absolute -top-[49px] h-[49px] w-0.5 bg-slate-300"></div>

                                            {/* Dot at junction */}
                                            <div className="absolute -top-[4px] w-2 h-2 bg-slate-200 rounded-full border border-slate-300 z-10"></div>

                                            <OfficialCard {...member} />
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-3 text-center py-10">
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest italic">No staff members assigned.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- LEGEND / PARTNERS --- */}
                <div className="container mx-auto px-4 max-w-4xl mt-12 border-t border-slate-200 pt-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span> Executive
                            <span className="w-3 h-3 bg-slate-900 rounded-full"></span> Admin / Staff
                        </div>
                        <div className="text-[10px] font-black uppercase text-slate-300">
                            Official Organizational Chart • Updated 2026
                        </div>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}