import PublicLayout from '@/layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, FileText, Phone, Gavel, Lock, ArrowRight, BookOpen, AlertCircle, HeartHandshake, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { route } from 'ziggy-js';

export default function VawcIndex() {

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <PublicLayout>
            <Head title="VAWC Support - Brgy 183 Villamor" />
            {/* FIXED BACKGROUND LOGO */}
            <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-0">
                <img
                    src="/Logo/barangay183LOGO.png"
                    alt="Barangay 183 Logo"
                    className="w-[500px] opacity-10 dark:opacity-5"
                />
            </div>

            <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans text-slate-800 dark:text-slate-200 transition-colors">

                {/* HERO SECTION - Streamlined for Direct Access */}
                <section className="bg-slate-900 border-b-4 border-rose-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-900/30 to-slate-900 z-0"></div>
                    <div className="container mx-auto px-6 py-12 md:py-16 relative z-10 text-center lg:text-left">
                        <div className="max-w-5xl mx-auto lg:mx-0">
                            <h2 className="text-rose-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3">Violence Against Women & Children</h2>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-[1.1] mb-4 tracking-tight">
                                Protection & <span className="text-rose-500">Support</span> Services
                            </h1>
                            <p className="text-base md:text-xl text-slate-300 font-medium max-w-2xl mb-6 leading-relaxed hidden md:block">
                                Laban para sa karapatan at kaligtasan ng bawat kababaihan at kabataan sa Barangay 183 Villamor.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <Button
                                    className="bg-rose-600 hover:bg-rose-700 text-white font-black uppercase px-8 py-6 text-xs tracking-widest rounded-md shadow-xl transition-all active:scale-95 cursor-pointer h-14"
                                    onClick={() => scrollToSection('filing-process')}
                                >
                                    How to File a Case <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-6 py-16 space-y-20">

                    {/* --- KEY SERVICES GRID --- */}
                    <section>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="bg-white dark:bg-neutral-900 border-t-4 border-t-rose-500 shadow-sm hover:shadow-md transition-shadow dark:border-neutral-800">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-4">
                                        <ShieldCheck className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <CardTitle className="uppercase font-black text-lg text-slate-900 dark:text-white">Protection Orders</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                                        Immediate issuance of Barangay Protection Orders (BPO) to prevent further acts of violence against victims.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-neutral-900 border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow dark:border-neutral-800">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                                        <Gavel className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="uppercase font-black text-lg text-slate-900 dark:text-white">Legal Assistance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                                        Free legal counseling and assistance in filing cases, partnered with local authorities and NGOs.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-neutral-900 border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow dark:border-neutral-800">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                                        <HeartHandshake className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <CardTitle className="uppercase font-black text-lg text-slate-900 dark:text-white">Counseling & Rescue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                                        24/7 rescue operations and psychosocial counseling support for women and children in distress.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* --- FILING PROCESS --- */}
                    <section id="filing-process" className="bg-slate-50 dark:bg-neutral-900 rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-neutral-800">
                        <div className="flex items-center gap-3 mb-10">
                            <FileText className="text-rose-600 w-8 h-8" />
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">How to File a Case</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { step: "01", title: "Incident Report", desc: "Visit the Barangay Hall or use our online form to report the incident. Secure a police blotter if possible." },
                                { step: "02", title: "Assessment", desc: "The VAWC Desk Officer will interview you and assess the situation for immediate needs (medical/safety)." },
                                { step: "03", title: "BPO Issuance", desc: "If applicable, a Barangay Protection Order will be issued within 24 hours to ensure your safety." },
                                { step: "04", title: "Legal Action", desc: "We will assist you in filing appropriate cases in court if you choose to pursue legal action." }
                            ].map((item, index) => (
                                <div key={index} className="relative pl-8 md:pl-0 pt-0 md:pt-12 group">
                                    <div className="hidden md:block absolute top-0 left-0 w-full h-1 bg-slate-200 dark:bg-neutral-700 group-hover:bg-rose-400 transition-colors"></div>
                                    <div className="absolute md:top-[-6px] left-[-5px] md:left-0 w-3 h-3 bg-rose-600 rounded-full"></div>
                                    <div className="md:hidden absolute left-0 top-0 h-full w-1 bg-slate-200 dark:bg-neutral-700 group-hover:bg-rose-400 transition-colors"></div>

                                    <h3 className="text-4xl font-black text-slate-300 dark:text-neutral-700 mb-2">{item.step}</h3>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-2">{item.title}</h4>
                                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* --- REQUIREMENTS & LAWS --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* REQUIREMENTS */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <AlertCircle className="text-rose-600 w-6 h-6" />
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Requirements for BPO</h2>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Personal Appearance of the victim-survivor (or guardian for minors)",
                                    "Valid Government ID of the complainant",
                                    "Barangay Blotter or Incident Report",
                                    "Medical Certificate (Medico-Legal) if with physical injuries",
                                    "Photos/Videos as evidence (optional but recommended)"
                                ].map((req, i) => (
                                    <li key={i} className="flex items-start gap-4 p-4 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-lg shadow-sm hover:border-rose-200 dark:hover:border-rose-900 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-rose-700 dark:text-rose-400 font-bold text-sm">{i + 1}</span>
                                        </div>
                                        <span className="text-slate-800 dark:text-slate-200 font-bold text-base">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* KNOW YOUR RIGHTS (ACCORDION) */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <BookOpen className="text-blue-600 w-6 h-6" />
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Know Your Rights (RA 9262)</h2>
                            </div>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1" className="border-b-slate-200 dark:border-b-neutral-800">
                                    <AccordionTrigger className="uppercase font-bold text-sm hover:text-rose-600 text-slate-900 dark:text-slate-200">What acts are considered violence?</AccordionTrigger>
                                    <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Use of physical force, sexual acts without consent, psychological violence (threats, harassment), and economic abuse (withdrawal of financial support).
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2" className="border-b-slate-200 dark:border-b-neutral-800">
                                    <AccordionTrigger className="uppercase font-bold text-sm hover:text-rose-600 text-slate-900 dark:text-slate-200">Who is protected under the law?</AccordionTrigger>
                                    <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Women and their children, including wives, former wives, women with whom the offender has or had a sexual or dating relationship, and their children (legitimate or illegitimate).
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3" className="border-b-slate-200 dark:border-b-neutral-800">
                                    <AccordionTrigger className="uppercase font-bold text-sm hover:text-rose-600 text-slate-900 dark:text-slate-200">What is a Protection Order?</AccordionTrigger>
                                    <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        An order issued by the Barangay (BPO) or Court (TPO/PPO) to prevent the offender from committing further acts of violence against the woman or her child.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4" className="border-b-slate-200 dark:border-b-neutral-800">
                                    <AccordionTrigger className="uppercase font-bold text-sm hover:text-rose-600 text-slate-900 dark:text-slate-200">Is VAWC a criminal offense?</AccordionTrigger>
                                    <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Yes. Violation of RA 9262 is a criminal offense. Perpetrators can face imprisonment and fines depending on the severity of the act.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </section>

                    </div>

                </div>

                {/* --- CALL TO ACTION --- */}
                <section className="bg-white dark:bg-neutral-900 text-white py-16">
                    <div className="container mx-auto px-6 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center animate-pulse">
                                <Phone className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-slate-900 dark:text-slate-200 text-3xl font-black uppercase mb-4">Emergency Hotline</h2>
                        <p className="text-rose-400 font-bold text-5xl tracking-tighter mb-4">(02) 8111-VAWC</p>
                        <p className="text-slate-900 dark:text-slate-200 uppercase tracking-widest text-sm mb-8">Barangay 183 Villamor VAWC Desk • 24/7 Active</p>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
}