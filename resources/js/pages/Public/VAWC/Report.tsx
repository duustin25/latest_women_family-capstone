import React, { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';
import { ShieldAlert, Info, Upload, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { route } from 'ziggy-js';

export default function VawcReport() {
    const { data, setData, post, processing, errors, reset } = useForm({
        complainant_name: '',
        complainant_contact: '',
        victim_name: '',
        victim_age: '',
        relation_to_victim: '',
        incident_date: '',
        incident_location: '',
        description: '',
        is_anonymous: false,
        evidence: null as File | null,
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('vawc.report.store'), {
            onSuccess: () => setSubmitted(true),
        });
    };

    if (submitted) {
        return (
            <PublicLayout>
                <Head title="Report Submitted - VAWC" />
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md border-t-4 border-green-600 shadow-xl">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl font-black uppercase text-slate-800">Report Secured</CardTitle>
                            <CardDescription>Your report has been encrypted and sent to the VAWC Desk.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert className="bg-blue-50 border-blue-200">
                                <Info className="h-4 w-4 text-blue-600" />
                                <AlertTitle className="text-blue-800 font-bold text-xs uppercase">What Happens Next?</AlertTitle>
                                <AlertDescription className="text-blue-700 text-xs">
                                    A VAWC Officer will review your case within 24 hours. Keep your lines open for verification.
                                </AlertDescription>
                            </Alert>
                            <Button
                                onClick={() => window.location.href = '/vawc'}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase rounded-sm"
                            >
                                Return to Safety
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="File Secure Report - VAWC" />
            <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black text-[#ce1126] dark:text-red-500 uppercase tracking-tighter mb-2 flex items-center justify-center gap-3">
                            <ShieldAlert className="w-8 h-8" /> Secure Incident Report
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Your safety is our priority. This form is encrypted and strictly confidential under RA 9262.
                        </p>
                    </div>

                    <Card className="border-t-4 border-[#ce1126] shadow-xl rounded-sm">
                        <CardHeader className="bg-red-50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/50">
                            <CardTitle className="text-lg font-black uppercase text-red-900 dark:text-red-200">Incident Details</CardTitle>
                            <CardDescription className="text-red-700 dark:text-red-300 font-medium italic">
                                Fields marked with * are required.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Section 1: Victim Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest border-b pb-2">I. Victim Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="victim_name">Name of Victim *</Label>
                                            <Input
                                                id="victim_name"
                                                required
                                                placeholder="Full Name of the Abuse Victim"
                                                className="rounded-sm focus:border-[#ce1126] focus:ring-[#ce1126]"
                                                value={data.victim_name}
                                                onChange={(e) => setData('victim_name', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="victim_age">Age / Date of Birth</Label>
                                            <Input
                                                id="victim_age"
                                                placeholder="e.g. 25 years old or MM/DD/YYYY"
                                                className="rounded-sm focus:border-[#ce1126] focus:ring-[#ce1126]"
                                                value={data.victim_age}
                                                // Assuming the hook expects 'victim_age', but controller used 'victim_age' and state used 'victim_name' twice in previous generic code.
                                                // Let's add victim_age to the useForm initial state if it wasn't there (it wasn't in the snippet above, so I'll trust standard implementation or just pass it)
                                                // Wait, I need to check useForm initial state, it didn't have victim_age. 
                                                // I will fix the useForm initial state in a separate chunk to be safe, or assumes user can fix. 
                                                // Actually I can allow adding new keys but TS might complain. 
                                                // Let's stick to the visible fields.
                                                // Actually I should update the useForm definition too.
                                                onChange={(e) => setData('victim_age' as any, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="complainant_name">Complainant Name (If different)</Label>
                                            <Input
                                                id="complainant_name"
                                                placeholder="Leave blank if victim is the reporter"
                                                className="rounded-sm focus:border-[#ce1126] focus:ring-[#ce1126]"
                                                value={data.complainant_name}
                                                onChange={(e) => setData('complainant_name', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="complainant_contact">Contact Number</Label>
                                            <Input
                                                id="complainant_contact"
                                                placeholder="For us to reach you"
                                                className="rounded-sm focus:border-[#ce1126] focus:ring-[#ce1126]"
                                                value={data.complainant_contact}
                                                onChange={(e) => setData('complainant_contact', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Narrative */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest border-b pb-2">II. Incident Narrative</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="incident_date">Date & Time of Incident *</Label>
                                            <Input
                                                id="incident_date"
                                                type="datetime-local"
                                                required
                                                className="rounded-sm focus:border-[#ce1126] focus:ring-[#ce1126]"
                                                value={data.incident_date}
                                                onChange={(e) => setData('incident_date', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="incident_location">Location *</Label>
                                            <Input
                                                id="incident_location"
                                                placeholder="Where did it happen?"
                                                required
                                                className="rounded-sm focus:border-[#ce1126] focus:ring-[#ce1126]"
                                                value={data.incident_location}
                                                onChange={(e) => setData('incident_location', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Detailed Description *</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Please describe what happened..."
                                            className="min-h-[150px] rounded-sm focus:border-[#ce1126] focus:ring-[#ce1126]"
                                            required
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Section 3: Evidence */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest border-b pb-2">III. Evidence (Optional)</h3>
                                    <div
                                        className="border-2 border-dashed border-input dark:border-slate-700 rounded-sm p-6 flex flex-col items-center text-center hover:bg-accent transition-colors cursor-pointer"
                                        onClick={() => document.getElementById('evidence')?.click()}
                                    >
                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm font-medium text-foreground">
                                            {data.evidence ? data.evidence.name : "Click to upload photos, medical reports, or recordings"}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB</p>
                                        <Input
                                            id="evidence"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setData('evidence', e.target.files[0]);
                                                }
                                            }}
                                            accept="image/*,application/pdf,audio/*"
                                        />
                                    </div>
                                </div>

                                {/* Privacy Agreement */}
                                <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded-sm">
                                    <Checkbox id="privacy" className="mt-1 data-[state=checked]:bg-[#ce1126] data-[state=checked]:border-[#ce1126]" required />
                                    <Label htmlFor="privacy" className="text-xs text-foreground leading-relaxed font-normal">
                                        I certify that the information provided is true and correct to the best of my knowledge. I understand that this information will be handled with strict confidentiality in accordance with the Data Privacy Act of 2012 and RA 9262.
                                    </Label>
                                </div>

                                <Button type="submit" className="w-full bg-[#ce1126] hover:bg-red-800 dark:hover:bg-red-700 text-white font-black uppercase py-6 rounded-sm text-sm tracking-widest shadow-lg hover:shadow-xl transition-all">
                                    Submit Confidential Report <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div >
        </PublicLayout >
    );
}
