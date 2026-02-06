import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import {
    ShieldCheck, Star, Users,
    ShieldAlert, Award,
    Scale, UserCheck, Landmark, Heart,
    Gavel, Briefcase, GraduationCap
} from "lucide-react";

export default function Index() {
    const brgyName = import.meta.env.VITE_APP_BARANGAY_NAME || 'Barangay 183 Villamor';

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

    const staffMembers = [
        { name: "LUZVIMINDA GONZALES", position: "AVWAC OFFICER", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&fit=crop" },
        { name: "GEMMA GONZALES", position: "AVWAC OFFICER", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&fit=crop" },
        { name: "MARIA TERESA BRIZUELA", position: "STAFF", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop" },
        { name: "NELIA CRUZ", position: "STAFF", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&h=200&fit=crop" },
        { name: "RAMIL RODRIGUEZ", position: "STAFF", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop" },
        { name: "KAYE AMARILLE", position: "STAFF", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&fit=crop" },
    ];

    const presidents = [
        { org: "KALIPI", name: "ELENA REYES", icon: <UserCheck size={18} /> },
        { org: "SOLO PARENTS", name: "MARIA DELA CRUZ", icon: <Heart size={18} /> },
        { org: "VCO", name: "JUANITO SAMPLE", icon: <ShieldAlert size={18} /> },
        { org: "ERPAT", name: "RAMIL RODRIGUEZ", icon: <Users size={18} /> },
    ];

    return (
        <PublicLayout>
            <Head title="Organization Chart" />

            <div className="bg-slate-50 dark:bg-slate-950 pb-24">
                {/* --- HERO HEADER --- */}
                <div className="bg-[#3b0764] py-20 px-4 text-center text-white border-b-8 border-yellow-500 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10 max-w-5xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 italic">
                            Organizational <span className="text-yellow-400">Structure</span>
                        </h1>
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-yellow-200/80">
                            {brgyName} • Office of Women and Family Protection
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-12 relative z-30">

                    {/* --- LEVEL 1: THE HEAD --- */}
                    <div className="flex flex-col items-center mb-16">
                        <div className="bg-white dark:bg-slate-900 p-1 rounded-sm shadow-2xl border-2 border-yellow-500">
                            <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:pr-12">
                                <img src={officeHead.image} className="w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-slate-100 dark:border-slate-800" alt="" />
                                <div className="text-center md:text-left">
                                    <div className="bg-purple-700 text-white text-[9px] font-black uppercase px-3 py-1 w-fit mb-3 mx-auto md:mx-0 tracking-widest">
                                        Committee Chairman
                                    </div>
                                    <h3 className="font-black text-xl md:text-2xl text-slate-900 dark:text-white uppercase leading-tight mb-2">
                                        {officeHead.name}
                                    </h3>
                                    <p className="text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest italic mb-2">
                                        {officeHead.position}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter max-w-xs">
                                        {officeHead.committee}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-1 h-12 bg-slate-300 dark:bg-slate-800"></div>
                    </div>

                    {/* --- LEVEL 2: SECRETARY --- */}
                    <div className="flex flex-col items-center mb-16">
                        <div className="bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 shadow-xl">
                            <div className="bg-emerald-700 text-white flex items-center gap-4 px-6 py-4 w-[300px] md:w-[400px]">
                                <img src={secretary.image} className="w-16 h-16 object-cover border-2 border-white/20" alt="" />
                                <div>
                                    <h3 className="font-black text-sm uppercase leading-tight">{secretary.name}</h3>
                                    <p className="text-emerald-200 font-bold text-[9px] uppercase tracking-widest mt-1">
                                        {secretary.position}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-1 h-12 bg-slate-300 dark:bg-slate-800"></div>
                    </div>

                    {/* --- LEVEL 3: STAFF GRID --- */}
                    <div className="max-w-6xl mx-auto mb-32">
                        <div className="relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-slate-200 dark:bg-slate-800 hidden lg:block"></div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                                {staffMembers.map((officer, i) => (
                                    <div key={i} className="flex flex-col items-center relative">
                                        <div className="w-1 h-10 bg-slate-200 dark:bg-slate-800 absolute -top-10 hidden lg:block"></div>
                                        <div className="bg-white dark:bg-slate-900 w-full p-4 flex items-center gap-4 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all shadow-sm">
                                            <img src={officer.image} className="w-14 h-14 object-cover grayscale hover:grayscale-0 transition-all" alt="" />
                                            <div>
                                                <h4 className="font-black text-slate-900 dark:text-white text-[11px] uppercase tracking-tight">{officer.name}</h4>
                                                <p className="text-slate-400 font-black text-[8px] uppercase tracking-widest mt-1 italic">{officer.position}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- MANDATED ORGANIZATIONS --- */}
                    <div className="mt-40">
                        <div className="flex flex-col items-center mb-12">
                            <div className="bg-slate-900 dark:bg-purple-900 text-white px-10 py-4 border-b-4 border-yellow-500 flex items-center gap-4">
                                <Landmark className="text-yellow-400" />
                                <h2 className="font-black text-xs uppercase tracking-[0.3em]">Accredited Organization Presidents</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {presidents.map((org, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors">
                                        {org.icon}
                                    </div>
                                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1 block">{org.org}</span>
                                    <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-tight">{org.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- MISSION & VISION --- */}
                    <div className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white dark:bg-slate-900 p-10 border-l-[10px] border-purple-700 shadow-sm">
                            <h3 className="text-purple-700 dark:text-purple-400 text-2xl font-black uppercase mb-4 flex items-center gap-3">
                                <ShieldCheck size={28} /> Mission
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase leading-relaxed tracking-wider">
                                To provide a secure, confidential, and accessible online platform for residents of Barangay 183 Villamor to report, document, and monitor VAWC and child protection cases.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-10 border-l-[10px] border-yellow-500 shadow-sm">
                            <h3 className="text-yellow-600 dark:text-yellow-400 text-2xl font-black uppercase mb-4 flex items-center gap-3">
                                <Award size={28} /> Vision
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase leading-relaxed tracking-wider">
                                A just, inclusive, and gender-responsive community where women and families are protected, empowered, and able to participate fully in community development.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}