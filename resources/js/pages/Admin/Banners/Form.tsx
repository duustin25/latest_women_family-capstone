import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BannerForm({ banner }: { banner?: any }) {
    const isEdit = !!banner;

    const { data, setData, post, processing, errors } = useForm({
        title: banner?.title || '',
        subtitle: banner?.subtitle || '',
        link_url: banner?.link_url || '',
        order_index: banner?.order_index || 0,
        is_active: banner?.is_active ?? true,
        image: null as File | null,
        _method: isEdit ? 'PUT' : 'POST', // For Laravel spoofing when uploading files
    });

    const [preview, setPreview] = useState<string | null>(banner?.image_path ? `/storage/${banner.image_path}` : null);

    // Handle image preview
    useEffect(() => {
        if (!data.image) return;
        const objectUrl = URL.createObjectURL(data.image);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [data.image]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // If editing, post to the update route with the spoofed PUT method
        const targetRoute = isEdit 
            ? `/admin/banners/${banner.id}`
            : `/admin/banners`;

        post(targetRoute, {
            forceFormData: true,
            preserveScroll: true,
            onError: (err) => {
                toast.error('Please check the form for errors');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Banners', href: '/admin/banners' }, { title: isEdit ? 'Edit Banner' : 'Create Banner', href: '#' }]}>
            <Head title={isEdit ? "Edit Banner" : "Create Banner"} />
            
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/banners">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{isEdit ? 'Edit Banner' : 'Create New Banner'}</h1>
                    <p className="text-sm text-slate-500">Configure what appears on the homepage slider.</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Banner Image (Required)</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-slate-50 transition-colors relative">
                            <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                            />
                            {preview ? (
                                <div className="space-y-4">
                                    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black/5 mx-auto">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">Click or drag to replace image</p>
                                </div>
                            ) : (
                                <div className="py-8 space-y-4">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Click to upload or drag and drop</p>
                                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 2MB. Recommended 1920x1080px.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title (Optional)</Label>
                            <Input 
                                id="title" 
                                value={data.title} 
                                onChange={e => setData('title', e.target.value)} 
                                placeholder="e.g. National Women's Month"
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>

                        {/* Subtitle */}
                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                            <Input 
                                id="subtitle" 
                                value={data.subtitle} 
                                onChange={e => setData('subtitle', e.target.value)} 
                                placeholder="e.g. March 2026"
                            />
                            {errors.subtitle && <p className="text-sm text-red-500">{errors.subtitle}</p>}
                        </div>

                        {/* Link URL */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="link_url">Redirect Link (Optional)</Label>
                            <Input 
                                id="link_url" 
                                type="url"
                                value={data.link_url} 
                                onChange={e => setData('link_url', e.target.value)} 
                                placeholder="https://example.com/womens-month"
                            />
                            <p className="text-xs text-slate-500">Where should users be redirected when they click this banner?</p>
                            {errors.link_url && <p className="text-sm text-red-500">{errors.link_url}</p>}
                        </div>

                         {/* Order Index */}
                         <div className="space-y-2">
                            <Label htmlFor="order_index">Display Order</Label>
                            <Input 
                                id="order_index" 
                                type="number"
                                value={data.order_index} 
                                onChange={e => setData('order_index', parseInt(e.target.value))} 
                            />
                            <p className="text-xs text-slate-500">Lower numbers appear first in the slider.</p>
                            {errors.order_index && <p className="text-sm text-red-500">{errors.order_index}</p>}
                        </div>

                        {/* Active Toggle */}
                        <div className="space-y-2 flex flex-col justify-center">
                            <Label className="mb-2">Visibility Status</Label>
                            <div className="flex items-center space-x-2">
                                <Switch 
                                    checked={data.is_active} 
                                    onCheckedChange={(checked) => setData('is_active', checked)} 
                                />
                                <Label className="font-normal cursor-pointer text-slate-600">
                                    {data.is_active ? 'Visible on homepage' : 'Hidden from homepage'}
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild disabled={processing}>
                            <Link href="/admin/banners">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Banner'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
