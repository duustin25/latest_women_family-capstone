import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import React from "react";

interface DynamicFieldsProps {
    schema: any[];
    data: any;
    setData: (fieldId: string, value: any) => void;
    errors?: any;
    mode?: 'edit' | 'view';
}

export default function DynamicFields({ schema, data, setData, errors, mode = 'edit' }: DynamicFieldsProps) {

    const checkVisibility = (field: any) => {
        if (!field.visible_if) return true;

        // Helper to check a single condition
        const checkCondition = (condition: any[]) => {
            const [targetField, operator, value] = condition;
            const targetValue = data[targetField];

            switch (operator) {
                case 'eq': return targetValue === value;
                case 'neq': return targetValue !== value;
                case 'in': return Array.isArray(value) && value.includes(targetValue);
                case 'contains': return Array.isArray(targetValue) && targetValue.includes(value);
                // null/not_null checks
                case 'present': return targetValue !== null && targetValue !== '' && targetValue !== undefined;
                default: return true;
            }
        };

        // If it's a simple array [field, op, val]
        if (typeof field.visible_if[0] === 'string') {
            return checkCondition(field.visible_if);
        }

        // If it's an array of arrays [[field, op, val], [field, op, val]] (AND logic)
        if (Array.isArray(field.visible_if[0])) {
            return field.visible_if.every((condition: any[]) => checkCondition(condition));
        }

        return true;
    };

    const renderField = (field: any) => {
        if (!checkVisibility(field)) return null;

        const widthClass = field.width === 'w-1/2' ? 'w-[calc(50%-12px)]' :
            field.width === 'w-1/3' ? 'w-[calc(33.33%-16px)]' :
                field.width === 'w-1/4' ? 'w-[calc(25%-18px)]' :
                    field.width === 'w-1/6' ? 'w-[calc(16.66%-20px)]' :
                        'w-full';

        // View Mode Renderer helper
        const renderViewModeValue = (value: any, isInline: boolean) => (
            <div className={`font-bold text-sm border-b border-black min-h-[1.5em] break-words whitespace-pre-wrap ${isInline ? 'flex-1' : 'w-full'}`}>
                {value || ''}
            </div>
        );

        switch (field.type) {
            case 'section':
                return (
                    <div key={field.id || field.label} className="w-full pt-6 pb-2 border-b border-neutral-200 dark:border-neutral-800 mb-4 mt-2">
                        <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">{field.label}</h3>
                    </div>
                );

            case 'text':
            case 'email':
            case 'number':
            case 'date':
                const isInline = field.layout !== 'block'; // Default to inline
                return (
                    <div key={field.id} className={`${widthClass} ${isInline ? 'flex items-end gap-2' : 'space-y-1'}`}>
                        <Label htmlFor={field.id} className={`text-[10pt] font-bold uppercase text-black dark:text-neutral-400 ${isInline ? 'shrink-0 mb-1' : ''}`}>
                            {field.label} {field.required && mode === 'edit' && <span className="text-red-500">*</span>}
                            {isInline && ":"}
                        </Label>
                        {mode === 'view' ? (
                            renderViewModeValue(data[field.id], isInline)
                        ) : (
                            <Input
                                id={field.id}
                                type={field.type}
                                required={field.required}
                                value={data[field.id] || ''}
                                onChange={(e) => setData(field.id, e.target.value)}
                                className={`font-bold text-sm border-0 border-b border-black rounded-none shadow-none focus-visible:ring-0 px-0 bg-transparent ${isInline ? 'flex-1' : ''}`}
                                placeholder={field.type === 'date' ? '' : `Enter ${field.label}...`}
                            />
                        )}
                        {errors && errors[`submission_data.${field.id}`] && <p className="text-red-500 text-xs">{errors[`submission_data.${field.id}`]}</p>}
                    </div>
                );

            case 'textarea':
                return (
                    <div key={field.id} className={`space-y-2 ${widthClass}`}>
                        <Label htmlFor={field.id} className="text-[10pt] font-bold uppercase text-black dark:text-neutral-400">
                            {field.label} {field.required && mode === 'edit' && <span className="text-red-500">*</span>}
                        </Label>
                        {mode === 'view' ? (
                            renderViewModeValue(data[field.id], false) // Textarea is typically block, so isInline=false
                        ) : (
                            <Textarea
                                id={field.id}
                                required={field.required}
                                value={data[field.id] || ''}
                                onChange={(e) => setData(field.id, e.target.value)}
                                className="min-h-[80px] font-medium text-sm border-black rounded-none bg-transparent"
                                placeholder={`Enter ${field.label}...`}
                            />
                        )}
                    </div>
                );

            case 'select':
                const isSelectInline = field.layout !== 'block'; // Default to inline
                return (
                    <div key={field.id} className={`${widthClass} ${isSelectInline ? 'flex items-end gap-2' : 'space-y-2'}`}>
                        <Label htmlFor={field.id} className={`text-[10pt] font-bold uppercase text-black dark:text-neutral-400 ${isSelectInline ? 'shrink-0 mb-1' : ''}`}>
                            {field.label} {field.required && mode === 'edit' && <span className="text-red-500">*</span>}
                            {isSelectInline && ":"}
                        </Label>
                        {mode === 'view' ? (
                            renderViewModeValue(data[field.id], isSelectInline)
                        ) : (
                            <Select value={data[field.id]} onValueChange={(val: string) => setData(field.id, val)} required={field.required}>
                                <SelectTrigger className={`font-bold text-sm border-0 border-b border-black rounded-none shadow-none focus:ring-0 px-0 bg-transparent h-auto py-1 ${isSelectInline ? 'flex-1' : ''}`}>
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((opt: string, idx: number) => (
                                        <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                );

            case 'radio':
                return (
                    <div key={field.id} className={`space-y-3 ${widthClass}`}>
                        <Label className="text-[10pt] font-bold uppercase text-black dark:text-neutral-400">
                            {field.label} {field.required && mode === 'edit' && <span className="text-red-500">*</span>}
                        </Label>
                        <RadioGroup value={data[field.id]} onValueChange={(val: string) => mode === 'edit' && setData(field.id, val)} required={field.required} disabled={mode === 'view'}>
                            <div className={`flex flex-wrap gap-4 ${field.layout === 'block' ? 'flex-col' : ''}`}>
                                {field.options?.map((opt: string, idx: number) => (
                                    <div className="flex items-center space-x-2" key={idx}>
                                        <RadioGroupItem value={opt} id={`${field.id}-${idx}`} className="border-black text-black" />
                                        <Label htmlFor={`${field.id}-${idx}`} className="text-sm font-medium">{opt}</Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>
                );

            case 'checkbox': // Single checkbox (boolean)
                return (
                    <div key={field.id} className={`space-y-3 ${widthClass}`}>
                        <div className="flex items-center space-x-2 mt-6">
                            <Checkbox
                                id={field.id}
                                required={field.required}
                                checked={!!data[field.id]}
                                onCheckedChange={(checked) => mode === 'edit' && setData(field.id, checked)}
                                className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                                disabled={mode === 'view'}
                            />
                            <Label htmlFor={field.id} className="text-sm font-bold uppercase text-black dark:text-neutral-400 cursor-pointer">
                                {field.label} {field.required && mode === 'edit' && <span className="text-red-500">*</span>}
                            </Label>
                        </div>
                    </div>
                );

            case 'file':
                return (
                    <div key={field.id} className={`space-y-3 ${widthClass}`}>
                        <Label htmlFor={field.id} className="text-[10pt] font-bold uppercase text-black dark:text-neutral-400">
                            {field.label} {field.required && mode === 'edit' && <span className="text-red-500">*</span>}
                        </Label>
                        {mode === 'view' ? (
                            <div className="text-sm italic text-blue-600 underline">
                                {data[field.id]?.name || (typeof data[field.id] === 'string' ? 'View File' : 'No file uploaded')}
                            </div>
                        ) : (
                            <>
                                <Input
                                    id={field.id}
                                    type="file"
                                    required={field.required}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setData(field.id, e.target.files[0]);
                                        }
                                    }}
                                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-neutral-800 border-0 border-b border-black rounded-none"
                                />
                                <p className="text-[10px] text-neutral-400">Accepted: Images (JPG, PNG) or PDF. Max 5MB.</p>
                            </>
                        )}
                    </div>
                );

            case 'checkbox_group': // Multiple checkboxes (array of strings)
                return (
                    <div key={field.id} className={`space-y-3 ${widthClass}`}>
                        <Label className="text-[10pt] font-bold uppercase text-black dark:text-neutral-400">
                            {field.label} {field.required && mode === 'edit' && <span className="text-red-500">*</span>}
                        </Label>
                        <div className={`flex flex-wrap gap-4 border rounded-none p-4 border-black/10 ${field.layout === 'block' ? 'flex-col' : ''}`}>
                            {field.options?.map((opt: string, idx: number) => {
                                const currentValues = Array.isArray(data[field.id]) ? data[field.id] : [];
                                const isChecked = currentValues.includes(opt);
                                return (
                                    <div className="flex items-start space-x-2" key={idx}>
                                        <Checkbox
                                            id={`${field.id}-${idx}`}
                                            checked={isChecked}
                                            onCheckedChange={(checked) => {
                                                if (mode === 'view') return;
                                                const newValues = checked
                                                    ? [...currentValues, opt]
                                                    : currentValues.filter((v: string) => v !== opt);
                                                setData(field.id, newValues);
                                            }}
                                            className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                                            disabled={mode === 'view'}
                                        />
                                        <Label htmlFor={`${field.id}-${idx}`} className="text-sm font-medium leading-none cursor-pointer pt-0.5">
                                            {opt}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'repeater':
                // Repeater logic: renders a list of items, each using the schema defined in field.schema
                const items = Array.isArray(data[field.id]) ? data[field.id] : [];
                return (
                    <div key={field.id} className={`${widthClass} space-y-4 pt-4`}>
                        <div className="flex items-center justify-between pb-2">
                            <Label className="text-[10pt] font-bold uppercase text-black dark:text-neutral-400">
                                {field.label}
                            </Label>
                            {mode === 'edit' && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setData(field.id, [...items, {}]);
                                    }}
                                    className="h-6 text-[9px] font-black uppercase tracking-widest border border-black rounded-none hover:bg-black hover:text-white transition-colors no-print"
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Add {field.label}
                                </Button>
                            )}
                        </div>

                        <div className="space-y-1">
                            {items.map((item: any, index: number) => (
                                <div key={index} className="relative py-2 border-b border-dashed border-gray-300 group">
                                    <div className="flex gap-2 items-start">
                                        <span className="font-bold text-xs pt-3">{index + 1}.</span>
                                        <div className="flex-1 flex flex-wrap gap-x-6 gap-y-2">
                                            {/* Recursive call for the items in the repeater */}
                                            <DynamicFields
                                                schema={field.schema}
                                                data={item}
                                                setData={(itemId: string, val: any) => {
                                                    const newItems = [...items];
                                                    newItems[index] = { ...newItems[index], [itemId]: val };
                                                    setData(field.id, newItems);
                                                }}
                                                errors={errors}
                                                mode={mode} // Pass mode down!
                                            />
                                        </div>
                                        {mode === 'edit' && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-neutral-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity self-center no-print"
                                                onClick={() => {
                                                    const newItems = items.filter((_: any, i: number) => i !== index);
                                                    setData(field.id, newItems);
                                                }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <div className="text-center py-4 border border-dashed border-gray-300 rounded-none text-neutral-400">
                                    <p className="text-xs font-medium uppercase italic">List is empty.</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!schema || schema.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-x-6 gap-y-6 w-full">
            {schema.map((field: any, index: number) => {
                const isInline = field.layout === 'inline'; // Default might be block in code, but builder defaults to inline now.
                // Actually, let's respect the field.layout property.

                // Render the field content
                const content = renderField(field);
                if (!content) return null;

                return (
                    <React.Fragment key={index}>
                        {field.start_row && <div className="basis-full h-0"></div>}
                        {content}
                    </React.Fragment>
                );
            })}
        </div>
    );
}