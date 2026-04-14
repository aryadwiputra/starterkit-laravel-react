import { Head, router, Form } from '@inertiajs/react';
import { Download, FileIcon, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { Heading } from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type MediaAssetRow = {
    id: number;
    title: string | null;
    uploaded_by: { id: number; name: string } | null;
    file: {
        name: string;
        mime_type: string | null;
        size: number | null;
        url: string;
        thumb_url: string | null;
    } | null;
    created_at: string;
};

type Props = {
    assets: PaginatedData<MediaAssetRow>;
};

export default function MediaIndex({ assets }: Props) {
    const { t } = useTranslation();

    const columns: DataTableColumn<MediaAssetRow>[] = [
        {
            key: 'file',
            label: t('media.table.preview'),
            sortable: false,
            render: (asset) => {
                const isImage = Boolean(asset.file?.thumb_url);

                return (
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                            {isImage ? (
                                <img
                                    src={asset.file?.thumb_url || ''}
                                    alt={asset.title || asset.file?.name || ''}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    <FileIcon className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="truncate font-medium">
                                {asset.title || asset.file?.name || `#${asset.id}`}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                                {asset.file?.mime_type || t('media.table.unknown_type')}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'uploaded_by',
            label: t('media.table.uploaded_by'),
            sortable: false,
            render: (asset) => (
                <span className="text-muted-foreground">
                    {asset.uploaded_by?.name || t('media.table.unknown_user')}
                </span>
            ),
        },
        {
            key: 'created_at',
            label: t('common.created'),
            sortable: true,
            render: (asset) => (
                <span className="text-muted-foreground">
                    {new Date(asset.created_at).toLocaleDateString()}
                </span>
            ),
        },
    ];

    const rowActions: RowAction<MediaAssetRow>[] = [
        {
            key: 'download',
            label: t('media.actions.download'),
            icon: <Download className="h-4 w-4" />,
            onClick: (asset) => {
                window.location.href = `/media/${asset.id}/download`;
            },
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (asset) => {
                if (!confirm(t('media.confirm_delete'))) {
                    return;
                }

                router.delete(`/media/${asset.id}`, { preserveScroll: true });
            },
        },
    ];

    return (
        <>
            <Head title={t('media.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading title={t('media.title')} description={t('media.description')} />

                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>{t('media.upload.title')}</CardTitle>
                        <CardDescription>{t('media.upload.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action="/media"
                            method="post"
                            encType="multipart/form-data"
                            className="space-y-4"
                            options={{ preserveScroll: true }}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">{t('media.fields.title')}</Label>
                                        <Input id="title" name="title" placeholder={t('media.fields.title_placeholder')} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="file">{t('media.fields.file')}</Label>
                                        <Input id="file" name="file" type="file" />
                                        {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                                    </div>

                                    <Button type="submit" disabled={processing} className="gap-2">
                                        <Upload className="h-4 w-4" />
                                        {t('media.upload.submit')}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-0.5">
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    {t('media.library.title')}
                                </CardTitle>
                                <CardDescription>{t('media.library.description')}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            tableId="media-assets"
                            data={assets}
                            columns={columns}
                            rowActions={rowActions}
                            searchable={false}
                            exportable={false}
                            routePrefix="/media"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

