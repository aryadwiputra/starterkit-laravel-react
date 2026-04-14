import { Head, router } from '@inertiajs/react';
import { Download, FileIcon, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { destroy as destroyMedia, download as downloadMedia, index as mediaIndex, store as storeMedia } from '@/routes/media';
import { chunk, complete, destroy as destroyUpload, store as storeUpload } from '@/routes/media-uploads';
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
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const chunkingThreshold = useMemo(() => 10 * 1024 * 1024, []); // 10MB

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
                window.location.href = downloadMedia(asset.id).url;
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

                router.delete(destroyMedia(asset.id).url, { preserveScroll: true });
            },
        },
    ];

    async function uploadChunked(fileToUpload: File) {
        const csrf =
            document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

        const initRes = await fetch(storeUpload().url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
                Accept: 'application/json',
            },
            body: JSON.stringify({
                title: title || null,
                original_name: fileToUpload.name,
                mime_type: fileToUpload.type || null,
                size: fileToUpload.size,
            }),
        });

        if (!initRes.ok) {
            throw new Error(await initRes.text());
        }

        const init = (await initRes.json()) as {
            upload_id: string;
            chunk_size: number;
            total_chunks: number;
        };

        try {
            for (let index = 0; index < init.total_chunks; index++) {
                const start = index * init.chunk_size;
                const end = Math.min(fileToUpload.size, start + init.chunk_size);
                const blob = fileToUpload.slice(start, end);

                const form = new FormData();
                form.append('index', String(index));
                form.append('chunk', blob, fileToUpload.name);

                const chunkRes = await fetch(chunk(init.upload_id).url, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrf,
                        Accept: 'application/json',
                    },
                    body: form,
                });

                if (!chunkRes.ok) {
                    throw new Error(await chunkRes.text());
                }

                setProgress(Math.round(((index + 1) / init.total_chunks) * 100));
            }

            const completeRes = await fetch(complete(init.upload_id).url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                    Accept: 'application/json',
                },
                body: JSON.stringify({ title: title || null }),
            });

            if (!completeRes.ok) {
                throw new Error(await completeRes.text());
            }
        } catch (e) {
            await fetch(destroyUpload(init.upload_id).url, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrf,
                    Accept: 'application/json',
                },
            });

            throw e;
        }
    }

    async function handleUpload() {
        if (!file) {
            return;
        }

        setUploading(true);
        setUploadError(null);
        setProgress(null);

        try {
            if (file.size > chunkingThreshold) {
                await uploadChunked(file);
                router.get(mediaIndex().url, {}, { only: ['assets'], preserveScroll: true, preserveState: true });
            } else {
                let ok = true;
                await new Promise<void>((resolve) => {
                router.post(
                        storeMedia().url,
                        { title: title || null, file },
                        {
                            preserveScroll: true,
                            forceFormData: true,
                            onProgress: (event) => {
                                if (event?.percentage !== undefined) {
                                    setProgress(Math.round(event.percentage));
                                }
                            },
                            onError: (errors) => {
                                ok = false;
                                if (errors.file) {
                                    setUploadError(errors.file);
                                }
                            },
                            onFinish: () => resolve(),
                        },
                    );
                });

                if (!ok) {
                    return;
                }
            }

            setTitle('');
            setFile(null);
        } catch (e) {
            setUploadError(e instanceof Error ? e.message : String(e));
        } finally {
            setUploading(false);
            setTimeout(() => setProgress(null), 800);
        }
    }

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
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">{t('media.fields.title')}</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={t('media.fields.title_placeholder')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="file">{t('media.fields.file')}</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    disabled={uploading}
                                />
                                {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
                            </div>

                            {progress !== null && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>{t('media.upload.progress')}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <Button
                                type="button"
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                {file && file.size > chunkingThreshold ? t('media.upload.submit_large') : t('media.upload.submit')}
                            </Button>
                        </div>
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
                            routePrefix={mediaIndex().url}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
