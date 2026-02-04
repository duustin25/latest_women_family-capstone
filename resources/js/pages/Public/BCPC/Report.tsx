import React, { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { route } from 'ziggy-js';

export default function BcpcReport() {
    const { data, setData, post, processing, errors, reset } = useForm({
        victim_name: '',
        victim_age: '',
        victim_gender: '',
        concern_type: '',
        location: '',
        description: '',
        informant_name: '',
        informant_contact: '',
        is_anonymous: false,
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bcpc.report.store'), {
            onSuccess: () => setSubmitted(true),
        });
    };

    if (submitted) {
        return (
            <PublicLayout>
                <Head title="Report Received" />
                <div className="py-12">
                    <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Concern Received</CardTitle>
                                <CardDescription>Thank you for advocating for the child's safety.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={() => window.location.href = '/bcpc'}
                                    className="w-full"
                                >
                                    Return to BCPC Page
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
            <Head title="Report Concern - BCPC" />
            <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter mb-2">Report Child Concern</h1>
                        <p className="text-muted-foreground font-medium">BCPC Action Form - Protecting Our Children</p>
                    </div>

                    <Card className="border-t-4 border-blue-600 shadow-xl rounded-sm">
                        <CardHeader className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/50">
                            <CardTitle className="text-lg font-black uppercase text-blue-900 dark:text-blue-200">Concern Details</CardTitle>
                            <CardDescription className="text-blue-700 dark:text-blue-300 font-medium">Fields marked with * are required.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Child / Victim Information */}
                                <div className="space-y-4 border-b border-blue-100 pb-4">
                                    <h3 className="text-sm font-bold uppercase text-blue-900 flex items-center gap-2">
                                        <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">1</span>
                                        Child / Victim Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="victim_name">Child's Name (Optional if Unknown)</Label>
                                            <Input
                                                id="victim_name"
                                                value={data.victim_name}
                                                onChange={e => setData('victim_name', e.target.value)}
                                                placeholder="Name of the child"
                                                className="rounded-sm focus:border-blue-600 focus:ring-blue-600"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="victim_age">Age (Est.)</Label>
                                                <Input
                                                    id="victim_age"
                                                    type="number"
                                                    value={data.victim_age}
                                                    onChange={e => setData('victim_age', e.target.value)}
                                                    placeholder="Age"
                                                    className="rounded-sm focus:border-blue-600 focus:ring-blue-600"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="victim_gender">Gender</Label>
                                                <Select onValueChange={(val) => setData('victim_gender', val)}>
                                                    <SelectTrigger className="rounded-sm focus:ring-blue-600">
                                                        <SelectValue placeholder="Gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Incident Details */}
                                <div className="space-y-4 border-b border-blue-100 pb-4">
                                    <h3 className="text-sm font-bold uppercase text-blue-900 flex items-center gap-2">
                                        <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">2</span>
                                        Incident Details
                                    </h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Nature of Concern *</Label>
                                        <Select onValueChange={(val) => setData('concern_type', val)} required>
                                            <SelectTrigger className="rounded-sm focus:ring-blue-600">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Abuse">Physical / Emotional Abuse</SelectItem>
                                                <SelectItem value="Abandonment">Neglect / Abandonment</SelectItem>
                                                <SelectItem value="CICL">Child in Conflict with Law (CICL)</SelectItem>
                                                <SelectItem value="Labor">Child Labor</SelectItem>
                                                <SelectItem value="Bullying">Bullying</SelectItem>
                                                <SelectItem value="Other">Other Concerns</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location of Child / Incident *</Label>
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                            required
                                            className="rounded-sm focus:border-blue-600 focus:ring-blue-600"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Observation / Details *</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            required
                                            className="min-h-[120px] rounded-sm focus:border-blue-600 focus:ring-blue-600"
                                        />
                                    </div>
                                </div>

                                {/* Reporter Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase text-blue-900 flex items-center gap-2">
                                        <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">3</span>
                                        Reporter Information
                                    </h3>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="anonymous"
                                            checked={data.is_anonymous}
                                            onCheckedChange={(checked) => setData('is_anonymous', checked as boolean)}
                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Label htmlFor="anonymous">Submit Anonymously</Label>
                                    </div>

                                    {!data.is_anonymous && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Your Name</Label>
                                                <Input
                                                    id="name"
                                                    value={data.informant_name}
                                                    onChange={e => setData('informant_name', e.target.value)}
                                                    className="rounded-sm focus:border-blue-600 focus:ring-blue-600"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contact">Contact Number</Label>
                                                <Input
                                                    id="contact"
                                                    value={data.informant_contact}
                                                    onChange={e => setData('informant_contact', e.target.value)}
                                                    className="rounded-sm focus:border-blue-600 focus:ring-blue-600"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase py-6 rounded-sm shadow-lg transition-all">
                                    Submit Concern
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}
