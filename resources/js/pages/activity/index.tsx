import { Head } from '@inertiajs/react';
import { Eye, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/use-translation';
import { index as activityIndex } from '@/routes/activity';
import { index as settingsIndex } from '@/routes/settings';
import type { DataTableColumn, DataTableFilter, PaginatedData, RowAction } from '@/types/datatable';

type ActivityRow = {
    id: number;
    log_name: string | null;
    event: string | null;
    description: string;
    subject: { type: string | null; id: number | null; label: string | null };
    causer: { id: number | null; label: string | null };
    properties: Record<string, unknown>;
    created_at: string;
};

type Props = {
    activities: PaginatedData<ActivityRow>;
    log_names: string[];
    events: string[];
};

function stringifyValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

export default function ActivityIndex({ activities, log_names, events }: Props) {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<ActivityRow | null>(null);

    const columns: DataTableColumn<ActivityRow>[] = [
        {
            key: 'description',
            label: t('activity.columns.description'),
            sortable: true,
            render: (activity) => (
                <div className="space-y-1">
                    <div className="font-medium">{activity.description}</div>
                    <div className="text-xs text-muted-foreground">
                        {activity.subject.label || activity.subject.type || '-'}
                    </div>
                </div>
            ),
        },
        {
            key: 'event',
            label: t('activity.columns.event'),
            sortable: true,
            render: (activity) => (
                <Badge variant={activity.event === 'deleted' ? 'destructive' : 'secondary'}>
                    {t(`activity.events.${activity.event || 'updated'}`)}
                </Badge>
            ),
        },
        {
            key: 'log_name',
            label: t('activity.columns.log'),
            sortable: true,
            render: (activity) => (
                <span className="text-muted-foreground">{activity.log_name || '-'}</span>
            ),
        },
        {
            key: 'causer',
            label: t('activity.columns.causer'),
            sortable: false,
            render: (activity) => (
                <span className="text-muted-foreground">{activity.causer.label || '-'}</span>
            ),
        },
        {
            key: 'created_at',
            label: t('activity.columns.created_at'),
            sortable: true,
            render: (activity) => (
                <span className="text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString()}
                </span>
            ),
        },
    ];

    const filters: DataTableFilter[] = useMemo(
        () => [
            {
                key: 'event',
                label: t('activity.filters.event'),
                options: [
                    ...events.map((e) => ({
                        label: t(`activity.events.${e}`),
                        value: e,
                    })),
                ],
            },
            {
                key: 'log_name',
                label: t('activity.filters.log'),
                options: [
                    ...log_names.map((name) => ({ label: name, value: name })),
                ],
            },
        ],
        [events, log_names, t],
    );

    const rowActions: RowAction<ActivityRow>[] = [
        {
            key: 'details',
            label: t('activity.actions.details'),
            icon: <Eye className="h-4 w-4" />,
            onClick: (activity) => setSelected(activity),
        },
    ];

    const diff = useMemo(() => {
        const oldValues = (selected?.properties?.old as Record<string, unknown>) || {};
        const newValues = (selected?.properties?.attributes as Record<string, unknown>) || {};
        const keys = Array.from(new Set([...Object.keys(oldValues), ...Object.keys(newValues)])).sort();

        return { keys, oldValues, newValues };
    }, [selected]);

    return (
        <>
            <Head title={t('activity.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading title={t('activity.title')} description={t('activity.description')} />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5" />
                            {t('activity.title')}
                        </CardTitle>
                        <CardDescription>{t('activity.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            tableId="activity-log"
                            data={activities}
                            columns={columns}
                            filters={filters}
                            rowActions={rowActions}
                            routePrefix={activityIndex().url}
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{t('activity.details.title')}</DialogTitle>
                        <DialogDescription>{selected?.description}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('activity.details.meta')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">{t('activity.columns.event')}</span>
                                    <span>{selected?.event || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">{t('activity.columns.log')}</span>
                                    <span>{selected?.log_name || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">{t('activity.columns.subject')}</span>
                                    <span>{selected?.subject.label || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">{t('activity.columns.causer')}</span>
                                    <span>{selected?.causer.label || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">{t('activity.columns.created_at')}</span>
                                    <span>
                                        {selected ? new Date(selected.created_at).toLocaleString() : '-'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <CardTitle>{t('activity.details.diff')}</CardTitle>
                                    <CardDescription>
                                        {diff.keys.length === 0 ? t('activity.details.none') : null}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {diff.keys.length === 0 ? null : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b text-left text-muted-foreground">
                                                    <th className="py-2 pr-3 font-medium">{t('activity.details.key')}</th>
                                                    <th className="py-2 pr-3 font-medium">{t('activity.details.old')}</th>
                                                    <th className="py-2 font-medium">{t('activity.details.new')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {diff.keys.map((key) => (
                                                    <tr key={key} className="border-b align-top last:border-0">
                                                        <td className="py-2 pr-3 font-medium">{key}</td>
                                                        <td className="py-2 pr-3 text-muted-foreground">
                                                            {stringifyValue(diff.oldValues[key])}
                                                        </td>
                                                        <td className="py-2">
                                                            {stringifyValue(diff.newValues[key])}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {selected?.properties && (
                                    <div className="mt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    JSON.stringify(selected.properties, null, 2),
                                                );
                                            }}
                                        >
                                            {t('activity.actions.copy_json')}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

ActivityIndex.layout = {
    breadcrumbs: [
        { title: 'common.settings', href: settingsIndex() },
        { title: 'activity.title', href: activityIndex() },
    ],
};
