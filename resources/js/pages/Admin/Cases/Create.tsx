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
        complainant_contact: '',
        relation_to_victim: '',
        abuse_type: '', // For VAWC
        concern_type: '', // For BCPC
        incident_date: '',
        incident_location: '', // For VAWC
        location: '', // For BCPC
        description: '',
        informant_name: '', // For BCPC
        informant_contact: '',
    });

    const isVAWC = type === 'VAWC';
    const accentColor = isVAWC ? 'text-rose-600' : 'text-sky-600';
    const borderColor = isVAWC ? 'border-rose-200 dark:border-rose-900' : 'border-sky-200 dark:border-sky-900';
    const bgSoft = isVAWC ? 'bg-rose-50 dark:bg-rose-950/30' : 'bg-sky-50 dark:bg-sky-950/30';

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
            { title: 'Case Registry', href: '/admin/cases' },
            { title: `New ${type} Case`, href: '#' }
        ]}>
            <Head title={`New ${type} Case`} />

            <div className="p-6 lg:p-10 max-w-5xl mx-auto">
                {/* HERO HEADER */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-3 rounded-xl shadow-sm border ${borderColor} bg-white dark:bg-neutral-900`}>
                                <AlertTriangle size={28} className={accentColor} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none">
                                File New <span className={accentColor}>{type}</span> Case
                            </h2>
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 font-medium ml-1">
                            {isVAWC ? 'Violence Against Women and Children Registry' : 'Barangay Council for the Protection of Children'}
                        </p>
                    </div>

                    <Button variant="outline" onClick={() => window.history.back()} className="rounded-full shadow-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Cancel & Return
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className={`border shadow-md overflow-hidden ${borderColor}`}>
                        <CardHeader className={`${bgSoft} border-b ${borderColor} px-8 py-6`}>
                            <CardTitle className={`text-sm font-black uppercase tracking-widest ${accentColor} flex items-center gap-2`}>
                                <AlertTriangle className="w-4 h-4" />
                                {isVAWC ? 'Incident Details' : 'Concern Details'}
                            </CardTitle>
                            <CardDescription className="text-neutral-500">
                                Please provide accurate information regarding the {isVAWC ? 'incident' : 'concern'}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 grid gap-8 bg-white dark:bg-neutral-900">

                            {/* Section: Victim Info */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4 border-b pb-2">Primary Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-neutral-500">Victim Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={data.victim_name}
                                            onChange={e => setData('victim_name', e.target.value)}
                                            placeholder="Full Name"
                                            className="font-bold h-11"
                                            required
                                        />
                                        {errors.victim_name && <span className="text-rose-500 text-xs font-bold">{errors.victim_name}</span>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-neutral-500">Age</Label>
                                            <Input
                                                value={data.victim_age}
                                                onChange={e => setData('victim_age', e.target.value)}
                                                placeholder="Age"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-neutral-500">Gender</Label>
                                            <Select value={data.victim_gender} onValueChange={v => setData('victim_gender', v)}>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-neutral-500">Incident Date</Label>
                                    <Input
                                        type="datetime-local"
                                        value={data.incident_date}
                                        onChange={e => setData('incident_date', e.target.value)}
                                        className="h-11 font-mono text-sm"
                                        required
                                    />
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Informant / Reporter Name</Label>
                                    <Input
                                        value={data.informant_name}
                                        onChange={e => setData('informant_name', e.target.value)}
                                        placeholder="Who is reporting this?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Informant Contact</Label>
                                    <Input
                                        value={data.informant_contact}
                                        onChange={e => setData('informant_contact', e.target.value)}
                                        placeholder="Mobile / Tel"
                                    />
                                </div>
                            </div>


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
        </AppLayout >
    );
}