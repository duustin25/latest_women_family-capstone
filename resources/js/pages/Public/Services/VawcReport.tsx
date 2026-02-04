import { Head, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from 'react';
import { ArrowRight, AlertTriangle, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { route } from 'ziggy-js';

// Assuming Guest or Public Layout exists, or use a simple wrapper
// If GuestLayout doesn't exist, I'll assume a standard wrapper or just div. 
// I'll check if I can import a PublicLayout.
// From previous files, I haven't seen PublicLayout. I'll use a clean div structure with a Navbar placeholder if needed,
// but usually GuestLayout or just a standalone page styling.
// I'll stick to a standalone page container max-w-2xl.

export default function VawcReport() {
    const { data, setData, post, processing, errors, reset } = useForm({
        victim_name: '',
        victim_age: '',
        victim_contact: '',
        abuse_type: '',
        incident_date: '',
        incident_location: '',
        description: '',
        is_anonymous: false,
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vawc.report.store'), {
            onSuccess: () => {
                reset();
                setIsSubmitted(true);
            }
        });
    };

    const quickExit = () => {
        window.location.replace("https://www.google.com");
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8 shadow-lg border-t-4 border-t-emerald-500">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black uppercase text-slate-800 mb-2">Report Submitted</h2>
                    <p className="text-slate-600 mb-6">
                        Your report has been securely transmitted to the Barangay 183 VAWC Desk.
                        We will review it immediately.
                    </p>
                    <Button onClick={() => window.location.href = '/'} variant="outline">
                        Return to Home
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative pb-12">
            <Head title="File VAWC Report" />

            {/* QUICK EXIT BUTTON (Floating) */}
            <div className="fixed top-4 right-4 z-50">
                <Button
                    onClick={quickExit}
                    className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest shadow-xl border-2 border-white ring-2 ring-red-600"
                >
                    <LogOut className="w-4 h-4 mr-2" /> Quick Exit
                </Button>
            </div>

            <div className="max-w-3xl mx-auto pt-12 px-4">

                {/* Header / Branding */}
                <div className="text-center mb-8">
                    <ShieldCheck className="w-12 h-12 text-[#ce1126] mx-auto mb-3" />
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
                        VAWC Incident Reporting
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
                        Barangay 183 Villamor
                    </p>
                </div>

                {/* Privacy Warning */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 flex gap-4 items-start">
                    <AlertTriangle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-bold mb-1 uppercase">Confidentiality Notice & Data Privacy Act of 2012</p>
                        <p>
                            This form is strictly confidential. All information submitted here is protected under the
                            Data Privacy Act of 2012 and RA 9262. Your identity and the details of your report
                            will only be accessible to authorized VAWC officers for the purpose of assistance and intervention.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-100/50 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">
                                Incident Report Form
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-6">

                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase text-slate-800 border-b pb-2">1. Your Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name (Optional if anonymous)</Label>
                                        <Input
                                            value={data.victim_name}
                                            onChange={e => setData('victim_name', e.target.value)}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Age</Label>
                                        <Input
                                            value={data.victim_age}
                                            onChange={e => setData('victim_age', e.target.value)}
                                            type="number"
                                            placeholder="Your age"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="anonymous"
                                        className="rounded border-slate-300 text-red-600 focus:ring-red-600"
                                        checked={data.is_anonymous}
                                        onChange={e => setData('is_anonymous', e.target.checked)}
                                    />
                                    <Label htmlFor="anonymous" className="text-xs font-bold uppercase text-slate-500 cursor-pointer">
                                        I prefer to report this anonymously
                                    </Label>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-black uppercase text-slate-800 border-b pb-2">2. Incident Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Type of Abuse</Label>
                                        <Select value={data.abuse_type} onValueChange={v => setData('abuse_type', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Physical">Physical Abuse</SelectItem>
                                                <SelectItem value="Sexual">Sexual Abuse</SelectItem>
                                                <SelectItem value="Psychological">Psychological Abuse</SelectItem>
                                                <SelectItem value="Economic">Economic Abuse</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.abuse_type && <span className="text-red-500 text-xs">{errors.abuse_type}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date of Incident</Label>
                                        <Input
                                            type="date"
                                            value={data.incident_date}
                                            onChange={e => setData('incident_date', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input
                                        value={data.incident_location}
                                        onChange={e => setData('incident_location', e.target.value)}
                                        placeholder="Where did it happen?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description of Incident</Label>
                                    <Textarea
                                        className="h-32"
                                        placeholder="Please describe what happened..."
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        required
                                    />
                                    {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8 flex justify-end gap-3 pb-8">
                        <Button type="button" variant="ghost" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#ce1126] hover:bg-red-700 text-white font-black uppercase tracking-widest px-8 shadow-lg shadow-red-200"
                            disabled={processing}
                        >
                            Submit Report <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
