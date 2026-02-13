import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronUp, ChevronDown, ListChecks, Settings2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FormBuilderProps {
    schema: any[];
    onSchemaChange: (newSchema: any[]) => void;
}

export default function FormBuilder({ schema, onSchemaChange }: FormBuilderProps) {

    const addFormField = (type: string) => {
        const newField = {
            id: `field_${Date.now()}`,
            type,
            label: 'New Question',
            required: false,
            options: type === 'select' || type === 'radio' ? ['Option 1'] : [],
            columns: type === 'table' ? [{ name: 'Name', type: 'text' }, { name: 'Age', type: 'number' }] : [],
            width: 'w-full'
        };
        onSchemaChange([...(schema || []), newField]);
    };

    const updateFormField = (index: number, key: string, value: any) => {
        const updatedSchema = [...(schema || [])];
        updatedSchema[index] = { ...updatedSchema[index], [key]: value };
        onSchemaChange(updatedSchema);
    };

    const removeFormField = (index: number) => {
        const updatedSchema = [...(schema || [])];
        updatedSchema.splice(index, 1);
        onSchemaChange(updatedSchema);
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
        const updatedSchema = [...(schema || [])];
        if (direction === 'up' && index > 0) {
            [updatedSchema[index], updatedSchema[index - 1]] = [updatedSchema[index - 1], updatedSchema[index]];
        } else if (direction === 'down' && index < updatedSchema.length - 1) {
            [updatedSchema[index], updatedSchema[index + 1]] = [updatedSchema[index + 1], updatedSchema[index]];
        }
        onSchemaChange(updatedSchema);
    };

    const addOption = (fieldIndex: number) => {
        const updatedSchema = [...(schema || [])];
        updatedSchema[fieldIndex].options.push(`Option ${updatedSchema[fieldIndex].options.length + 1}`);
        onSchemaChange(updatedSchema);
    };

    const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
        const updatedSchema = [...(schema || [])];
        updatedSchema[fieldIndex].options[optionIndex] = value;
        onSchemaChange(updatedSchema);
    };

    const removeOption = (fieldIndex: number, optionIndex: number) => {
        const updatedSchema = [...(schema || [])];
        updatedSchema[fieldIndex].options.splice(optionIndex, 1);
        onSchemaChange(updatedSchema);
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sticky top-0 bg-neutral-100 dark:bg-neutral-950 py-4 z-10 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                    <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-wide">Builder Mode</h3>
                    <p className="text-xs text-neutral-500">Design your questionnaire structure.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end max-w-[500px] mt-4 sm:mt-0">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 self-center mr-2">Add Field:</span>
                    {['section', 'text', 'email', 'number', 'textarea', 'select', 'checkbox', 'checkbox_group', 'repeater'].map(type => (
                        <Button
                            key={type}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addFormField(type)}
                            className="text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-colors border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                        >
                            + {type}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Field List */}
            {schema && schema.length > 0 ? (
                <Accordion type="multiple" className="space-y-4">
                    {schema.map((field: any, index: number) => (
                        <AccordionItem value={`item-${index}`} key={index} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative group hover:border-blue-400 transition-all hover:shadow-md px-0">
                            <div className="flex items-center gap-4 p-4 pr-16 bg-neutral-50/50 dark:bg-neutral-900/50 rounded-t-xl">
                                <Badge variant="outline" className="text-[10px] font-mono bg-white h-6 w-6 flex items-center justify-center shrink-0 shadow-sm">{index + 1}</Badge>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm truncate">{field.label || 'New Question'}</span>
                                        <Badge variant="secondary" className="text-[9px] uppercase tracking-wider">{field.type}</Badge>
                                        {field.required && <Badge className="bg-red-100 text-red-600 border-red-200 text-[9px] uppercase">Required</Badge>}
                                    </div>
                                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                                        Width: {field.width || 'Full Info'}
                                    </p>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex flex-col gap-1 absolute right-14 top-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); moveField(index, 'up'); }} disabled={index === 0}>
                                        <ChevronUp size={14} />
                                    </Button>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); moveField(index, 'down'); }} disabled={index === schema.length - 1}>
                                        <ChevronDown size={14} />
                                    </Button>
                                </div>

                                <AccordionTrigger className="hover:no-underline absolute right-4 top-4 p-2 bg-neutral-100 rounded-md">
                                    <Settings2 size={16} className="text-neutral-500" />
                                </AccordionTrigger>
                            </div>

                            <AccordionContent className="p-6 border-t border-neutral-100 dark:border-neutral-800">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-neutral-400">Label</Label>
                                            <Input
                                                value={field.label}
                                                onChange={e => updateFormField(index, 'label', e.target.value)}
                                                className="font-bold border-neutral-200"
                                                placeholder="Question"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-neutral-400">Type</Label>
                                            <Select value={field.type} onValueChange={(val) => updateFormField(index, 'type', val)}>
                                                <SelectTrigger className="font-bold"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="section">Section Header</SelectItem>
                                                    <SelectItem value="text">Text Input</SelectItem>
                                                    <SelectItem value="email">Email Address</SelectItem>
                                                    <SelectItem value="number">Number</SelectItem>
                                                    <SelectItem value="textarea">Long Text</SelectItem>
                                                    <SelectItem value="select">Dropdown</SelectItem>
                                                    <SelectItem value="radio">Radio Buttons</SelectItem>
                                                    <SelectItem value="checkbox">Checkbox (Yes/No)</SelectItem>
                                                    <SelectItem value="checkbox_group">Checkbox Group</SelectItem>
                                                    <SelectItem value="repeater">Repeater Group</SelectItem>
                                                    <SelectItem value="file">File Upload</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Specific Configs (Options/Columns) */}
                                    {(field.type === 'select' || field.type === 'radio') && (
                                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded text-sm">
                                            <Label className="text-[10px] font-bold uppercase text-indigo-500 mb-2 block">Options</Label>
                                            <div className="space-y-2">
                                                {field.options && field.options.map((option: string, optIndex: number) => (
                                                    <div key={optIndex} className="flex gap-2">
                                                        <Input value={option} onChange={e => updateOption(index, optIndex, e.target.value)} className="h-8 bg-white" />
                                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index, optIndex)}><Trash2 size={12} className="text-red-400" /></Button>
                                                    </div>
                                                ))}
                                                <Button type="button" variant="link" size="sm" onClick={() => addOption(index)} className="text-[10px] h-auto p-0 text-indigo-600">+ Add Option</Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Repeater Config */}
                                    {field.type === 'repeater' && (
                                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded text-sm">
                                            <Label className="text-[10px] font-bold uppercase text-orange-500 mb-2 block">Repeater Fields</Label>
                                            <p className="text-[10px] text-neutral-400 mb-2">Define the fields inside this repeater.</p>

                                            {/* Reuse FormBuilder recursively or simplified list? 
                                                Recursive is complex. Let's do a simplified column definer for now, similar to table columns. 
                                                Actually, the Seeder uses 'schema' for repeaters. Let's map 'columns' in UI to 'schema' for repeater.
                                            */}
                                            <div className="space-y-2">
                                                {(field.schema || field.columns || []).map((col: any, colIndex: number) => (
                                                    <div key={colIndex} className="flex gap-2">
                                                        <Input value={col.label} onChange={e => {
                                                            const newSchema = [...(field.schema || field.columns || [])];
                                                            newSchema[colIndex] = { ...newSchema[colIndex], label: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, '_') };
                                                            updateFormField(index, 'schema', newSchema);
                                                        }} placeholder="Field Label" className="h-8 bg-white" />

                                                        <Select value={col.type} onValueChange={val => {
                                                            const newSchema = [...(field.schema || field.columns || [])];
                                                            newSchema[colIndex] = { ...newSchema[colIndex], type: val };
                                                            updateFormField(index, 'schema', newSchema);
                                                        }}>
                                                            <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="text">Text</SelectItem>
                                                                <SelectItem value="date">Date</SelectItem>
                                                                <SelectItem value="select">Select</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <Button type="button" variant="ghost" size="sm" onClick={() => {
                                                            const newSchema = (field.schema || field.columns).filter((_: any, i: number) => i !== colIndex);
                                                            updateFormField(index, 'schema', newSchema);
                                                        }}><Trash2 size={12} className="text-red-400" /></Button>
                                                    </div>
                                                ))}
                                                <Button type="button" variant="link" size="sm" onClick={() => {
                                                    const newSchema = [...(field.schema || field.columns || []), { id: 'new_field', label: 'New Field', type: 'text', width: 'w-1/4' }];
                                                    updateFormField(index, 'schema', newSchema);
                                                }} className="text-[10px] h-auto p-0 text-orange-600">+ Add Repeater Field</Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* VISIBILITY LOGIC EDITOR */}
                                    <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded border border-dashed border-neutral-300 dark:border-neutral-700">
                                        <Label className="text-[10px] font-bold uppercase text-neutral-500 mb-2 block flex items-center gap-2">
                                            <Settings2 size={10} /> Visibility Logic
                                        </Label>

                                        {!field.visible_if ? (
                                            <Button type="button" variant="outline" size="sm" className="text-[10px] h-6" onClick={() => updateFormField(index, 'visible_if', ['', 'eq', ''])}>
                                                + Add Condition
                                            </Button>
                                        ) : (
                                            <div className="flex gap-2 items-center">
                                                <span className="text-[10px] font-bold text-neutral-400">IF</span>
                                                <Input
                                                    value={field.visible_if[0]}
                                                    onChange={e => {
                                                        const newRule = [...field.visible_if];
                                                        newRule[0] = e.target.value;
                                                        updateFormField(index, 'visible_if', newRule);
                                                    }}
                                                    placeholder="Field ID (e.g. classification)"
                                                    className="h-7 text-xs w-32 bg-white"
                                                />
                                                <Select value={field.visible_if[1]} onValueChange={val => {
                                                    const newRule = [...field.visible_if];
                                                    newRule[1] = val;
                                                    updateFormField(index, 'visible_if', newRule);
                                                }}>
                                                    <SelectTrigger className="h-7 w-20 text-xs bg-white"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="eq">Equals</SelectItem>
                                                        <SelectItem value="neq">Not Equals</SelectItem>
                                                        <SelectItem value="in">In</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    value={field.visible_if[2]}
                                                    onChange={e => {
                                                        const newRule = [...field.visible_if];
                                                        newRule[2] = e.target.value;
                                                        updateFormField(index, 'visible_if', newRule);
                                                    }}
                                                    placeholder="Value (e.g. Rape Victim)"
                                                    className="h-7 text-xs w-32 bg-white"
                                                />
                                                <Button type="button" variant="ghost" size="sm" onClick={() => updateFormField(index, 'visible_if', null)}>
                                                    <Trash2 size={12} className="text-red-400" />
                                                </Button>
                                            </div>
                                        )}
                                        <p className="text-[9px] text-neutral-400 mt-2">
                                            * Enter the <b>ID</b> of the controlling field (e.g., 'classification') and the value to match.
                                        </p>
                                    </div>

                                    <div className="flex gap-4 pt-2">
                                        <div className="w-1/2">
                                            <Label className="text-[10px] font-bold uppercase text-neutral-400">Width</Label>
                                            <Select value={field.width || 'w-full'} onValueChange={(val) => updateFormField(index, 'width', val)}>
                                                <SelectTrigger className="h-8 text-xs bg-neutral-50"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="w-full">Full Row</SelectItem>
                                                    <SelectItem value="w-1/2">1/2 Row</SelectItem>
                                                    <SelectItem value="w-1/3">1/3 Row</SelectItem>
                                                    <SelectItem value="w-1/4">1/4 Row</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer mt-4">
                                            <input type="checkbox" checked={field.required} onChange={e => updateFormField(index, 'required', e.target.checked)} className="rounded text-blue-600 focus:ring-blue-600" />
                                            <span className="text-[10px] font-bold uppercase text-neutral-500">Required</span>
                                        </label>
                                    </div>

                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeFormField(index)} className="w-full mt-4 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
                                        <Trash2 size={14} className="mr-2" /> Delete Field
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <div className="text-center py-16 border-2 border-dashed border-neutral-300 rounded-xl">
                    <p className="text-neutral-400 font-bold">Start adding fields to see them here.</p>
                </div>
            )}
        </div>
    );
}
