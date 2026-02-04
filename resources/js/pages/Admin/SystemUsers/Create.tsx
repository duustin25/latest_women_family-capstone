import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, ShieldAlert, UserPlus, FileText } from 'lucide-react';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

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
        role: 'head',
        organization_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/system-users');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Back Link */}
                    <Link
                        href="/admin/system-users"
                        className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-10">

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Grant System Access</h1>
                                <p className="text-slate-500 text-sm">Create a new official account for Admins, Heads, or Presidents.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Name & Email Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300">Official Name</Label>
                                    <Input
                                        id="name"
                                        className="h-11 dark:bg-slate-800 dark:border-slate-700"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                        placeholder="e.g. Hon. Juan Dela Cruz"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300">Official Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="h-11 dark:bg-slate-800 dark:border-slate-700"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                        placeholder="official@brgy183.gov"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email}</p>}
                                </div>
                            </div>

                            {/* Password & Role Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300">Temporary Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        className="h-11 dark:bg-slate-800 dark:border-slate-700"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-bold text-slate-700 dark:text-slate-300">System Role</Label>
                                    <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                        <SelectTrigger className="w-full h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Super Admin (IT/Sec)</SelectItem>
                                            <SelectItem value="head">Committee Head (VAWC/BCPC)</SelectItem>
                                            <SelectItem value="president">Organization President (KALIPI/SoloP)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-red-500 text-xs font-medium">{errors.role}</p>}
                                </div>
                            </div>

                            {/* CONDITIONAL ORGANIZATION DROPDOWN */}
                            {data.role === 'president' && (
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-3">
                                        <h3 className="text-blue-900 dark:text-blue-200 font-bold flex items-center gap-2">
                                            <ShieldAlert className="w-5 h-5" /> Organization Assignment
                                        </h3>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            Presidents are restricted to view and manage only the members of their assigned organization.
                                        </p>

                                        <div className="pt-2">
                                            <Label htmlFor="org" className="text-blue-900 dark:text-blue-300 font-bold">Select Organization *</Label>
                                            <Select value={data.organization_id} onValueChange={(val) => setData('organization_id', val)}>
                                                <SelectTrigger className="w-full h-11 border-blue-200 focus:ring-blue-500 dark:bg-slate-900 dark:border-blue-800 mt-1">
                                                    <SelectValue placeholder="Select Organization to Manage" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {organizations.map(org => (
                                                        <SelectItem key={org.id} value={String(org.id)}>{org.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.organization_id && <p className="text-red-500 text-xs font-medium mt-1">{errors.organization_id}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link href="/admin/system-users">
                                    <Button variant="outline" type="button" className="px-6 h-11">Cancel</Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 px-8 h-11 text-white font-bold"
                                >
                                    <Save className="w-4 h-4 mr-2" /> Create Official Account
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}