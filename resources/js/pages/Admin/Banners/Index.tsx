import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function BannerIndex({ banners }: { banners: any[] }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this banner?')) {
            destroy(`/admin/banners/${id}`, {
                onSuccess: () => toast.success('Banner deleted successfully'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Banners', href: '#' }]}>
            <Head title="Manage Banners" />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Homepage Banners</h1>
                    <p className="text-sm text-slate-500">Manage the sliding images on the public welcome page.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/banners/create">
                        <Plus className="w-4 h-4 mr-2" /> Add Banner
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Order</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {banners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                    No banners found. Create one to show on the homepage.
                                </TableCell>
                            </TableRow>
                        ) : (
                            banners.map((banner) => (
                                <TableRow key={banner.id}>
                                    <TableCell className="font-medium">{banner.order_index}</TableCell>
                                    <TableCell>
                                        <div className="relative w-32 h-16 rounded overflow-hidden bg-slate-100 border">
                                            <img 
                                                src={`/storage/${banner.image_path}`} 
                                                alt={banner.title || 'Banner'} 
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{banner.title || <span className="text-slate-400 italic">No title</span>}</div>
                                        {banner.link_url && (
                                            <div className="text-xs text-blue-500 truncate max-w-[200px] mt-1">
                                                <a href={banner.link_url} target="_blank" rel="noreferrer">{banner.link_url}</a>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {banner.is_active ? (
                                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-slate-500">
                                                <XCircle className="w-3 h-3 mr-1" /> Inactive
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/banners/${banner.id}/edit`}>
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(banner.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
