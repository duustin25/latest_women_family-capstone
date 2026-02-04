import PublicLayout from '@/layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { ShieldCheck, FileText, Phone, AlertCircle, Gavel, Lock, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { route } from 'ziggy-js';

export default function VawcIndex() {
    return (
        <PublicLayout>
            <Head title="VAWC Support - Brgy 183 Villamor" />
            <div className="min-h-screen bg-white">
                {/* HERO: Synced with Welcome Carousel */}
                <section className="bg-slate-900 border-b-8 border-[#ce1126] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent z-0"></div>
                    <div className="container mx-auto px-10 py-24 relative z-10">
                        <div className="max-w-4xl border-l-[10px] border-[#ce1126] pl-8">
                            <h2 className="text-[#ce1126] font-black uppercase tracking-[0.3em] text-sm mb-4">Republic Act 9262</h2>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase leading-none mb-6 tracking-tighter">
                                Anti-Violence Against <span className="text-yellow-500">Women</span> and <span className="text-yellow-500">Children</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-200 font-bold uppercase tracking-wide mb-8 max-w-2xl italic">
                                "Laban para sa karapatan at kaligtasan ng bawat kababaihan at kabataan."
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    onClick={() => window.location.href = route('vawc.report')}
                                    className="bg-[#ce1126] hover:bg-red-700 text-white font-black uppercase px-8 py-6 text-sm rounded-none shadow-lg transition-transform active:scale-95"
                                >
                                    File Secure Report <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 font-black uppercase px-8 py-6 text-sm rounded-none tracking-widest">
                                    Case Tracker
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* INFO SECTION */}
                <section className="py-24 bg-slate-50 border-b border-slate-200">
                    <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <h3 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-2">
                                <Gavel className="text-[#ce1126]" /> Legal Knowledge Base
                            </h3>

                            {/* Step by Step Guide */}
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-none font-black text-4xl text-slate-200">01</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 uppercase mb-1">Incident Documentation</h4>
                                        <p className="text-sm text-slate-600">Secure medical check-up (medico-legal) and police blotter immediately after the incident. Take photos of injuries if any.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-none font-black text-4xl text-slate-200">02</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 uppercase mb-1">File a Report</h4>
                                        <p className="text-sm text-slate-600">Visit the Barangay VAWC Desk or use our <span className="text-[#ce1126] font-bold">Secure Online Reporting</span> form above to initiate the process.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-none font-black text-4xl text-slate-200">03</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 uppercase mb-1">Protection Order</h4>
                                        <p className="text-sm text-slate-600">Request for a Barangay Protection Order (BPO) to prevent the offender from approaching you.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 border-l-4 border-[#ce1126] shadow-sm mt-8">
                                <p className="font-black text-slate-900 uppercase text-xs mb-4">Required Documents for BPO:</p>
                                <ul className="text-xs space-y-3 font-bold uppercase tracking-tighter text-slate-600">
                                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#ce1126] rounded-full"></span> Valid Government ID</li>
                                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#ce1126] rounded-full"></span> Barangay Blotter Copy</li>
                                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#ce1126] rounded-full"></span> Medical Certificate (if applicable)</li>
                                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#ce1126] rounded-full"></span> Narrative Affidavit</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="bg-[#0038a8] p-10 text-white rounded-sm shadow-xl flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Phone size={120} />
                                </div>
                                <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2 relative z-10">
                                    <Phone className="text-yellow-500" /> Emergency Hotline
                                </h3>
                                <p className="text-5xl font-black tracking-tighter mb-4 relative z-10 text-yellow-500">(02) 8111-VAWC</p>
                                <p className="text-sm font-bold text-blue-200 uppercase tracking-widest relative z-10">Barangay 183 VAWC Desk • 24/7 Active</p>
                            </div>

                            <div className="bg-slate-900 p-10 text-white rounded-sm shadow-xl relative overflow-hidden">
                                <h3 className="text-xl font-black uppercase mb-4 border-b border-slate-700 pb-4">
                                    Support Services
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-sm">
                                        <ShieldCheck className="text-green-500 shrink-0" />
                                        <span>
                                            <strong className="block text-green-400 uppercase text-xs">Legal Counseling</strong>
                                            Free legal aid for victims filling cases.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm">
                                        <Lock className="text-sky-500 shrink-0" />
                                        <span>
                                            <strong className="block text-sky-400 uppercase text-xs">Safe Shelter</strong>
                                            Temporary refuge for victims in immediate danger.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}