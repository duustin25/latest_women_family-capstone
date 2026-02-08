import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface LivePaperPreviewProps {
    data: {
        name: string;
        president_name: string;
        form_schema: any[];
    };
}

export default function LivePaperPreview({ data }: LivePaperPreviewProps) {
    return (
        <div className="xl:w-[8.5in] xl:shrink-0 sticky top-8 hidden xl:block">
            <div className="bg-neutral-800 text-white p-3 rounded-t-lg flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14} /> Live Official Form Preview
                    </h3>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-[9px] animate-pulse">
                        LIVE BUILDER MODE
                    </Badge>
                </div>
                <Badge className="bg-green-500 text-black font-bold text-[10px]">AUTO-GENERATED</Badge>
            </div>

            {/* PAPER COMPONENT */}
            <div className="bg-white text-black font-serif p-8 md:p-12 shadow-2xl min-h-[11in] text-[12px] relative origin-top-left transform scale-[0.85] w-[calc(100%/0.85)] md:transform-none md:w-auto xl:transform xl:scale-[0.85] xl:w-[calc(100%/0.85)]">
                {/* Header */}
                <header className="text-center mb-8 border-b-2 border-black pb-6">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <img src="/Logo/women&family_logo.png" className="h-16 w-auto" />
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold">Republic of the Philippines</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold">City of Pasay</p>
                            <h1 className="text-lg font-black uppercase tracking-widest mt-1">Barangay 183 Villamor</h1>
                        </div>
                        <div className="h-16 w-16"></div>
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight">{data.name || 'ORGANIZATION NAME'}</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest border border-black inline-block px-4 py-1 mt-2">
                        Official Membership Application Form
                    </p>
                </header>

                {/* Generic Info */}
                <section className="mb-6 opacity-60">
                    <h3 className="text-xs font-bold uppercase border-b border-black mb-4 pb-1">I. Applicant Information</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div><p className="text-[10px] font-bold uppercase text-gray-500">Full Name</p><div className="border-b border-gray-300 h-6"></div></div>
                        <div><p className="text-[10px] font-bold uppercase text-gray-500">Date Filed</p><div className="border-b border-gray-300 h-6"></div></div>
                        <div className="col-span-2"><p className="text-[10px] font-bold uppercase text-gray-500">Address</p><div className="border-b border-gray-300 h-6"></div></div>
                    </div>
                </section>

                {/* Dynamic Fields Preview */}
                <section className="mb-12">
                    <h3 className="text-xs font-bold uppercase border-b border-black mb-4 pb-1">II. Questionnaire Responses</h3>
                    {data.form_schema && data.form_schema.length > 0 ? (
                        <div className="flex flex-wrap gap-x-6 gap-y-6">
                            {data.form_schema.map((field: any, index: number) => (
                                <div
                                    key={index}
                                    className={`break-inside-avoid ${field.width === 'w-1/2' ? 'w-[calc(50%-12px)]' : field.width === 'w-1/3' ? 'w-[calc(33.33%-16px)]' : field.width === 'w-1/4' ? 'w-[calc(25%-18px)]' : 'w-full'}`}
                                >
                                    <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">
                                        {index + 1}. {field.label}
                                    </p>

                                    {field.type === 'table' ? (
                                        <div className="border border-black mt-2">
                                            <table className="w-full text-[10px]">
                                                <thead>
                                                    <tr className="border-b border-black bg-gray-100">
                                                        {field.columns?.map((col: any, cIdx: number) => (
                                                            <th key={cIdx} className="px-2 py-1 text-left border-r border-black last:border-r-0">
                                                                {col.name || 'Col'}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={field.columns?.length || 1} className="px-2 py-4 text-center italic text-gray-400">
                                                            (Space for entries...)
                                                        </td>
                                                    </tr>
                                                    {[1, 2, 3].map(r => (
                                                        <tr key={r} className="border-b border-black/20 h-6"><td colSpan={field.columns?.length || 1}></td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="border-b border-gray-300 pb-1 min-h-[1.5em] bg-gray-50/50"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="italic text-gray-400 text-center py-10">Use the builder to add questions...</p>
                    )}
                </section>

                <div className="mt-auto pt-8">
                    <p className="text-[10px] italic text-justify leading-relaxed opacity-70">
                        I hereby certify that the information provided is true and correct...
                    </p>
                    <div className="grid grid-cols-2 gap-12 mt-16 text-center opacity-70">
                        <div><div className="border-b border-black w-full mb-2"></div><p className="text-[9px] font-bold uppercase">Signature of Applicant</p></div>
                        <div><div className="border-b border-black w-full mb-2"></div><p className="text-[9px] font-bold uppercase">Approved By: {data.president_name}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
