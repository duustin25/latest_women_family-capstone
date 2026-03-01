import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert } from 'lucide-react';

interface Organization {
    id: number;
    name: string;
}

interface OrganizationSelectorProps {
    role: string;
    organizationId: string;
    onOrganizationChange: (value: string) => void;
    organizations: Organization[];
    error?: string;
    description?: string;
}

export function OrganizationSelector({
    role,
    organizationId,
    onOrganizationChange,
    organizations,
    error,
    description = "Presidents are restricted to view and manage only the members of their assigned organization."
}: OrganizationSelectorProps) {
    if (role !== 'president') {
        return null;
    }

    return (
        <div className="p-8 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900 animate-in fade-in slide-in-from-top-4">
            <div className="space-y-4">
                <h3 className="text-purple-900 dark:text-purple-300 font-black flex items-center gap-2 uppercase tracking-wide text-sm">
                    <ShieldAlert className="w-5 h-5" /> Organization Assignment
                </h3>
                {description && (
                    <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">
                        {description}
                    </p>
                )}

                <div className="pt-2">
                    <Label htmlFor="org" className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">Select Organization *</Label>
                    <Select value={organizationId} onValueChange={onOrganizationChange}>
                        <SelectTrigger className="w-full h-12 border-purple-200 focus:ring-purple-500 bg-white dark:bg-purple-900/20 dark:border-purple-800 mt-2 font-bold text-purple-900 dark:text-purple-100">
                            <SelectValue placeholder="Select Organization to Manage" />
                        </SelectTrigger>
                        <SelectContent>
                            {organizations.map((org) => (
                                <SelectItem key={org.id} value={String(org.id)} className="font-bold">
                                    {org.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {error && <p className="text-red-500 text-xs font-bold mt-1">{error}</p>}
                </div>
            </div>
        </div>
    );
}
