import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Upload, CheckCircle2, Trash2 } from "lucide-react";
import PublicLayout from '@/layouts/PublicLayout';

export default function DynamicForm({ organization }: { organization: any }) {
    const { data, setData, post, processing, errors } = useForm({
        fullname: '',
        address: '',
        submission_data: {} as Record<string, any>,
    });

    const handleInputChange = (fieldId: string, value: any) => {
        setData('submission_data', {
            ...data.submission_data,
            [fieldId]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/organizations/${organization.slug}/apply`);
    };

    const renderField = (field: any) => {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'number':
                return (
                    <div key={field.id} className={`space-y-2 ${field.width === 'w-1/2' ? 'w-[calc(50%-12px)]' : field.width === 'w-1/3' ? 'w-[calc(33.33%-16px)]' : field.width === 'w-1/4' ? 'w-[calc(25%-18px)]' : 'w-full'}`}>
                        <Label htmlFor={field.id} className="text-sm font-bold uppercase text-neutral-600 dark:text-neutral-400">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                            id={field.id}
                            type={field.type}
                            required={field.required}
                            value={data.submission_data[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="font-semibold"
                            placeholder={`Enter ${field.label}...`}
                        />
                    </div>
                );
            case 'textarea':
                return (
                    <div key={field.id} className={`space-y-2 ${field.width === 'w-1/2' ? 'w-[calc(50%-12px)]' : field.width === 'w-1/3' ? 'w-[calc(33.33%-16px)]' : field.width === 'w-1/4' ? 'w-[calc(25%-18px)]' : 'w-full'}`}>
                        <Label htmlFor={field.id} className="text-sm font-bold uppercase text-neutral-600 dark:text-neutral-400">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <Textarea
                            id={field.id}
                            required={field.required}
                            value={data.submission_data[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="min-h-[100px]"
                            placeholder={`Enter ${field.label}...`}
                        />
                    </div>
                );
            case 'select':
                return (
                    <div key={field.id} className={`space-y-2 ${field.width === 'w-1/2' ? 'w-[calc(50%-12px)]' : field.width === 'w-1/3' ? 'w-[calc(33.33%-16px)]' : field.width === 'w-1/4' ? 'w-[calc(25%-18px)]' : 'w-full'}`}>
                        <Label htmlFor={field.id} className="text-sm font-bold uppercase text-neutral-600 dark:text-neutral-400">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <Select onValueChange={(val: string) => handleInputChange(field.id, val)} required={field.required}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((opt: string, idx: number) => (
                                    <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            case 'radio':
                return (
                    <div key={field.id} className={`space-y-3 ${field.width === 'w-1/2' ? 'w-[calc(50%-12px)]' : field.width === 'w-1/3' ? 'w-[calc(33.33%-16px)]' : field.width === 'w-1/4' ? 'w-[calc(25%-18px)]' : 'w-full'}`}>
                        <Label className="text-sm font-bold uppercase text-neutral-600 dark:text-neutral-400">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <RadioGroup onValueChange={(val: string) => handleInputChange(field.id, val)} required={field.required}>
                            <div className="flex flex-col gap-2">
                                {field.options?.map((opt: string, idx: number) => (
                                    <div className="flex items-center space-x-2" key={idx}>
                                        <RadioGroupItem value={opt} id={`${field.id}-${idx}`} />
                                        <Label htmlFor={`${field.id}-${idx}`}>{opt}</Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={field.id} className={`space-y-3 ${field.width === 'w-1/2' ? 'w-[calc(50%-12px)]' : field.width === 'w-1/3' ? 'w-[calc(33.33%-16px)]' : field.width === 'w-1/4' ? 'w-[calc(25%-18px)]' : 'w-full'}`}>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={field.id}
                                required={field.required}
                                checked={!!data.submission_data[field.id]}
                                onChange={(e) => handleInputChange(field.id, e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-600"
                            />
                            <Label htmlFor={field.id} className="text-sm font-bold uppercase text-neutral-600 dark:text-neutral-400 cursor-pointer">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </Label>
                        </div>
                    </div>
                );
            case 'table':
                return (
                    <div key={field.id} className="w-full space-y-3">
                        <Label className="text-sm font-bold uppercase text-neutral-600 dark:text-neutral-400">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <div className="border rounded-lg overflow-hidden dark:border-neutral-800">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 font-bold">
                                    <tr>
                                        {field.columns?.map((col: any, idx: number) => (
                                            <th key={idx} className="px-4 py-3">{col.name}</th>
                                        ))}
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {(data.submission_data[field.id] || []).map((row: any, rowIndex: number) => (
                                        <tr key={rowIndex} className="bg-white dark:bg-neutral-900">
                                            {field.columns?.map((col: any, colIndex: number) => (
                                                <td key={colIndex} className="p-2">
                                                    <Input
                                                        value={row[col.name] || ''}
                                                        onChange={(e) => {
                                                            const newRows = [...(data.submission_data[field.id] || [])];
                                                            newRows[rowIndex] = { ...newRows[rowIndex], [col.name]: e.target.value };
                                                            handleInputChange(field.id, newRows);
                                                        }}
                                                        className="h-8 text-xs"
                                                        placeholder={col.name}
                                                    />
                                                </td>
                                            ))}
                                            <td className="p-2 text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newRows = (data.submission_data[field.id] || []).filter((_: any, i: number) => i !== rowIndex);
                                                        handleInputChange(field.id, newRows);
                                                    }}
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <ArrowLeft className="w-4 h-4 rotate-45" /> {/* Using generic icon as Trash might not be imported, looking at imports */}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data.submission_data[field.id] || data.submission_data[field.id].length === 0) && (
                                        <tr>
                                            <td colSpan={(field.columns?.length || 0) + 1} className="p-4 text-center text-xs text-neutral-400 italic">
                                                No items added yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="bg-neutral-50 dark:bg-neutral-900/30 p-2 border-t dark:border-neutral-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const newRows = [...(data.submission_data[field.id] || []), {}];
                                        handleInputChange(field.id, newRows);
                                    }}
                                    className="w-full text-xs font-bold uppercase text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-dashed"
                                >
                                    + Add Row
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <PublicLayout>
            <Head title={`Apply - ${organization.name}`} />

            <div className={`min-h-screen py-12 ${organization.color_theme || 'bg-blue-600'}`}>
                <div className="max-w-3xl mx-auto px-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-black/20">
                            <Link href={`/organizations/${organization.slug}`} className="inline-flex items-center text-xs font-black tracking-widest text-neutral-400 hover:text-blue-600 mb-6 uppercase transition-colors">
                                <ArrowLeft className="w-3 h-3 mr-2" /> Back to Profile
                            </Link>
                            <h1 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight mb-2">
                                Membership Application
                            </h1>
                            <p className="text-neutral-500 font-medium">
                                Submitting to <span className="font-bold text-neutral-900 dark:text-white">{organization.name}</span>
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">

                            {/* Standard Fields */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b pb-2">Personal Information</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullname" className="text-xs font-bold uppercase text-neutral-500">Full Name</Label>
                                        <Input
                                            id="fullname"
                                            value={data.fullname}
                                            onChange={e => setData('fullname', e.target.value)}
                                            required
                                            placeholder="Given Middle Surname"
                                            className="font-bold"
                                        />
                                        {errors.fullname && <p className="text-red-500 text-xs">{errors.fullname}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-xs font-bold uppercase text-neutral-500">Address</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            required
                                            placeholder="House No, Street, Barangay"
                                            className="font-bold"
                                        />
                                        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Fields */}
                            {organization.form_schema && organization.form_schema.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b pb-2">Organization Requirements</h3>
                                    <div className="flex flex-wrap gap-x-6 gap-y-6">
                                        {organization.form_schema.map((field: any) => renderField(field))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full h-14 text-sm font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 ${organization.color_theme?.replace('bg-', 'bg-') || 'bg-blue-600'} hover:brightness-110 text-white`}
                                >
                                    {processing ? 'Submitting Application...' : 'Submit Application'} <CheckCircle2 className="ml-2 w-5 h-5" />
                                </Button>
                                <p className="text-[10px] text-center text-neutral-400 mt-4 uppercase font-bold">
                                    By submitting this form, you certify that all information is true and correct.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
