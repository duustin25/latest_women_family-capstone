import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Upload, CheckCircle2, Trash2 } from "lucide-react";
import PublicLayout from '@/layouts/PublicLayout';
import DynamicFields from '@/components/DynamicFields';

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
                                    <DynamicFields
                                        schema={organization.form_schema}
                                        data={data.submission_data}
                                        setData={handleInputChange}
                                        errors={errors}
                                    />
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
