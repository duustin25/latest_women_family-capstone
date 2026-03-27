import { Head, router } from '@inertiajs/react';
import { User, Mail, Calendar, CreditCard, Bell, MapPin, CheckCircle, Info, QrCode, ShieldCheck, HandHeart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { route } from 'ziggy-js';

interface PortalProps {
    member: any;
    organization: any;
    communications: any[];
    dispatches: any[];
    secure_token: string;
}

export default function MemberPortal({ member, organization, communications, dispatches, secure_token }: PortalProps) {

    const handleClaim = (dispatch_id: number) => {
        if (!confirm('Are you sure you want to acknowledge receipt of this benefit?')) return;

        router.post(route('public.member.claim', { token: secure_token, dispatch: dispatch_id }), {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 md:p-10 transition-colors font-sans italic">
            <Head title={`Citizen Portal - ${member.fullname}`} />

            <div className="max-w-6xl mx-auto space-y-10">
                {/* ... existing header code ... */}

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-neutral-900 dark:bg-neutral-800 rounded-3xl flex items-center justify-center text-white shadow-2xl border-4 border-white dark:border-neutral-700">
                            <User className="w-10 h-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 italic">Verified Citizen Portal</span>
                            </div>
                            <h1 className="text-4xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic leading-none">
                                {member.fullname}
                            </h1>
                            <div className="flex items-center gap-3 mt-3">
                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-3 py-1 italic">
                                    {organization.name}
                                </Badge>
                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest border-l pl-3 border-neutral-300 dark:border-neutral-800">
                                    MEMBER ID: {member.secure_token.substring(0, 8).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* --- LEFT COLUMN: IDENTITY & INFO --- */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* DIGITAL ID CARD - HIGH FIDELITY */}
                        <Card className="overflow-hidden border-none shadow-2xl bg-neutral-900 dark:bg-neutral-800 text-white relative group min-h-[240px] rounded-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                                <img
                                    src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(window.location.href)}&choe=UTF-8`}
                                    alt="QR Code Background"
                                    className="w-48 h-48 invert"
                                />
                            </div>

                            <CardHeader className="relative z-10 p-8 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-neutral-400">Official Membership ID</p>
                                        <CardTitle className="text-xl font-black tracking-tight uppercase italic underline decoration-blue-500 decoration-4 underline-offset-8">
                                            {organization.name}
                                        </CardTitle>
                                    </div>
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="relative z-10 p-8 pt-4 pb-10 space-y-8">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500">Citizen Delegate</p>
                                    <p className="text-3xl font-black tracking-tighter uppercase leading-none italic">{member.fullname}</p>
                                </div>

                                <div className="flex justify-between items-end gap-4">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic">SECURE ACTIVE</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 font-mono text-[10px] tracking-widest text-blue-300 italic">
                                            {member.secure_token.substring(0, 14)}...
                                        </div>
                                    </div>
                                    <div className="p-2 bg-white rounded-2xl shadow-xl hover:scale-110 transition-transform cursor-pointer">
                                        <img
                                            src={`https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${encodeURIComponent(window.location.href)}&choe=UTF-8`}
                                            alt="QR Code"
                                            className="w-16 h-16"
                                        />
                                    </div>
                                </div>
                            </CardContent>

                            {/* Decorative bar */}
                            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />
                        </Card>

                        {/* BASIC INFO CARD */}
                        <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-3xl bg-white dark:bg-neutral-900">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic text-neutral-400">
                                    <Info className="w-4 h-4 text-neutral-900 dark:text-white" /> General Registry
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 p-6 pt-2">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Member Since</span>
                                    <span className="text-xs font-black text-neutral-900 dark:text-white uppercase italic">{new Date(member.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Residential Address</span>
                                    <span className="text-xs font-black text-neutral-900 dark:text-white uppercase italic leading-tight">{member.address || 'VERIFIED RESIDENT'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Encrypted Contact</span>
                                    <span className="text-xs font-black text-neutral-900 dark:text-white uppercase italic">{member.phone || 'PROTECTED'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- RIGHT COLUMN: ACTIVITY & BENEFITS --- */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* NOTIFICATION HUB SECTION */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight flex items-center gap-3 italic">
                                    <Bell className="w-6 h-6 text-neutral-900 dark:text-white" /> Secure Inbox
                                </h3>
                                <Badge className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-none font-black px-3 py-1 text-[9px] uppercase tracking-widest italic">{communications.length} Records</Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {communications.length > 0 ? communications.map((comm) => (
                                    <Card key={comm.id} className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all shadow-sm group rounded-2xl overflow-hidden cursor-default">
                                        <CardContent className="p-6 flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge className="text-[8px] font-black tracking-widest bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 uppercase italic">{comm.type}</Badge>
                                                    <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest italic">
                                                        {new Date(comm.created_at).toLocaleDateString()} &bull; {new Date(comm.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight italic group-hover:text-blue-600 transition-colors">
                                                    {comm.subject}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                                        <Mail className="w-10 h-10 text-neutral-200 mx-auto mb-4 opacity-30" />
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">No messages in your secure inbox.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ENHANCED BENEFITS SECTION */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight flex items-center gap-3 italic">
                                    <HandHeart className="w-6 h-6 text-emerald-600" /> Benefit Records
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {dispatches.length > 0 ? dispatches.map((dispatch) => (
                                    <Card key={dispatch.id} className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg rounded-3xl overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                            <QrCode className="w-20 h-20" />
                                        </div>
                                        <CardHeader className="p-6 pb-2">
                                            <div className="flex justify-between items-center mb-4">
                                                <Badge className={`text-[8px] font-black tracking-widest border-none uppercase italic ${dispatch.status === 'Claimed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {dispatch.status}
                                                </Badge>
                                                <span className="text-[9px] text-neutral-400 font-black uppercase tracking-widest italic">{new Date(dispatch.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <CardTitle className="text-lg font-black uppercase tracking-tighter italic leading-tight text-neutral-900 dark:text-white">{dispatch.benefit_name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-4">
                                            <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 text-center shadow-inner">
                                                <p className="text-[8px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-2 italic">Claim Reference Number</p>
                                                <p className="text-2xl font-black tracking-[0.2em] text-emerald-600 font-mono italic underline decoration-emerald-200">{dispatch.reference_number}</p>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="px-6 pb-6 pt-0 flex flex-col items-stretch gap-4">
                                            <div className="flex items-center gap-2 text-neutral-500">
                                                <Info size={12} strokeWidth={3} className="text-emerald-500" />
                                                <p className="text-[8px] font-black uppercase tracking-widest italic leading-tight">
                                                    {dispatch.status === 'Claimed'
                                                        ? `Claimed on ${new Date(dispatch.claimed_at).toLocaleDateString()}`
                                                        : 'Present this reference to claim your entitlement.'}
                                                </p>
                                            </div>

                                            {dispatch.status !== 'Claimed' && (
                                                <Button
                                                    onClick={() => handleClaim(dispatch.id)}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest h-11 rounded-2xl shadow-lg transition-all"
                                                >
                                                    Acknowledge Receipt
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                )) : (
                                    <div className="col-span-full text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                                        <CreditCard className="w-10 h-10 text-neutral-200 mx-auto mb-4 opacity-30" />
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">No active benefits found in registry.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                    </div>
                </div>

                {/* --- FOOTER --- */}
                <footer className="pt-12 border-t border-neutral-200 dark:border-neutral-800 text-center pb-20">
                    <p className="text-[10px] font-black text-neutral-300 dark:text-neutral-700 uppercase tracking-[0.5em] italic">
                        Secured Infrastructure &copy; 2026 Barangay 183 W.F.P System
                    </p>
                    <div className="mt-4 flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
                        <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                        <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                </footer>
            </div>
        </div>
    );
}
