import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DynamicFieldsProps {
    schema: any[];
    data: any;
    setData: (fieldId: string, value: any) => void;
    errors?: any;
}

export default function DynamicFields({ schema, data, setData, errors }: DynamicFieldsProps) {

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
                            value={data[field.id] || ''}
                            onChange={(e) => setData(field.id, e.target.value)}
                            className="font-semibold"
                            placeholder={`Enter ${field.label}...`}
                        />
                        {errors && errors[`submission_data.${field.id}`] && <p className="text-red-500 text-xs">{errors[`submission_data.${field.id}`]}</p>}
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
                            value={data[field.id] || ''}
                            onChange={(e) => setData(field.id, e.target.value)}
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
                        <Select value={data[field.id]} onValueChange={(val: string) => setData(field.id, val)} required={field.required}>
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
                        <RadioGroup value={data[field.id]} onValueChange={(val: string) => setData(field.id, val)} required={field.required}>
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
                                checked={!!data[field.id]}
                                onChange={(e) => setData(field.id, e.target.checked)}
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
                                    {(data[field.id] || []).map((row: any, rowIndex: number) => (
                                        <tr key={rowIndex} className="bg-white dark:bg-neutral-900">
                                            {field.columns?.map((col: any, colIndex: number) => (
                                                <td key={colIndex} className="p-2">
                                                    <Input
                                                        value={row[col.name] || ''}
                                                        onChange={(e) => {
                                                            const newRows = [...(data[field.id] || [])];
                                                            newRows[rowIndex] = { ...newRows[rowIndex], [col.name]: e.target.value };
                                                            setData(field.id, newRows);
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
                                                        const newRows = (data[field.id] || []).filter((_: any, i: number) => i !== rowIndex);
                                                        setData(field.id, newRows);
                                                    }}
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <ArrowLeft className="w-4 h-4 rotate-45" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data[field.id] || data[field.id].length === 0) && (
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
                                        const newRows = [...(data[field.id] || []), {}];
                                        setData(field.id, newRows);
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

    if (!schema || schema.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-x-6 gap-y-6">
            {schema.map((field: any) => renderField(field))}
        </div>
    );
}
