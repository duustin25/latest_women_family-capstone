import { Head, useForm, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, UserPlus, Loader2 } from 'lucide-react';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { OrganizationSelector } from '@/components/Admin/OrganizationSelector';

interface Organization {
    id: number;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'System Users', href: '/admin/system-users' },
    { title: 'Create', href: '#' },
];

export default function Create({ organizations }: { organizations: Organization[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'head',
        organization_id: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset organization_id if role changes from president
    React.useEffect(() => {
        if (data.role !== 'president' && data.organization_id !== '') {
            setData('organization_id', '');
        }
    }, [data.role]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post('/admin/system-users', {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-4xl mx-auto px-4 md:px-8">

                    {/* Back Link */}
                    <Link
                        href="/admin/system-users"
                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
                    </Link>

                    <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 md:p-12">

                        {/* Header */}
                        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-neutral-100 dark:border-neutral-800">
                            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl text-neutral-900 dark:text-white">
                                <UserPlus className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">Grant System Access</h1>
                                <p className="text-neutral-500 text-sm font-medium">Create a new official account for System Administrators, Committee Heads, or Organization Presidents.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Name & Email Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Official Name</Label>
                                    <Input
                                        id="name"
                                        className="h-12 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus:ring-neutral-900 font-bold text-neutral-900"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                        placeholder="e.g. Hon. Juan Dela Cruz"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs font-bold mt-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Official Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="h-12 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus:ring-neutral-900 font-bold text-neutral-900"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                        placeholder="official@brgy183.gov"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            {/* Password & Role Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Temporary Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            className="h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:ring-neutral-900 font-bold dark:text-white"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            required
                                        />
                                        {errors.password && <p className="text-red-500 text-xs font-bold mt-1">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Confirm Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            className="h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:ring-neutral-900 font-bold dark:text-white"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">System Role</Label>
                                    <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                        <SelectTrigger className="w-full h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 font-bold text-neutral-900 dark:text-white">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin" className="font-bold">Super Admin (IT/Sec)</SelectItem>
                                            <SelectItem value="head" className="font-bold">Committee Head (VAWC/BCPC)</SelectItem>
                                            <SelectItem value="president" className="font-bold">Organization President (KALIPI/SoloP)</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {errors.role && <p className="text-red-500 text-xs font-bold mt-1">{errors.role}</p>}
                                </div>
                            </div>

                            {/* CONDITIONAL ORGANIZATION DROPDOWN */}
                            <OrganizationSelector
                                role={data.role}
                                organizationId={data.organization_id}
                                onOrganizationChange={(val) => setData('organization_id', val)}
                                organizations={organizations}
                                error={errors.organization_id}
                            />

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                                <Link href="/admin/system-users">
                                    <Button variant="ghost" type="button" className="px-6 h-12 font-bold text-neutral-500 hover:text-neutral-900 uppercase tracking-wide">Cancel</Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing || isSubmitting}
                                    className="bg-neutral-900 hover:bg-neutral-800 px-8 h-12 text-white font-black uppercase tracking-wide rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    {(processing || isSubmitting) ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    {isSubmitting ? 'Creating...' : 'Create Official Account'}
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}