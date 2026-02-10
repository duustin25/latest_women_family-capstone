import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, ArrowLeft, ShieldCheck, Briefcase, MapPin, Phone, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import DynamicFields from '@/components/DynamicFields';
import { route } from 'ziggy-js';

// Added 'application' prop for edit mode
interface FamilyMember {
    name: string;
    age: string;
    relation: string;
    education: string;
    occupation: string;
    income: string;
    remarks: string;
    [key: string]: string; // Allow dynamic access
}

interface PersonalData {
    age: string;
    dob: string;
    religion: string;
    civil_status: string;
    sectoral_category: string;
    education: string;
    occupation: string;
    monthly_income: string;
    company: { name: string; address: string; tel: string };
    skills: string;
    org_history: { name: string; address: string; position: string; date: string };
}

interface ApplicationData {
    id?: number;
    fullname: string;
    address: string;
    personal_data: PersonalData;
    family_data: FamilyMember[];
    submission_data: any;
}

export default function KalipiForm({ organization, mode = 'public', application }: { organization: any, mode: string, application?: ApplicationData }) {

    // Parse initial data if editing
    const initialPersonalData = application?.personal_data || {
        age: '', dob: '', religion: '', civil_status: '',
        sectoral_category: '', education: '', occupation: '', monthly_income: '',
        company: { name: '', address: '', tel: '' },
        skills: '',
        org_history: { name: '', address: '', position: '', date: '' }
    };

    const initialFamilyData = application?.family_data && application.family_data.length > 0 ? application.family_data : [
        { name: '', age: '', relation: '', education: '', occupation: '', income: '', remarks: '' }
    ];

    const { data, setData, post, put, processing, errors } = useForm({ // Added put
        fullname: application?.fullname || '',
        address: application?.address || '',
        personal_data: initialPersonalData,
        family_data: initialFamilyData,
        // Make sure submission_data is initialized for DynamicForm
        submission_data: application?.submission_data || {}
    });

    const isEditMode = mode === 'admin-edit'; // New mode for editing existing application
    // If admin-edit, back URL goes to review page
    const backUrl = isEditMode && application ? `/admin/applications/${application.id}` : (mode === 'admin' ? '/admin/applications/create' : `/organizations/${organization.slug}`);
    const backLabel = isEditMode ? 'Back to Review' : (mode === 'admin' ? 'Back to Selection' : 'Back to Profile');

    const addFamilyMember = () => {
        setData('family_data', [...data.family_data, { name: '', age: '', relation: '', education: '', occupation: '', income: '', remarks: '' }]);
    };

    const removeFamilyMember = (index: number) => {
        if (data.family_data.length > 1) {
            setData('family_data', data.family_data.filter((_: FamilyMember, i: number) => i !== index));
        }
    };

    const updateFamilyMember = (index: number, field: string, value: string) => {
        const updated = [...data.family_data];
        updated[index] = { ...updated[index], [field]: value };
        setData('family_data', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode && application) {
            // Update Logc (Admin Correction)
            put(route('admin.applications.update', application.id), {
                onError: (err) => {
                    toast.error("Update Failed", {
                        description: "Please check the highlighted fields.",
                    });
                }
            });
        } else {
            // Create Logic (Public or Admin Encoder)
            post(`/organizations/${organization.slug}/apply`, {
                preserveScroll: true,
                onError: (err) => {
                    toast.error("Submission Halted", {
                        description: err.fullname || "Please check the highlighted errors in the form.",
                    });
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 transition-colors duration-300">
            <Head title={`KALIPI Application - ${organization.name}`} />

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Link href={backUrl} className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {backLabel}
                    </Link>
                    {(mode === 'admin' || isEditMode) && <Badge className="bg-amber-500 text-white font-black px-3 py-1 rounded-none text-[9px] uppercase tracking-widest shadow-lg">
                        {isEditMode ? 'Correction Mode' : 'Encoder Mode'}
                    </Badge>}
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 shadow-2xl border-t-[12px] border-blue-700 dark:border-blue-600 rounded-sm overflow-hidden mb-20">

                    <div className="p-10 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">Membership Registration Form</h1>
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-[0.3em] mt-3 italic">Kalipunan ng Liping Pilipina (KALIPI) Nasyonal, INC.</p>
                    </div>

                    <div className="p-8 lg:p-12 space-y-16">
                        {/* SECTION I */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="bg-slate-900 dark:bg-blue-700 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">I. Personal Profile</span>
                                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10">
                                <div className="md:col-span-6 space-y-2">
                                    <Label className="uppercase text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 italic flex items-center gap-2"><ShieldCheck size={12} /> Full Name</Label>
                                    <Input required value={data.fullname} onChange={e => setData('fullname', e.target.value.toUpperCase())} className={`border-0 border-b-2 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 dark:text-white h-10 px-0 font-bold ${errors.fullname ? 'border-red-500' : ''}`} placeholder="LAST NAME, FIRST NAME, M.I." />
                                    {errors.fullname && <p className="text-red-500 text-[9px] font-black uppercase italic">{errors.fullname}</p>}
                                </div>
                                <div className="md:col-span-6 space-y-2">
                                    <Label className="uppercase text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 italic flex items-center gap-2"><MapPin size={12} /> Residential Address</Label>
                                    <Input required value={data.address} onChange={e => setData('address', e.target.value.toUpperCase())} className="border-0 border-b-2 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 dark:text-white h-10 px-0 font-bold" />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <Label className="uppercase text-[10px] font-black text-slate-400">Date of Birth</Label>
                                    <Input type="date" value={data.personal_data.dob} required onChange={e => setData('personal_data', { ...data.personal_data, dob: e.target.value })} className="border-0 border-b-2 rounded-none bg-transparent h-10 px-0 font-bold dark:text-white" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="uppercase text-[10px] font-black text-slate-400">Age</Label>
                                    <Input type="number" value={data.personal_data.age} onChange={e => setData('personal_data', { ...data.personal_data, age: e.target.value })} className="border-0 border-b-2 rounded-none bg-transparent h-10 px-0 font-bold dark:text-white" />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <Label className="uppercase text-[10px] font-black text-slate-400">Religion</Label>
                                    <Input value={data.personal_data.religion} onChange={e => setData('personal_data', { ...data.personal_data, religion: e.target.value.toUpperCase() })} className="border-0 border-b-2 rounded-none bg-transparent h-10 px-0 font-bold dark:text-white" />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <Label className="uppercase text-[10px] font-black text-slate-400">Civil Status</Label>
                                    <select value={data.personal_data.civil_status} className="w-full border-0 border-b-2 rounded-none bg-transparent focus:ring-0 h-10 font-bold uppercase text-xs dark:text-white" onChange={e => setData('personal_data', { ...data.personal_data, civil_status: e.target.value })}>
                                        <option value="">Select...</option><option>Single</option><option>Married</option><option>Widowed</option><option>Separated</option>
                                    </select>
                                </div>
                                <div className="md:col-span-6 space-y-2">
                                    <Label className="uppercase text-[10px] font-black text-blue-600">Sectoral Category (PWD / IP / Solo Parent)</Label>
                                    <Input value={data.personal_data.sectoral_category} placeholder="Indicate if applicable..." onChange={e => setData('personal_data', { ...data.personal_data, sectoral_category: e.target.value.toUpperCase() })} className="border-0 border-b-2 rounded-none h-10 px-0 font-bold dark:text-white" />
                                </div>
                                <div className="md:col-span-6 space-y-2">
                                    <Label className="uppercase text-[10px] font-black text-slate-400 flex items-center gap-2"><GraduationCap size={12} /> Highest Educational Attainment</Label>
                                    <Input value={data.personal_data.education} onChange={e => setData('personal_data', { ...data.personal_data, education: e.target.value.toUpperCase() })} className="border-0 border-b-2 rounded-none h-10 px-0 font-bold dark:text-white" />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <Label className="uppercase text-[10px] font-black text-slate-400 italic">Occupation</Label>
                                    <Input value={data.personal_data.occupation} onChange={e => setData('personal_data', { ...data.personal_data, occupation: e.target.value.toUpperCase() })} className="border-0 border-b-2 rounded-none h-10 px-0 font-bold dark:text-white" />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <Label className="uppercase text-[10px] font-black text-slate-400 italic">Monthly Income</Label>
                                    <Input type="number" value={data.personal_data.monthly_income} placeholder="0.00" onChange={e => setData('personal_data', { ...data.personal_data, monthly_income: e.target.value })} className="border-0 border-b-2 rounded-none h-10 px-0 font-bold dark:text-white" />
                                </div>
                                <div className="md:col-span-5 space-y-2">
                                    <Label className="uppercase text-[10px] font-black text-slate-400 italic">Skills / Hobbies</Label>
                                    <Input value={data.personal_data.skills} onChange={e => setData('personal_data', { ...data.personal_data, skills: e.target.value.toUpperCase() })} className="border-0 border-b-2 rounded-none h-10 px-0 font-bold dark:text-white" />
                                </div>
                            </div>

                            {/* Dynamic Custom Fields (Still needed for extra fields) */}
                            {/* We point this to 'submission_data' now to avoid conflict with hardcoded 'personal_data' */}
                            <DynamicFields
                                schema={organization.form_schema}
                                data={data.submission_data}
                                setData={(field, value) => setData('submission_data', { ...data.submission_data, [field]: value })}
                                errors={errors}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-sm border-l-4 border-slate-300">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2"><Briefcase size={12} /> Company Name</Label>
                                    <Input value={data.personal_data.company?.name} onChange={e => setData('personal_data', { ...data.personal_data, company: { ...data.personal_data.company, name: e.target.value.toUpperCase() } })} className="h-8 text-xs font-bold uppercase border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2"><MapPin size={12} /> Company Address</Label>
                                    <Input value={data.personal_data.company?.address} onChange={e => setData('personal_data', { ...data.personal_data, company: { ...data.personal_data.company, address: e.target.value.toUpperCase() } })} className="h-8 text-xs font-bold uppercase border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2"><Phone size={12} /> Telephone No.</Label>
                                    <Input value={data.personal_data.company?.tel} onChange={e => setData('personal_data', { ...data.personal_data, company: { ...data.personal_data.company, tel: e.target.value } })} className="h-8 text-xs font-bold border-slate-200" />
                                </div>
                            </div>
                        </section>

                        {/* SECTION II */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <span className="bg-slate-900 dark:bg-blue-700 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">II. Family Occupation</span>
                                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                                </div>
                                <Button type="button" onClick={addFamilyMember} variant="outline" className="border-2 border-slate-900 dark:border-slate-700 h-9 px-4 text-[9px] font-black uppercase hover:bg-slate-900 dark:hover:bg-slate-800 dark:text-white">
                                    <Plus className="w-3 h-3 mr-2" /> Add Relative
                                </Button>
                            </div>
                            <div className="border border-slate-200 dark:border-slate-800 rounded-sm overflow-x-auto shadow-sm bg-slate-50/30">
                                <table className="w-full text-[9px] font-bold uppercase tracking-tight">
                                    <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                                        <tr>
                                            <th className="p-4 text-left">Full Name</th>
                                            <th className="p-4 text-left w-16">Age</th>
                                            <th className="p-4 text-left">Relation</th>
                                            <th className="p-4 text-left">Education</th>
                                            <th className="p-4 text-left">Occupation</th>
                                            <th className="p-4 text-left">Income</th>
                                            <th className="p-4 text-left">Remarks</th>
                                            <th className="p-4 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {data.family_data.map((member: FamilyMember, index: number) => (
                                            <tr key={index} className="bg-white dark:bg-slate-900">
                                                <td className="p-2"><Input value={member.name} onChange={e => updateFamilyMember(index, 'name', e.target.value.toUpperCase())} className="h-8 text-[10px] border-none shadow-none dark:text-white bg-transparent" /></td>
                                                <td className="p-2"><Input type="number" value={member.age} onChange={e => updateFamilyMember(index, 'age', e.target.value)} className="h-8 text-[10px] border-none shadow-none dark:text-white bg-transparent" /></td>
                                                <td className="p-2"><Input value={member.relation} onChange={e => updateFamilyMember(index, 'relation', e.target.value.toUpperCase())} className="h-8 text-[10px] border-none shadow-none dark:text-white bg-transparent" /></td>
                                                <td className="p-2"><Input value={member.education} onChange={e => updateFamilyMember(index, 'education', e.target.value.toUpperCase())} className="h-8 text-[10px] border-none shadow-none dark:text-white bg-transparent" /></td>
                                                <td className="p-2"><Input value={member.occupation} onChange={e => updateFamilyMember(index, 'occupation', e.target.value.toUpperCase())} className="h-8 text-[10px] border-none shadow-none dark:text-white bg-transparent" /></td>
                                                <td className="p-2 w-20"><Input value={member.income} onChange={e => updateFamilyMember(index, 'income', e.target.value)} className="h-8 text-[10px] border-none shadow-none dark:text-white bg-transparent" placeholder="0" /></td>
                                                <td className="p-2"><Input value={member.remarks} onChange={e => updateFamilyMember(index, 'remarks', e.target.value.toUpperCase())} placeholder="PWD/IP/SOLO" className="h-8 text-[10px] border-none shadow-none dark:text-white bg-transparent" /></td>
                                                <td className="p-2 text-center">
                                                    <button type="button" onClick={() => removeFamilyMember(index)} className="text-slate-300 hover:text-red-600 transition-colors p-1"><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* FOOTER ACTIONS */}
                        <div className="p-8 lg:p-12 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-center gap-4 bg-slate-50/50 dark:bg-slate-800/20">
                            <Button type="submit" disabled={processing} className="w-full lg:w-[350px] h-16 bg-blue-700 hover:bg-blue-800 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl">
                                {processing ? 'Finalizing...' : (isEditMode ? 'Update Application Record' : 'Authorize & Submit Form')}
                            </Button>
                            <Link href={backUrl} className="w-full lg:w-[200px]">
                                <Button type="button" variant="outline" className="w-full h-16 border-2 border-slate-200 dark:border-slate-700 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all">
                                    {isEditMode ? 'Cancel Edit' : 'Abandon Entry'}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}