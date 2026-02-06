import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { ShieldCheck, Award, Landmark, UserCheck, Heart, ShieldAlert, Users } from "lucide-react";

interface Official {
    id: number;
    name: string;
    position: string;
    committee?: string;
    image_path: string;
}

interface Props {
    head: Official | null;
    secretary: Official | null;
    staff: Official[];
}

export default function Index({ head, secretary, staff }: Props) {
    const brgyName = import.meta.env.VITE_APP_BARANGAY_NAME || 'Barangay 183 Villamor';

    // Default Avatar generator
    const defaultImage = "https://ui-avatars.com/api/?background=random&name=";

    const presidents = [
        { org: "KALIPI", name: "ELENA REYES", icon: <UserCheck size={18} /> },
        { org: "SOLO PARENTS", name: "MARIA DELA CRUZ", icon: <Heart size={18} /> },
        { org: "VCO", name: "JUANITO SAMPLE", icon: <ShieldAlert size={18} /> },
        { org: "ERPAT", name: "RAMIL RODRIGUEZ", icon: <Users size={18} /> },
    ];

    const OrgCard = ({ image_path, name, position, committee, className = "" }: any) => {
        const imgSrc = image_path || defaultImage + encodeURIComponent(name);

        return (
            <div className={`flex flex-col items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm p-4 rounded-md w-64 text-center z-10 ${className}`}>
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600 mb-3 bg-slate-100 dark:bg-slate-800">
                    <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase leading-tight mb-1">{name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">{position}</p>
                {committee && (
                    <p className="text-slate-400 dark:text-slate-500 text-[9px] font-medium uppercase mt-2 border-t border-slate-100 dark:border-slate-800 pt-2 w-full">
                        {committee}
                    </p>
                )}
            </div>
        );
    };

    return (
        <PublicLayout>
            <Head title="Structure" />

            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 font-sans selection:bg-blue-100">
                {/* --- SIMPLE HEADER --- */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 text-center shadow-sm">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
                        Organizational Structure
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        {brgyName} • Office of Women and Family Protection
                    </p>
                </div>

                <div className="container mx-auto px-4 mt-16 overflow-x-auto">
                    <div className="w-full min-w-[800px] flex flex-col items-center">

                        {/* --- LEVEL 1: HEAD --- */}
                        <div className="flex flex-col items-center">
                            {head ? (
                                <OrgCard {...head} className="border-t-4 border-t-purple-600 dark:border-t-purple-500" />
                            ) : (
                                <div className="p-4 text-slate-400 border border-dashed text-sm">No Active Head</div>
                            )}
                            {/* Vertical Line Down */}
                            <div className="w-px h-12 bg-slate-400 dark:bg-slate-600"></div>
                        </div>

                        {/* --- LEVEL 2: SECRETARY --- */}
                        <div className="flex flex-col items-center relative">
                            {secretary ? (
                                <OrgCard {...secretary} />
                            ) : (
                                <div className="p-4 text-slate-400 border border-dashed text-sm">No Secretary</div>
                            )}
                            <div className="w-px h-12 bg-slate-400 dark:bg-slate-600"></div>
                        </div>

                        {/* --- LEVEL 3: STAFF (BRANCHING) --- */}
                        <div className="flex flex-col items-center w-full">
                            <div className="relative w-[30%] lg:w-[60%] h-px bg-slate-400 dark:bg-slate-600 mb-8 self-center">
                                <div className="absolute left-1/2 -top-12 h-12 w-px bg-slate-400 dark:bg-slate-600 -translate-x-1/2"></div>
                            </div>

                            <div className="grid grid-cols-3 gap-x-8 gap-y-12">
                                {staff.length > 0 ? staff.map((member) => (
                                    <div key={member.id} className="flex flex-col items-center relative">
                                        {/* Connector Up to Horizontal Line */}
                                        <div className="absolute -top-12 bottom-full left-1/2 w-px h-12 bg-slate-400 dark:bg-slate-600 -translate-x-1/2"></div>
                                        {/* Dot at intersection */}
                                        <div className="absolute -top-[49px] left-1/2 w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full -translate-x-1/2"></div>

                                        <OrgCard {...member} className="w-56" />
                                    </div>
                                )) : (
                                    <div className="col-span-3 text-center text-slate-400 text-sm italic">
                                        No staff members added yet.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- RELATED ORGS SECTION --- */}
                <div className="mt-32 border-t border-slate-200 dark:border-slate-800 pt-16">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                            <Landmark size={12} /> Accredited Partners
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {presidents.map((org, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-purple-200 transition-all flex flex-col items-center group">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-3 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                        {org.icon}
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase">{org.name}</h4>
                                    <p className="text-purple-600 dark:text-purple-400 text-[9px] font-bold uppercase tracking-wider mt-1">{org.org} President</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}