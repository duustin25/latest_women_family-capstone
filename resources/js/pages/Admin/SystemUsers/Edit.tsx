import { Head, useForm, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, UserCheck, Loader2 } from 'lucide-react';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { OrganizationSelector } from '@/components/Admin/OrganizationSelector';

interface Organization {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    organization_id: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'System Users', href: '/admin/system-users' },
    { title: 'Edit', href: '#' },
];

export default function Edit({ user, organizations }: { user: User, organizations: Organization[] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        organization_id: user.organization_id ? String(user.organization_id) : '',
        current_admin_password: '',
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
        put(`/admin/system-users/${user.id}`, {
            onFinish: () => {
                setIsSubmitting(false);
                setData('current_admin_password', '');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <Link href={'/admin/system-users' + location.search} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
                    </Link>

                    <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 md:p-12">

                        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-neutral-100 dark:border-neutral-800">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                <UserCheck className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">Edit Official Profile</h1>
                                <p className="text-neutral-500 text-sm font-medium">Update account details and access levels.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Official Name</Label>
                                    <Input id="name" className="h-12 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus:ring-emerald-600 font-bold text-neutral-900 dark:text-white" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-red-500 text-xs font-bold mt-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Official Email</Label>
                                    <Input id="email" type="email" className="h-12 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus:ring-emerald-600 font-bold text-neutral-900 dark:text-white" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                    {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">New Password (Optional)</Label>
                                        <Input id="password" type="password" className="h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:ring-emerald-600 font-bold dark:text-white" placeholder="Leave blank to keep current" value={data.password} onChange={e => setData('password', e.target.value)} />
                                        {errors.password && <p className="text-red-500 text-xs font-bold mt-1">{errors.password}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Confirm Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            className="h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:ring-emerald-600 font-bold dark:text-white"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
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
                                            <SelectItem value="admin" className="font-bold">Super Admin</SelectItem>
                                            <SelectItem value="head" className="font-bold">Committee Head</SelectItem>
                                            <SelectItem value="president" className="font-bold">Organization President</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-red-500 text-xs font-bold mt-1">{errors.role}</p>}
                                </div>
                            </div>

                            <OrganizationSelector
                                role={data.role}
                                organizationId={data.organization_id}
                                onOrganizationChange={(val) => setData('organization_id', val)}
                                organizations={organizations}
                                error={errors.organization_id}
                                description=""
                            />

                            {/* ADMINISTRATIVE VERIFICATION SECTION */}
                            <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800/50 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                    <h3 className="text-sm font-black text-amber-900 dark:text-amber-400 uppercase tracking-wider">Administrative Approval Required</h3>
                                </div>
                                <p className="text-xs font-medium text-amber-700 dark:text-amber-500/80 leading-relaxed italic">
                                    To authorize these changes (especially role or password updates), please enter **your** (the Super Admin) current password. This ensures only authorized personnel can modify system access.
                                </p>
                                <div className="space-y-2 max-w-sm">
                                    <Label htmlFor="current_admin_password" className="text-[10px] font-black text-amber-900/60 dark:text-amber-400/60 uppercase tracking-widest">Your Current Password</Label>
                                    <Input
                                        id="current_admin_password"
                                        type="password"
                                        className="h-12 bg-white dark:bg-neutral-900 border-amber-200 dark:border-amber-800 focus:ring-amber-500 font-bold dark:text-white"
                                        value={data.current_admin_password}
                                        onChange={e => setData('current_admin_password', e.target.value)}
                                        placeholder="Confirm you are the real administrator"
                                        required
                                    />
                                    {errors.current_admin_password && <p className="text-red-500 text-xs font-bold mt-1">{errors.current_admin_password}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                                <Link href={'/admin/system-users' + location.search}>
                                    <Button variant="ghost" type="button" className="px-6 h-12 font-bold text-neutral-500 hover:text-neutral-900 uppercase tracking-wide">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing || isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 px-8 h-12 text-white font-black uppercase tracking-wide rounded-full shadow-lg hover:shadow-xl transition-all">
                                    {(processing || isSubmitting) ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
