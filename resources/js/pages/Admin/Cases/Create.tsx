import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { route } from 'ziggy-js';

interface AbuseType {
    id: number;
    name: string;
    category: string;
}

interface PageProps {
    type: string;
    abuseTypes?: AbuseType[];
}

export default function Create({ type, abuseTypes = [] }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        type: type, // Hidden field to identify model
        victim_name: '',
        victim_age: '',
        victim_gender: '', // For BCPC
        complainant_name: '', // For VAWC
        abuse_type: '', // For VAWC
        concern_type: '', // For BCPC
        incident_date: '',
        incident_location: '', // For VAWC
        location: '', // For BCPC
        description: '',
        informant_name: '', // For BCPC
    });

    const isVAWC = type === 'VAWC';

    // Filter types based on category
    const vawcOptions = abuseTypes.filter(t => t.category === 'VAWC' || t.category === 'Both');
    const bcpcOptions = abuseTypes.filter(t => t.category === 'BCPC' || t.category === 'Both');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.cases.store'));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Cases', href: '/admin/cases' },
            { title: `New ${type} Case`, href: '#' }
        ]}>
            <Head title={`New ${type} Case`} />

            <div className="p-6 lg:p-8 max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            File New {type} Case
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {isVAWC ? 'Violence Against Women and Children Registry' : 'Barangay Council for the Protection of Children'}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Registry
                    </Button>
                </div>

                <form onSubmit={submit}>
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-800">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-[#ce1126]" />
                                {isVAWC ? 'Incident details' : 'Concern details'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid gap-6">

                            {/* Common: Victim Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Victim Name</Label>
                                    <Input
                                        value={data.victim_name}
                                        onChange={e => setData('victim_name', e.target.value)}
                                        placeholder="Full Name"
                                        className="font-bold"
                                        required
                                    />
                                    {errors.victim_name && <span className="text-red-500 text-xs">{errors.victim_name}</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-500">Age</Label>
                                        <Input
                                            value={data.victim_age}
                                            onChange={e => setData('victim_age', e.target.value)}
                                            placeholder="Age"
                                            type="number"
                                        />
                                    </div>
                                    {!isVAWC && (
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500">Gender</Label>
                                            <Select value={data.victim_gender} onValueChange={v => setData('victim_gender', v)}>
                                                <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* TYPE SPECIFIC FIELDS */}
                            {isVAWC ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500">Abuse Type</Label>
                                            <Select value={data.abuse_type} onValueChange={v => setData('abuse_type', v)} required>
                                                <SelectTrigger><SelectValue placeholder="Select Abuse Type" /></SelectTrigger>
                                                <SelectContent>
                                                    {vawcOptions.length > 0 ? (
                                                        vawcOptions.map((t) => (
                                                            <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.abuse_type && <span className="text-red-500 text-xs">{errors.abuse_type}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500">Incident Date</Label>
                                            <Input
                                                type="date"
                                                value={data.incident_date}
                                                onChange={e => setData('incident_date', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-500">Incident Location</Label>
                                        <Input
                                            value={data.incident_location}
                                            onChange={e => setData('incident_location', e.target.value)}
                                            placeholder="Where did the incident happen?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-500">Complainant Name (If different from victim)</Label>
                                        <Input
                                            value={data.complainant_name}
                                            onChange={e => setData('complainant_name', e.target.value)}
                                            placeholder="Leave blank if victim is complainant"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* BCPC FIELDS */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500">Nature of Concern</Label>
                                            <Select value={data.concern_type} onValueChange={v => setData('concern_type', v)} required>
                                                <SelectTrigger><SelectValue placeholder="Select Concern" /></SelectTrigger>
                                                <SelectContent>
                                                    {bcpcOptions.length > 0 ? (
                                                        bcpcOptions.map((t) => (
                                                            <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                                                        ))
                                                    ) : (
                                                        // Fallback just in case, though database should have seeds
                                                        <>
                                                            <SelectItem value="Abuse">Child Abuse</SelectItem>
                                                            <SelectItem value="Abandonment">Abandonment</SelectItem>
                                                            <SelectItem value="CICL">CICL</SelectItem>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.concern_type && <span className="text-red-500 text-xs">{errors.concern_type}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500">Location</Label>
                                            <Input
                                                value={data.location}
                                                onChange={e => setData('location', e.target.value)}
                                                placeholder="Location of incident/residence"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-500">Informant / Reporter Name</Label>
                                        <Input
                                            value={data.informant_name}
                                            onChange={e => setData('informant_name', e.target.value)}
                                            placeholder="Who is reporting this?"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">Numerical/Narrative Description</Label>
                                <Textarea
                                    className="min-h-[120px]"
                                    placeholder="Describe the details of the case..."
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    required
                                />
                                {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-end">
                        <Button className="bg-[#ce1126] hover:bg-red-700 text-white font-black uppercase tracking-widest px-8" disabled={processing}>
                            <Save className="w-4 h-4 mr-2" /> Submit Case Report
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}