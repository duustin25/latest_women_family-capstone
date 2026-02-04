import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { 
    User, ShieldCheck, Star, Users, 
    ChevronDown, ShieldAlert, Award, 
    Scale, UserCheck, Landmark, Heart
} from "lucide-react";

export default function Index() {
    const brgyName = import.meta.env.VITE_BARANGAY_NAME || 'Barangay 183 Villamor';

    // MOCK DATA WITH REAL IMAGE LINKS
    const officeHead = { 
        name: "HON. GERALD JOHN M. SOBREVEGA", 
        position: "BRGY. KAGAWAD / HEAD", 
        committee: "COMMITTEE ON AVWAC, BCPC, BADAC - ADVOCACY",
        image: "https://scontent.fmnl8-4.fna.fbcdn.net/v/t39.30808-6/591991203_823952690443525_1736614877442256753_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=g1GJXU6srtwQ7kNvwE1F0G9&_nc_oc=AdlR1k6dh52QbHt_a4oNxMMqhIil5ZAYN13blHJmrM0FkjoMfQEDQjU1sx79-us6feI&_nc_zt=23&_nc_ht=scontent.fmnl8-4.fna&_nc_gid=lk0lsWLsuPDSMCKHc9sxaQ&oh=00_AfvuwKFi3ReL1EeKUJQ6wsB1mZ9fG-NGSHRXkaMkINyJ9A&oe=69836AD0" 
    };

    const secretary = { 
        name: "MICHELLE N. LICO", 
        position: "SECRETARY",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop"
    };

    const mainOfficers = [
        { name: "LUZVIMINDA GONZALES", position: "AVWAC OFFICER", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&fit=crop" },
        { name: "GEMMA GONZALES", position: "AVWAC OFFICER", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&fit=crop" },
        { name: "MARIA TERESA BRIZUELA", position: "STAFF", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop" },
        { name: "NELIA CRUZ", position: "STAFF", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&h=200&fit=crop" },
        { name: "RAMIL RODRIGUEZ", position: "STAFF", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop" },
        { name: "KATHLEEN KAYE AMARILLE", position: "STAFF", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&fit=crop" },
    ];

    const orgPresidents = [
        { org: "KALIPI", name: "ELENA REYES", icon: <UserCheck className="text-blue-600" /> },
        { org: "SOLO PARENTS", name: "MARIA DELA CRUZ", icon: <Heart className="text-emerald-600" /> },
        { org: "BCPC", name: "JUANITO SAMPLE", icon: <ShieldAlert className="text-red-600" /> },
        { org: "ERPAT", name: "RAMIL RODRIGUEZ", icon: <Users className="text-indigo-600" /> },
    ];

    return (
        <PublicLayout>
            <Head title="Organization Chart" />
            
            <div className="bg-slate-50 min-h-screen pb-32">
                {/* HERO SECTION - KEPT AS REQUESTED */}
                <div className="bg-[#3b0764] py-24 px-4 text-center text-white border-b-8 border-yellow-500 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-4 italic">
                            The <span className="text-yellow-400 text-shadow-lg">Leadership</span>
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px bg-yellow-500/50 w-12 hidden md:block"></div>
                            <p className="text-xs lg:text-sm font-black uppercase tracking-[0.5em] text-yellow-200">
                                {brgyName} • Office of Women and Family Support
                            </p>
                            <div className="h-px bg-yellow-500/50 w-12 hidden md:block"></div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-16 relative z-30">
                    
                    {/* --- MAIN CHART CONTAINER --- */}
                    <div className="space-y-12">
                        
                        {/* LEVEL 1: THE HEAD */}
                        <div className="flex flex-col items-center">
                            <div className="bg-white p-2 rounded-[0.3rem] shadow-2xl border-2 border-yellow-400">
                                <div className="bg-slate-900 text-white rounded-[0.3rem] overflow-hidden w-[320px] md:w-[450px]">
                                    <div className="flex items-center gap-6 p-6">
                                        <img src={officeHead.image} className="w-24 h-24 md:w-32 md:h-32 rounded-[0.3rem] object-cover border-2 border-yellow-500 shadow-lg" alt={officeHead.name} />
                                        <div className="text-left">
                                            <Badge variant="outline" className="text-yellow-400 border-yellow-400 mb-2 font-black text-[9px] uppercase tracking-widest">Office Head</Badge>
                                            <h3 className="font-black text-lg md:text-xl leading-tight uppercase mb-1">{officeHead.name}</h3>
                                            <p className="text-yellow-500 font-bold text-[10px] uppercase tracking-widest">{officeHead.position}</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#1a1a1a] p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-t border-white/5">
                                        {officeHead.committee}
                                    </div>
                                </div>
                            </div>
                            <div className="w-1 h-12 bg-slate-200 mt-2"></div>
                        </div>

                        {/* LEVEL 2: SECRETARY */}
                        <div className="flex flex-col items-center">
                            <div className="bg-white p-1.5 rounded-[0.3rem] shadow-xl border border-slate-200">
                                <div className="bg-emerald-700 text-white rounded-[0.3rem] overflow-hidden w-[280px] md:w-[350px] flex items-center gap-4 p-4">
                                    <img src={secretary.image} className="w-16 h-16 rounded-[0.3rem] object-cover border border-white/20" alt={secretary.name} />
                                    <div className="text-left">
                                        <h3 className="font-black text-sm md:text-base leading-tight uppercase">{secretary.name}</h3>
                                        <p className="text-emerald-200 font-bold text-[9px] uppercase tracking-widest mt-1">{secretary.position}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1 h-12 bg-slate-200"></div>
                        </div>

                        {/* LEVEL 3: STAFF GRID */}
                        <div className="max-w-6xl mx-auto">
                            <div className="relative">
                                {/* The horizontal connector line */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-1 bg-slate-200 hidden lg:block"></div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 lg:pt-12 px-4">
                                    {mainOfficers.map((officer, i) => (
                                        <div key={i} className="flex flex-col items-center group">
                                            {/* Vertical line from horizontal connector */}
                                            <div className="w-1 h-8 bg-slate-200 -mt-8 mb-0 hidden lg:block"></div>
                                            
                                            <div className="bg-white w-full rounded-[0.3rem] shadow-md border border-slate-200 p-4 flex items-center gap-4 group-hover:border-emerald-500 group-hover:-translate-y-1 transition-all">
                                                <div className="relative">
                                                    <img src={officer.image} className="w-14 h-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={officer.name} />
                                                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-md shadow-sm">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-tight leading-tight">{officer.name}</h4>
                                                    <p className="text-slate-400 font-black text-[8px] uppercase tracking-widest mt-1 italic">{officer.position}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- ORGANIZATION PRESIDENTS SECTION --- */}
                    <div className="mt-32 space-y-12">
                        <div className="flex flex-col items-center">
                            <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-[0.3rem] shadow-lg border-b-4 border-yellow-500">
                                <Landmark size={20} className="text-yellow-400" />
                                <h2 className="font-black text-[10px] lg:text-xs uppercase tracking-[0.4em]">Organization Presidents</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {orgPresidents.map((org, i) => (
                                <div key={i} className="bg-white p-6 rounded-3xl border rounded-[0.3rem] border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all">
                                        {org.icon}
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                                            {org.icon}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{org.org}</span>
                                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight text-center">{org.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- GOAL & MANDATE SECTION --- */}
                    <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-900 p-12 rounded-[0.3rem] text-white flex items-center justify-between border-b-[12px] border-yellow-500 overflow-hidden relative">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[100px]"></div>
                             <div>
                                <h3 className="text-yellow-400 text-3xl font-black uppercase mb-6 flex items-center gap-3 italic">
                                    <ShieldCheck size={40} /> Mission
                                </h3>
                                <p className="text-slate-300 text-sm font-bold leading-relaxed uppercase tracking-wider">
                                    "The Office of Women and Family is committed to supporting women and families in the barangay by advancing their rights and welfare through community programs, advocacy, coordination of services, and the promotion of gender equality, strong family relationships, and social protection"    
                                </p>
                             </div>
                        </div>

                        <div className="bg-slate-900 p-12 rounded-[0.3rem] text-white flex items-center justify-between border-b-[12px] border-yellow-500 overflow-hidden relative">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[100px]"></div>
                             <div>
                                <h3 className="text-yellow-400 text-3xl font-black uppercase mb-6 flex items-center gap-3 italic">
                                    <ShieldCheck size={40} /> Vission
                                </h3>
                                <p className="text-slate-300 text-sm font-bold leading-relaxed uppercase tracking-wider">
                                    "A just, inclusive, and gender-responsive community where women and families are protected, empowered, and able to participate fully in community development"
                                </p>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-white p-10 rounded-[0.3rem] border border-slate-200 flex flex-col justify-between shadow-sm hover:border-emerald-500 transition-all">
                                <Scale className="text-emerald-600 mb-6" size={40} />
                                <div>
                                    <h4 className="font-black text-[10px] text-emerald-600 tracking-[0.3em] uppercase mb-2">Legal Compliance</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed">Adhering to RA 9262 and Data Privacy guidelines.</p>
                                </div>
                            </div>
                            <div className="bg-white p-10 rounded-[0.3rem] border border-slate-200 flex flex-col justify-between shadow-sm hover:border-red-500 transition-all">
                                <Award className="text-red-500 mb-6" size={40} />
                                <div>
                                    <h4 className="font-black text-[10px] text-red-500 tracking-[0.3em] uppercase mb-2">Child Protection</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed">Ensuring BCPC standards for every child in Brgy 183.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

// Simple Badge Component for the mockup
const Badge = ({ children, className, variant }: any) => (
    <span className={`px-2 py-1 rounded text-[10px] border ${className}`}>
        {children}
    </span>
);