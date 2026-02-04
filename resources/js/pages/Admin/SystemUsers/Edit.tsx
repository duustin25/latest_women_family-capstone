import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, UserCheck, ShieldAlert } from 'lucide-react';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

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
        role: user.role,
        organization_id: user.organization_id ? String(user.organization_id) : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/system-users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/admin/system-users" className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-10">

                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                                <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Official Profile</h1>
                                <p className="text-slate-500 text-sm">Update account details and access levels.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300">Official Name</Label>
                                    <Input id="name" className="h-11 dark:bg-slate-800" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300">Official Email</Label>
                                    <Input id="email" type="email" className="h-11 dark:bg-slate-800" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300">New Password (Optional)</Label>
                                    <Input id="password" type="password" className="h-11 dark:bg-slate-800" placeholder="Leave blank to keep current" value={data.password} onChange={e => setData('password', e.target.value)} />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-bold text-slate-700 dark:text-slate-300">System Role</Label>
                                    <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                        <SelectTrigger className="w-full h-11 bg-white dark:bg-slate-800">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Super Admin</SelectItem>
                                            <SelectItem value="head">Committee Head</SelectItem>
                                            <SelectItem value="president">Organization President</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                                </div>
                            </div>

                            {data.role === 'president' && (
                                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-3">
                                        <h3 className="text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-2">
                                            <ShieldAlert className="w-5 h-5" /> Organization Assignment
                                        </h3>
                                        <div className="pt-2">
                                            <Label htmlFor="org" className="text-emerald-900 dark:text-emerald-300 font-bold">Assigned Organization *</Label>
                                            <Select value={data.organization_id} onValueChange={(val) => setData('organization_id', val)}>
                                                <SelectTrigger className="w-full h-11 border-emerald-200 focus:ring-emerald-500 dark:bg-slate-900 dark:border-emerald-800 mt-1">
                                                    <SelectValue placeholder="Select Organization" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {organizations.map(org => (
                                                        <SelectItem key={org.id} value={String(org.id)}>{org.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.organization_id && <p className="text-red-500 text-xs mt-1">{errors.organization_id}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link href="/admin/system-users">
                                    <Button variant="outline" type="button" className="px-6 h-11">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800 px-8 h-11 text-white font-bold">
                                    <Save className="w-4 h-4 mr-2" /> Update Profile
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}