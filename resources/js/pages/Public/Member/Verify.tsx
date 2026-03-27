import { Head } from '@inertiajs/react';
import { ShieldCheck, XCircle, AlertTriangle, User, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicLayout from '@/layouts/PublicLayout';

interface VerifyProps {
    isValid: boolean;
    message?: string;
    member?: any;
    organization?: any;
}

export default function VerifyCitizen({ isValid, message, member, organization }: VerifyProps) {
    return (
        <PublicLayout bgColor="bg-neutral-100">
            <Head title="Citizen ID Verification" />
            
            <div className="min-h-[70vh] flex items-center justify-center p-4 py-20 font-sans italic">
                <div className="max-w-md w-full animate-in zoom-in-95 duration-500">
                    
                    {/* VERIFIED STATE */}
                    {isValid && member ? (
                        <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-3xl text-center">
                            <div className="bg-emerald-500 p-8 flex flex-col items-center justify-center text-white">
                                <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce">
                                    <ShieldCheck className="w-20 h-20 text-white" />
                                </div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter">Verified Citizen</h1>
                                <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mt-2">Active Official Record</p>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="w-24 h-24 bg-neutral-100 rounded-3xl mx-auto flex items-center justify-center border-4 border-emerald-500 shadow-xl overflow-hidden -mt-20 relative z-10 bg-white">
                                    <User className="w-12 h-12 text-neutral-400" />
                                </div>
                                
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 leading-none">{member.fullname}</h2>
                                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 py-1 px-3 rounded-full inline-block border border-emerald-200">
                                        {organization.name}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-neutral-100 grid grid-cols-2 gap-4 text-left">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Status</p>
                                        <p className="text-sm font-black text-emerald-600 uppercase">ACTIVE</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400">ID Prefix</p>
                                        <p className="text-sm font-black text-neutral-900 font-mono">{member.secure_token.substring(0, 8).toUpperCase()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        /* INVALID / SUSPENDED STATE */
                        <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-3xl text-center relative">
                            <div className={`p-8 flex flex-col items-center justify-center text-white ${member ? 'bg-amber-500' : 'bg-rose-600'}`}>
                                <div className="bg-white/20 p-4 rounded-full mb-4">
                                    {member ? <ShieldAlert className="w-20 h-20 text-white" /> : <XCircle className="w-20 h-20 text-white" />}
                                </div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter">
                                    {member ? 'Record Found' : 'Invalid Record'}
                                </h1>
                                <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mt-2">Security Node Alert</p>
                            </div>
                            <CardContent className="p-8 space-y-6 bg-neutral-50">
                                <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center border-4 shadow-xl overflow-hidden -mt-20 relative z-10 bg-white ${member ? 'border-amber-500' : 'border-rose-600'}`}>
                                    <AlertTriangle className={`w-12 h-12 ${member ? 'text-amber-500' : 'text-rose-600'}`} />
                                </div>
                                
                                <div className="space-y-2">
                                    <h2 className="text-lg font-black uppercase tracking-tight text-neutral-900 leading-tight">
                                        {message}
                                    </h2>
                                    {member && (
                                        <p className="text-sm font-black text-neutral-600 mt-2 uppercase">
                                            Citizen: {member.fullname}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
