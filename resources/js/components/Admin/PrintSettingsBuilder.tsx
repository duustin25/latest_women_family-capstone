import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CopySlash, AlignCenter, AlignLeft, Image as ImageIcon, Type } from "lucide-react";

interface PrintSettingsBuilderProps {
    data: any;
    setData: (key: string, value: any) => void;
}

export default function PrintSettingsBuilder({ data, setData }: PrintSettingsBuilderProps) {
    const settings = data.print_settings || {
        form_title: 'APPLICATION',
        alignment: 'center',
        include_barangay_header: true,
        left_logo_url: '/Logo/barangay183LOGO.png',
        right_logo_url: '/Logo/women&family_logo.png',
    };

    const updateSetting = (key: string, value: any) => {
        setData('print_settings', { ...settings, [key]: value });
    };

    return (
        <div className="bg-white dark:bg-neutral-900 shadow-sm rounded-lg p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <CopySlash size={16} className="text-blue-600" /> Physical Print Layout Settings
            </h2>

            <div className="space-y-6">
                <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-2">
                        <Type size={14} /> Form Document Title
                    </Label>
                    <Input
                        value={settings.form_title || ''}
                        onChange={e => updateSetting('form_title', e.target.value)}
                        placeholder="e.g. APPLICATION FORM"
                        className="font-bold bg-neutral-50 dark:bg-neutral-950 font-mono focus:ring-blue-500"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">The main title printed at the top of the form.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-2">
                            <AlignCenter size={14} /> Header Alignment
                        </Label>
                        <Select value={settings.alignment || 'center'} onValueChange={val => updateSetting('alignment', val)}>
                            <SelectTrigger className="font-bold bg-neutral-50 dark:bg-neutral-950">
                                <SelectValue placeholder="Select alignment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="center"><div className="flex items-center gap-2 font-bold"><AlignCenter size={14} className="text-blue-600" /> Center Aligned</div></SelectItem>
                                <SelectItem value="left"><div className="flex items-center gap-2 font-bold"><AlignLeft size={14} className="text-blue-600" /> Left Aligned</div></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col justify-center bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-2">
                            Include Barangay Header Text?
                        </Label>
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={settings.include_barangay_header !== false}
                                onCheckedChange={val => updateSetting('include_barangay_header', val)}
                            />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${settings.include_barangay_header !== false ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}`}>
                                {settings.include_barangay_header !== false ? 'YES, INCLUDE TEXT' : 'NO, HIDDEN'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-2">
                            <ImageIcon size={14} /> Left Logo URL
                        </Label>
                        <Input
                            value={settings.left_logo_url ?? '/Logo/barangay183LOGO.png'}
                            onChange={e => updateSetting('left_logo_url', e.target.value)}
                            placeholder="/Logo/barangay183LOGO.png"
                            className="bg-neutral-50 dark:bg-neutral-950 text-xs font-mono"
                        />
                    </div>
                    <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-2">
                            <ImageIcon size={14} /> Right Logo URL
                        </Label>
                        <Input
                            value={settings.right_logo_url ?? '/Logo/women&family_logo.png'}
                            onChange={e => updateSetting('right_logo_url', e.target.value)}
                            placeholder="/Logo/women&family_logo.png"
                            className="bg-neutral-50 dark:bg-neutral-950 text-xs font-mono"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg text-[10px] text-blue-800 dark:text-blue-300 uppercase tracking-widest font-bold border-l-4 border-blue-500 flex gap-3 items-start">
                <CopySlash size={16} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">INFO: Changes here will be strictly applied to the printed physical paper format. The live paper preview will update immediately to reflect these formatting tweaks. Organization Admins can manage their print layouts without developer intervention!</p>
            </div>
        </div>
    );
}
