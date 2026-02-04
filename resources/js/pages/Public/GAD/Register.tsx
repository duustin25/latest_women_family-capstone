import React, { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { route } from 'ziggy-js';
import { UserPlus } from 'lucide-react';

export default function GadRegister({ organization }: { organization: any }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        organization_id: organization?.id,
        fullname: '',
        address: '',
        birthdate: '',
        sex: '',
        civil_status: '',
        contact_number: '',
        occupation: '',
        skills: '',
        num_children: 0,
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('gad.register.store'), {
            onSuccess: () => setSubmitted(true),
        });
    };

    if (submitted) {
        return (
            <PublicLayout>
                <Head title="Application Sent" />
                <div className="py-12">
                    <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Received</CardTitle>
                                <CardDescription>Your preliminary membership application for <strong>{organization?.name}</strong> has been received.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Please proceed to the Barangay Hall with your requirements for verification and ID issuance.
                                </p>
                                <Button
                                    onClick={() => window.location.href = '/gad'}
                                    className="w-full"
                                >
                                    Return to GAD Page
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title={`Join ${organization?.name}`} />
            <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black text-purple-700 dark:text-purple-400 uppercase tracking-tighter mb-2 flex items-center justify-center gap-3">
                            <UserPlus className="w-8 h-8" /> Membership Application
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Apply to join {organization?.name}. Empowering women through organization and livelihood.
                        </p>
                    </div>

                    <Card className="border-t-4 border-purple-600 shadow-xl rounded-sm">
                        <CardHeader className="bg-purple-50 dark:bg-purple-950/20 border-b border-purple-100 dark:border-purple-900/50">
                            <CardTitle className="text-lg font-black uppercase text-purple-900 dark:text-purple-200">Application Details</CardTitle>
                            <CardDescription className="text-purple-700 dark:text-purple-300 font-medium italic">
                                Fields marked with * are required.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                <input type="hidden" value={data.organization_id} />

                                {/* Section 1: Personal Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest border-b pb-2">I. Personal Information</h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="fullname">Full Name *</Label>
                                        <Input
                                            id="fullname"
                                            value={data.fullname}
                                            onChange={e => setData('fullname', e.target.value)}
                                            required
                                            placeholder="Given Name M.I. Surname"
                                            className="rounded-sm focus:border-purple-600 focus:ring-purple-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sex">Sex *</Label>
                                            <Select onValueChange={(val) => setData('sex', val)} required>
                                                <SelectTrigger className="rounded-sm focus:ring-purple-600">
                                                    <SelectValue placeholder="Select Sex" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="birthdate">Date of Birth *</Label>
                                            <Input
                                                id="birthdate"
                                                type="date"
                                                value={data.birthdate}
                                                onChange={e => setData('birthdate', e.target.value)}
                                                required
                                                className="rounded-sm focus:border-purple-600 focus:ring-purple-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address *</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            required
                                            placeholder="House No, Street, Barangay 183"
                                            className="rounded-sm focus:border-purple-600 focus:ring-purple-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="contact">Contact Number *</Label>
                                            <Input
                                                id="contact"
                                                value={data.contact_number}
                                                onChange={e => setData('contact_number', e.target.value)}
                                                required
                                                placeholder="0912 345 6789"
                                                className="rounded-sm focus:border-purple-600 focus:ring-purple-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="civil_status">Civil Status *</Label>
                                            <Select onValueChange={(val) => setData('civil_status', val)} required>
                                                <SelectTrigger className="rounded-sm focus:ring-purple-600">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Single">Single</SelectItem>
                                                    <SelectItem value="Married">Married</SelectItem>
                                                    <SelectItem value="Widowed">Widowed</SelectItem>
                                                    <SelectItem value="Separated">Separated</SelectItem>
                                                    <SelectItem value="Solo Parent">Solo Parent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Socio-Economic Data */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest border-b pb-2">II. Socio-Economic Data</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="occupation">Occupation</Label>
                                            <Input
                                                id="occupation"
                                                value={data.occupation}
                                                onChange={e => setData('occupation', e.target.value)}
                                                placeholder="e.g. Employee, Self-employed"
                                                className="rounded-sm focus:border-purple-600 focus:ring-purple-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="skills">Special Skills</Label>
                                            <Input
                                                id="skills"
                                                value={data.skills}
                                                onChange={e => setData('skills', e.target.value)}
                                                placeholder="e.g. Cooking, Sewing"
                                                className="rounded-sm focus:border-purple-600 focus:ring-purple-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="children">Number of Children</Label>
                                        <Input
                                            id="children"
                                            type="number"
                                            min="0"
                                            value={data.num_children}
                                            onChange={e => setData('num_children', parseInt(e.target.value) || 0)}
                                            className="w-24 rounded-sm focus:border-purple-600 focus:ring-purple-600"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-sm">
                                    <Checkbox id="terms" className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" required />
                                    <Label htmlFor="terms" className="text-xs text-foreground leading-relaxed font-normal">
                                        I hereby apply for membership in {organization?.name || 'KALIPI'} and agree to abide by its constitution and by-laws.
                                    </Label>
                                </div>

                                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-800 text-white font-black uppercase py-6 rounded-sm text-sm tracking-widest shadow-lg hover:shadow-xl transition-all">
                                    Submit Application <UserPlus className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}