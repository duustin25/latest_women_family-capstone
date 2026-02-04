import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import * as React from "react";
import { 
    Building2, Users, Search, CheckCircle2, 
    ClipboardList, MapPin, ExternalLink, ShieldCheck 
} from "lucide-react";

export default function Index({ organizations = { data: [] } }: any) {
    const [searchQuery, setSearchQuery] = React.useState("");

    // Filter Logic
    const filteredOrgs = organizations.data.filter((org: any) => {
        return org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               org.description.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <PublicLayout>
            <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
                <Head title="Accredited Organizations - Brgy 183 Villamor" />

                <main className="bg-slate-50 min-h-[60vh]">
                    {/* --- HERO SECTION --- */}
                    <div className="bg-white border-b border-slate-200 py-16">
                        <div className="container mx-auto px-6">
                            <div className="flex items-center gap-3 mb-4 text-[#0038a8]">
                                <ShieldCheck className="w-6 h-6" />
                                <span className="font-black uppercase tracking-[0.2em] text-[10px]">Verified Community Partners</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                                Barangay <span className="text-[#0038a8]">Organizations</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest max-w-2xl leading-relaxed">
                                Explore and join accredited groups dedicated to community development, women's empowerment, and family protection.
                            </p>
                        </div>
                    </div>

                    {/* --- SEARCH & QUICK STATS BAR --- */}
                    <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-200">
                        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row gap-6 justify-between items-center">
                            <div className="flex gap-8 items-center">
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Active</p>
                                    <p className="font-black text-slate-900">{organizations.data.length} Groups</p>
                                </div>
                                <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="font-black text-emerald-600 flex items-center gap-1.5 uppercase text-xs">
                                        <CheckCircle2 className="w-4 h-4" /> 100% Accredited
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input 
                                    type="text" 
                                    placeholder="FIND AN ORGANIZATION (KALIPI, SOLO PARENT...)" 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-[#0038a8] transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- ORGANIZATIONS GRID --- */}
                    <section className="py-16">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredOrgs.length > 0 ? (
                                    filteredOrgs.map((org: any) => (
                                        <article key={org.id} className="bg-white border border-slate-200 flex flex-col group hover:shadow-2xl transition-all duration-500 rounded-sm overflow-hidden">
                                            {/* Top Banner / Logo Area */}
                                            <div className="h-32 w-full overflow-hidden bg-slate-200 relative">
                                                {/* Dynamic Color Theme Accent */}
                                                <div className={`absolute inset-0 opacity-40 ${org.color_theme || 'bg-[#0038a8]'}`}></div>
                                                
                                                {/* Floating Membership Badge */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className="bg-white text-slate-900 text-[9px] font-black px-3 py-1 uppercase tracking-wider shadow-md">
                                                        {org.requirements ? `${org.requirements.length} Requirements` : 'No Requirements'}
                                                    </span>
                                                </div>

                                                {/* Branding / Icon */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    {org.image ? (
                                                        <img src={org.image} className="w-full h-full object-cover" alt={org.name} />
                                                    ) : (
                                                        <Building2 className="w-12 h-12 text-white/50" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Main Info */}
                                            <div className="p-8 flex flex-col flex-grow">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className={`w-2 h-2 rounded-full ${org.color_theme || 'bg-[#0038a8]'}`}></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accredited Org</span>
                                                </div>

                                                <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-[#0038a8] transition-colors leading-none uppercase tracking-tighter">
                                                    {org.name}
                                                </h3>
                                                
                                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                                    <Users className="w-3.5 h-3.5" /> 
                                                    Pres: {org.president_name || 'TBA'}
                                                </p>

                                                <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-3 italic">
                                                    "{org.description}"
                                                </p>

                                                {/* Dynamic Requirements Summary (Hover Feature) */}
                                                <div className="mt-auto space-y-4">
                                                    <p className="text-[14px]"> Requirements: </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {org.requirements?.slice(0, 3).map((req: string, i: number) => (
                                                            <span key={i} className="text-[10px] font-black uppercase bg-slate-50 text-slate-400 border border-slate-100 px-2 py-1">
                                                                {req}
                                                            </span>
                                                        ))}
                                                        {org.requirements?.length > 3 && <span className="text-[8px] font-black uppercase text-slate-400">+{org.requirements.length - 3} more</span>}
                                                    </div>

                                                    <div className="pt-6 border-t border-slate-100">
                                                        <Link
                                                            href={`/organizations/${org.slug}`} 
                                                            className="w-full h-12 inline-flex items-center justify-center gap-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-[#0038a8] transition-all"
                                                        >
                                                            View Profile & Apply <ExternalLink size={12}/>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-300 rounded-lg">
                                        <p className="text-slate-500 font-black uppercase tracking-widest italic">No organizations match your search.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </PublicLayout>
    );
}