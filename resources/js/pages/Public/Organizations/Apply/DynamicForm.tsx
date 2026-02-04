import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FormField {
    label: string;
    type: 'text' | 'number' | 'date' | 'textarea' | 'checkbox' | 'select';
    required: boolean;
    options?: string[]; // For select or radio
}

interface DynamicFormProps {
    schema: FormField[];
    data: any;
    setData: (field: string, value: any) => void;
    errors: any;
}

export default function DynamicForm({ schema, data, setData, errors }: DynamicFormProps) {
    if (!schema || schema.length === 0) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-t border-dashed my-8"></div>
            <h3 className="font-black uppercase text-slate-400 tracking-widest text-sm mb-6">Additional Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schema.map((field, index) => {
                    const fieldId = `custom_${index}`;
                    const fieldName = field.label; // In a real app, you might want a stable slug

                    // Helper to update generic 'personal_data' state
                    // We assume 'data' passed here is a nested object or we update parent
                    // Actually, the best way for the parent to handle this is if 'data' IS the personal_data object
                    // But usually inertia form data is flat. 
                    // Let's assume the parent passes a specific handler or we stick with `setData('personal_data', { ...personal_data, [label]: val })`
                    // But here we are passed generic setData.

                    // PROPOSAL: The parent should pass a handler `onFieldChange(label, value)`
                    // Or we assume `data` is the "personal_data" object itself.
                    // Let's assume `data` Prop is the `personal_data` JSON object from the parent form.

                    const value = data[field.label] || '';
                    const error = errors[`personal_data.${field.label}`];

                    // CHECKBOX
                    if (field.type === 'checkbox') {
                        return (
                            <div key={index} className="md:col-span-2 flex items-start space-x-3 p-4 border rounded-sm bg-slate-50 dark:bg-slate-900/50">
                                <Checkbox
                                    id={fieldId}
                                    checked={!!value}
                                    onCheckedChange={(checked) => setData(field.label, checked)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor={fieldId} className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </Label>
                                </div>
                                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                            </div>
                        );
                    }

                    // DATE PICKER
                    if (field.type === 'date') {
                        return (
                            <div key={index} className="space-y-2 flex flex-col">
                                <Label className="text-xs font-bold uppercase text-slate-500">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal border-slate-300 h-11",
                                                !value && "text-muted-foreground"
                                            )}
                                        >
                                            {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={value ? new Date(value) : undefined}
                                            onSelect={(date: Date | undefined) => setData(field.label, date ? format(date, 'yyyy-MM-dd') : '')}
                                            disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {error && <p className="text-red-500 text-xs">{error}</p>}
                            </div>
                        );
                    }

                    // TEXTAREA
                    if (field.type === 'textarea') {
                        return (
                            <div key={index} className="md:col-span-2 space-y-2">
                                <Label htmlFor={fieldId} className="text-xs font-bold uppercase text-slate-500">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </Label>
                                <Textarea
                                    id={fieldId}
                                    value={value}
                                    onChange={(e) => setData(field.label, e.target.value)}
                                    className="resize-none min-h-[100px] border-slate-300"
                                />
                                {error && <p className="text-red-500 text-xs">{error}</p>}
                            </div>
                        );
                    }

                    // DEFAULT (Text/Number)
                    return (
                        <div key={index} className="space-y-2">
                            <Label htmlFor={fieldId} className="text-xs font-bold uppercase text-slate-500">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </Label>
                            <Input
                                id={fieldId}
                                type={field.type}
                                value={value}
                                onChange={(e) => setData(field.label, e.target.value)}
                                required={field.required}
                                className="h-11 border-slate-300 focus:border-blue-600 focus:ring-blue-600 rounded-sm"
                            />
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
