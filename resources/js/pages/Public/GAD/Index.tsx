import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, MapPin, Users, Heart } from "lucide-react";

// Programs can be fetched from the API if needed, or we can just focus on the Organization
export default function GadIndex({ organization }: { organization?: any }) {

    // Fallback if no org is passed (shouldn't happen with seeder)
    const orgName = organization?.name || "KALIPI";
    const orgReqs = organization?.requirements || [];

    return (
        <PublicLayout>
            <Head title="Gender and Development - Brgy 183 Villamor" />
            <div className="min-h-screen bg-white">

                {/* HERO SECTION */}
                <section className="bg-slate-900 border-b-8 border-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent z-0"></div>
                    <div className="container mx-auto px-10 py-24 relative z-10">
                        <div className="max-w-4xl border-l-[10px] border-purple-600 pl-8">
                            <h2 className="text-purple-400 font-black uppercase tracking-[0.3em] text-sm mb-4">Republic Act 9710</h2>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase leading-none mb-6 tracking-tighter">
                                Gender and <span className="text-purple-500">Development</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-200 font-bold uppercase tracking-wide mb-8 max-w-2xl italic">
                                "Promoting women's empowerment, gender equality, and inclusive growth for every family."
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    asChild
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-black uppercase px-8 py-6 text-sm rounded-none shadow-lg transition-transform active:scale-95"
                                >
                                    <Link href="/gad/register">
                                        Join {orgName} <Heart className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 font-black uppercase px-8 py-6 text-sm rounded-none tracking-widest">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* INFO SECTION */}
                <section className="py-24 bg-slate-50 border-b border-slate-200">
                    <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-16">

                        {/* KALIPI Highlight */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-2">
                                <Users className="text-purple-600" /> {orgName} Organization
                            </h3>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-none font-black text-4xl text-purple-200">01</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 uppercase mb-1">Empowerment</h4>
                                        <p className="text-sm text-slate-600">Unified organization of women in the barangay to promote rights and welfare.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-none font-black text-4xl text-purple-200">02</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 uppercase mb-1">Livelihood</h4>
                                        <p className="text-sm text-slate-600">Access to skills training, seminary, and livelihood programs for members.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-none font-black text-4xl text-purple-200">03</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 uppercase mb-1">Community</h4>
                                        <p className="text-sm text-slate-600">Active participation in barangay activities and community building.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 border-l-4 border-purple-600 shadow-sm mt-8">
                                <p className="font-black text-slate-900 uppercase text-xs mb-4">Membership Requirements:</p>
                                <ul className="text-xs space-y-3 font-bold uppercase tracking-tighter text-slate-600 mb-6">
                                    {orgReqs.length > 0 ? (
                                        orgReqs.map((req: string, index: number) => (
                                            <li key={index} className="flex items-center gap-3">
                                                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span> {req}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span> Valid ID & Residency</li>
                                    )}
                                </ul>
                                <Button asChild className="w-full bg-purple-600 hover:bg-purple-800 text-white font-bold uppercase rounded-sm">
                                    <Link href="/gad/register">Apply for Membership</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Solo Parent & Side Panels */}
                        <div className="flex flex-col gap-8">
                            <div className="bg-purple-900 p-10 text-white rounded-sm shadow-xl flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Heart size={120} />
                                </div>
                                <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2 relative z-10">
                                    <Heart className="text-pink-500" /> Solo Parent Services
                                </h3>
                                <p className="text-2xl font-black tracking-tighter mb-4 relative z-10 text-pink-500">RA 8972 Benefits</p>
                                <p className="text-sm font-bold text-purple-200 uppercase tracking-widest relative z-10 mb-6">
                                    ID Application • Leave Benefits • Educational Support
                                </p>
                                <Button variant="secondary" className="w-full font-bold uppercase tracking-widest bg-pink-600 text-white hover:bg-pink-700 border-none">
                                    View Benefits
                                </Button>
                            </div>

                            <div className="bg-slate-900 p-10 text-white rounded-sm shadow-xl relative overflow-hidden">
                                <h3 className="text-xl font-black uppercase mb-4 border-b border-slate-700 pb-4">
                                    Upcoming Programs
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-sm">
                                        <Calendar className="text-purple-500 shrink-0" />
                                        <span>
                                            <strong className="block text-purple-400 uppercase text-xs">Skills Training 2024</strong>
                                            Schedule to be announced.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm">
                                        <MapPin className="text-sky-500 shrink-0" />
                                        <span>
                                            <strong className="block text-sky-400 uppercase text-xs">Medical Mission</strong>
                                            Brgy 183 Covered Court.
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