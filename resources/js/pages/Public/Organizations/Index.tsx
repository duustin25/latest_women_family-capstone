import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import * as React from "react";
import {
    Building2, Users, Search, CheckCircle2,
    ClipboardList, MapPin, ExternalLink, ShieldCheck, ArrowRight
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
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-900">
                <Head title="Accredited Organizations - Brgy 183 Villamor" />

                {/* --- HERO SECTION --- */}
                <div className="bg-white border-b border-slate-100 py-16 md:py-24 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 opacity-50 -skew-x-12 translate-x-12"></div>

                    <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-end justify-between gap-12">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 border border-purple-100 mb-6">
                                <ShieldCheck size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Community Partners</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 uppercase leading-[0.9]">
                                Community <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Alliance</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest leading-relaxed max-w-lg">
                                Explore and join accredited groups dedicated to community development, women's empowerment, and family protection.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full md:w-96 relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="FIND AN ORGANIZATION..."
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-purple-100 focus:border-purple-200 focus:bg-white transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <main className="min-h-[60vh] py-20 relative">
                    <div className="container mx-auto px-6">

                        {/* Stats Bar */}
                        <div className="flex flex-wrap gap-8 mb-12 border-b border-slate-200 pb-8">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-black text-slate-200">01</span>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Active</p>
                                    <p className="font-bold text-slate-900">{organizations.data.length} Groups</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-black text-slate-200">02</span>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                                    <p className="font-bold text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 size={14} /> Fully Accredited
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Organizations Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredOrgs.length > 0 ? (
                                filteredOrgs.map((org: any) => (
                                    <Link key={org.id} href={`/organizations/${org.slug}`} className="group relative bg-white border border-slate-200 rounded-3xl p-1 hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-500 hover:-translate-y-2">
                                        <div className="bg-slate-50 rounded-[20px] p-8 h-full flex flex-col relative overflow-hidden group-hover:bg-white transition-colors duration-500">

                                            {/* Decorative Gradient Blob */}
                                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${org.color_theme ? `from-${org.color_theme.replace('bg-', '')}-100` : 'from-purple-100'} to-transparent rounded-bl-[100px] opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out`}></div>

                                            {/* Organization Icon/Logo */}
                                            <div className={`w-14 h-14 rounded-2xl ${org.color_theme || 'bg-purple-600'} text-white flex items-center justify-center mb-6 shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform duration-500`}>
                                                {org.image ? (
                                                    <img src={org.image} className="w-full h-full object-cover rounded-2xl" alt={org.name} />
                                                ) : (
                                                    <div className="font-black text-xl">{org.name.substring(0, 2)}</div>
                                                )}
                                            </div>

                                            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight leading-none group-hover:text-purple-700 transition-colors">
                                                {org.name}
                                            </h3>

                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="px-2 py-1 rounded-md bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 shadow-sm">
                                                    <Users size={12} /> {org.president_name || 'TBA'}
                                                </div>
                                            </div>

                                            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 group-hover:text-slate-600 transition-colors">
                                                {org.description}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between border-t border-slate-200/50 pt-6">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                                                    ))}
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">+</div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-purple-200 group-hover:text-purple-600 transition-colors shadow-sm">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>

                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full py-24 text-center">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                        <Building2 size={32} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">No Organizations Found</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Try adjusting your search query.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </PublicLayout>
    );
}