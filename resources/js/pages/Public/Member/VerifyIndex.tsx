import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PublicLayout from '@/layouts/PublicLayout';
import { useState } from 'react';

export default function VerifyIndex() {
    const [tokenId, setTokenId] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (tokenId.trim()) {
            router.get(`/verify/${tokenId.trim()}`);
        }
    };

    return (
        <PublicLayout bgColor="bg-neutral-100">
            <Head title="Verify Citizen ID" />
            
            <div className="min-h-[70vh] flex items-center justify-center p-4 py-20 font-sans italic">
                <div className="max-w-md w-full animate-in zoom-in-95 duration-500">
                    <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-3xl text-center">
                        <div className="bg-purple-900 p-8 flex flex-col items-center justify-center text-white">
                            <div className="bg-white/10 p-4 rounded-full mb-4">
                                <ShieldCheck className="w-16 h-16 text-purple-300" />
                            </div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter">ID Verification</h1>
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mt-2 text-purple-200">Security Node</p>
                        </div>
                        <CardContent className="p-8">
                            <form onSubmit={handleSearch} className="space-y-6">
                                <div className="space-y-2 text-left">
                                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500">
                                        Enter Citizen ID / Secure Token
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                        <Input 
                                            value={tokenId}
                                            onChange={(e) => setTokenId(e.target.value)}
                                            placeholder="e.g. 123e4567-e89b-12d3..."
                                            className="pl-10 h-14 border-2 border-neutral-200 focus-visible:ring-purple-500 focus-visible:border-purple-500 rounded-xl font-mono text-sm"
                                        />
                                    </div>
                                    <p className="text-[10px] text-neutral-400 font-bold">
                                        You can find this on the citizen's Digital ID Card or by scanning their QR code.
                                    </p>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={!tokenId.trim()}
                                    className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-200 font-black uppercase tracking-widest text-xs transition-all"
                                >
                                    Verify Citizen
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}
