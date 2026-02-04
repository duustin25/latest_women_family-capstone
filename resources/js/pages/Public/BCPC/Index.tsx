import PublicLayout from '@/layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { ShieldAlert, Baby, Scale, PhoneCall, AlertCircle, Clock, Phone, Info, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { route } from 'ziggy-js';

export default function BcpcIndex() {
    return (
        <PublicLayout>
            <Head title="BCPC - Brgy 183 Villamor" />
            <div className="min-h-screen bg-white">
                <section className="bg-slate-900 border-b-8 border-sky-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-900/40 to-transparent z-0"></div>
                    <div className="container mx-auto px-10 py-24 relative z-10">
                        <div className="max-w-4xl border-l-[10px] border-sky-500 pl-8">
                            <h2 className="text-sky-400 font-black uppercase tracking-[0.3em] text-sm mb-4">Republic Act 9344</h2>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase leading-none mb-6 tracking-tighter">
                                Safeguarding the <span className="text-yellow-500">Children</span> of Barangay 183
                            </h1>
                            <p className="text-lg md:text-xl text-slate-200 font-bold uppercase tracking-wide mb-8 max-w-2xl italic">
                                "Bawat bata ay may karapatang lumaki sa isang ligtas na kapaligiran."
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => window.location.href = route('bcpc.report')}
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-black uppercase px-8 py-6 text-sm rounded-none shadow-lg transition-transform active:scale-95"
                                >
                                    Report Child Concern
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-10">
                        <div className="mb-12 text-center max-w-2xl mx-auto">
                            <h3 className="text-3xl font-black text-slate-900 uppercase">Recognizing Signs of Abuse</h3>
                            <div className="h-1 w-20 bg-sky-500 mx-auto my-4"></div>
                            <p className="text-slate-600">Protecting children starts with awareness. If you see these signs, please report immediately.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Physical Abuse", desc: "Unexplained bruises, burns, or injuries. Fear of returning home.", icon: <ShieldAlert className="w-8 h-8 text-sky-600 mb-4" /> },
                                { title: "Neglect", desc: "Consistently dirty, hungry, or lacking medical care. Poor attendance.", icon: <Baby className="w-8 h-8 text-sky-600 mb-4" /> },
                                { title: "Behavioral Changes", desc: "Sudden aggression, withdrawal, or regression in behavior.", icon: <AlertCircle className="w-8 h-8 text-sky-600 mb-4" /> }
                            ].map((item, i) => (
                                <div key={i} className="bg-white border-t-4 border-sky-600 p-8 shadow-md hover:shadow-xl transition-shadow group">
                                    <div className="group-hover:scale-110 transition-transform duration-300 origin-left">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-black text-slate-900 uppercase mb-2 tracking-wide">{item.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* INFO SECTION */}
                <section className="py-24 bg-slate-50 border-b border-slate-200">
                    <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-2">
                                <Gavel className="text-[#ce1126]" /> Legal Knowledge Base
                            </h3>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p className="font-bold text-slate-900 uppercase text-xs tracking-wider">What is RA 9262?</p>
                                <p>It is the law protecting women and their children from physical, sexual, psychological, and economic abuse. It recognizes that violence against women is a public crime.</p>
                                <div className="bg-white p-6 border-l-4 border-[#ce1126] shadow-sm">
                                    <p className="font-black text-slate-900 uppercase text-xs mb-2">Filing Requirements:</p>
                                    <ul className="text-xs space-y-2 font-bold uppercase tracking-tighter">
                                        <li className="flex items-center gap-2 text-red-600"><AlertCircle size={14} /> Barangay Protection Order (BPO) Request</li>
                                        <li className="flex items-center gap-2"><Info size={14} /> Valid Identification of the Victim</li>
                                        <li className="flex items-center gap-2"><Info size={14} /> Incident Narrative / Evidence</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#0038a8] p-10 text-white rounded-sm shadow-xl flex flex-col justify-center">
                            <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                                <Phone className="text-yellow-500" /> Desk Hotline
                            </h3>
                            <p className="text-4xl font-black tracking-tighter mb-4">(02) 8XXX-XXXX</p>
                            <p className="text-sm font-medium text-blue-200 uppercase tracking-widest">Barangay 183 VAWC Desk Officer is available 24/7 for emergency assistance.</p>
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
}