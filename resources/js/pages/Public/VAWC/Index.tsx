import { Head, Link } from '@inertiajs/react';
import { 
    ShieldCheck, 
    FileText, 
    Phone, 
    AlertCircle, 
    Clock, 
    Info, 
    ArrowRight,
    Gavel,
    Lock,
    HelpCircle
} from "lucide-react";
// import { Marquee } from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";

export default function VawcIndex({ hotlines }: any) {

    const navLinks = [
        { name: 'Announcements', href: '/announcements' },
        { name: 'VAWC', href: '/vawc' },
        { name: 'Child Protection', href: '/cpp' },
        { name: 'GAD', href: '/gad' },
        { name: 'Organizations', href: '/organizations' },
        { name: 'ABOUT US', href: '/about' },
        { name: 'CONTACT', href: '/contact' },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Head title="VAWC Support - Brgy 183 Villamor" />

            {/* --- REUSED HEADER FROM WELCOME --- */}
            <header className="bg-[#0038a8] text-white">
                <div className="container mx-auto px-6 py-6 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img src="/Logo/Woman-FamilyLOGO.png" alt="Logo" className="w-16 h-16 object-contain" />
                        <div>
                            <h1 className="text-xl font-black uppercase leading-none">Women & Family Protection</h1>
                            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">Barangay 183 Villamor</p>
                        </div>
                    </div>
                    <Link href="/login" className="bg-[#ce1126] hover:bg-red-700 px-6 py-2 font-black uppercase text-xs tracking-widest">
                        Portal Login
                    </Link>
                </div>
                <nav className="bg-[#002a7a] border-t border-white/10 hidden md:block">
                    <div className="container mx-auto px-6 flex">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#0038a8] border-r border-white/5">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </nav>
            </header>

            <main>
                {/* --- HERO SECTION --- */}
                <section className="bg-slate-900 py-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-3xl border-l-8 border-[#ce1126] pl-8">
                            <h2 className="text-[#ce1126] font-black uppercase tracking-[0.3em] text-sm mb-4">RA 9262 Support</h2>
                            <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-tight tracking-tighter mb-6">
                                You are not <span className="text-yellow-500">Alone.</span>
                            </h1>
                            <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                                Barangay 183 Villamor provides a secure, confidential, and digital way to report violence and seek protection. 
                                Your safety is our priority.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button className="bg-[#ce1126] hover:bg-red-700 text-white font-black uppercase px-8 py-6 text-sm rounded-none">
                                    File an Online Report <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 font-black uppercase px-8 py-6 text-sm rounded-none">
                                    View My Case Status
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- HOTLINE MARQUEE ---
                <section className="bg-[#ce1126] border-y border-red-900">
                    <Marquee className="py-3 [--duration:20s]">
                        <div className="flex gap-12 text-white font-black uppercase text-xs">
                            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-yellow-400"/> VAWC DESK: {hotlines.vawc_desk}</span>
                            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-yellow-400"/> PNP WOMEN'S DESK: {hotlines.pnp_women}</span>
                            <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-yellow-400"/> EMERGENCY: {hotlines.emergency}</span>
                        </div>
                    </Marquee>
                </section> */}

                {/* --- STEP BY STEP GUIDE --- */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-[#0038a8] font-bold tracking-widest uppercase text-sm mb-2">Process Overview</h2>
                            <h1 className="text-4xl font-black text-slate-900 uppercase">How to File a Protection Case</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { 
                                    step: "01", 
                                    title: "Secure Reporting", 
                                    desc: "Fill out the online form with details of the incident. This data is encrypted and only visible to the VAWC Desk Officer.",
                                    icon: <FileText className="w-8 h-8 text-blue-600" />
                                },
                                { 
                                    step: "02", 
                                    title: "Review & Routing", 
                                    desc: "The committee reviews the report and routes it to the correct department (VAWC or Child Protection) for immediate action.",
                                    icon: <Gavel className="w-8 h-8 text-blue-600" />
                                },
                                { 
                                    step: "03", 
                                    title: "Case Monitoring", 
                                    desc: "Use your reference number to track the status of your case (Submitted, Under Review, or Resolved) 24/7.",
                                    icon: <Clock className="w-8 h-8 text-blue-600" />
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-white border-b-4 border-blue-600 p-8 shadow-sm hover:shadow-xl transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-blue-50 rounded-lg">{item.icon}</div>
                                        <span className="text-4xl font-black text-slate-100 italic">{item.step}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 uppercase">{item.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- CONFIDENTIALITY BANNER --- */}
                <section className="bg-blue-900 py-16">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="shrink-0 p-4 bg-blue-800 rounded-full">
                                <Lock className="w-10 h-10 text-yellow-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Data Privacy Guarantee</h2>
                                <p className="text-blue-200 max-w-md">Your information is handled in strict compliance with the Data Privacy Act of 2012. Records are only accessible to authorized personnel.</p>
                            </div>
                        </div>
                        <Button className="bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black uppercase px-10 py-6 rounded-none">
                            Read Privacy Policy
                        </Button>
                    </div>
                </section>
            </main>

           {/* 8. OFFICIAL FOOTER */}
            <footer className="bg-slate-900 text-white pt-20 pb-10 border-t-8 border-yellow-500">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
                    <div>
                        <h4 className="font-black uppercase tracking-widest mb-6 text-yellow-500 underline underline-offset-8 decoration-2">Information System</h4>
                        <p className="text-slate-400 font-bold leading-relaxed uppercase text-[11px] italic">
                            Official management platform for Barangay 183 Villamor. Ensuring data privacy and accountability in family protection services.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest mb-6 text-yellow-500 underline underline-offset-8 decoration-2">Hotlines</h4>
                        <div className="space-y-4 text-xs font-bold uppercase tracking-wider text-slate-300">
                            <p className="flex items-center gap-3"><Phone size={14}/> Brgy Hall: (02) 8XXX-XXXX</p>
                            <p className="flex items-center gap-3"><AlertCircle size={14}/> VAWC Desk: (02) 8XXX-XXXX</p>
                            <p className="flex items-center gap-3"><Info size={14}/> GAD Focal: gad.brgy183@pasay.gov.ph</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest mb-6 text-yellow-500 underline underline-offset-8 decoration-2">Transparency</h4>
                        <ul className="text-xs font-bold uppercase tracking-wider text-slate-300 space-y-3">
                            <li className="hover:text-yellow-500 cursor-pointer transition-none"><Link href="/privacy">Data Privacy Compliance</Link></li>
                            <li className="hover:text-yellow-500 cursor-pointer transition-none"><Link href="/audit">System Audit Logs</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 border-t border-white/10 pt-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                        © 2026 Barangay 183 Villamor, Pasay City | Women & Family Support System
                    </p>
                </div>
            </footer>
        </div>
    );
}