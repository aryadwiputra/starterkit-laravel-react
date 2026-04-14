import { Head, Link, router } from '@inertiajs/react';
import { Bell, Check, MailOpen } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { index as notificationsIndex, read as readNotification, readAll as readAllNotifications } from '@/routes/notifications';
import type { PaginatedData, PaginationLink } from '@/types/datatable';
import { useTranslation } from '@/hooks/use-translation';

type NotificationRow = {
    id: string;
    read_at: string | null;
    created_at: string | null;
    title: string | null;
    body: string | null;
    url: string | null;
    type: string;
};

type Props = {
    filter: 'unread' | 'read' | 'all';
    notifications: PaginatedData<NotificationRow>;
};

function normalizeLabel(label: string): string {
    return label
        .replaceAll('&laquo;', '«')
        .replaceAll('&raquo;', '»')
        .replaceAll(/<[^>]+>/g, '')
        .trim();
}

function Pagination({ links }: { links: PaginationLink[] }) {
    const { t } = useTranslation();

    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap items-center justify-center gap-2">
            {links.map((link, idx) => {
                const label = normalizeLabel(link.label);

                if (!link.url) {
                    return (
                        <Button
                            key={`${label}-${idx}`}
                            variant="outline"
                            size="sm"
                            disabled
                        >
                            {label || t('notifications.pagination.page')}
                        </Button>
                    );
                }

                return (
                    <Button
                        key={`${label}-${idx}`}
                        asChild
                        size="sm"
                        variant={link.active ? 'default' : 'outline'}
                    >
                        <Link href={link.url} preserveScroll>
                            {label}
                        </Link>
                    </Button>
                );
            })}
        </nav>
    );
}

export default function NotificationsIndex({ filter, notifications }: Props) {
    const { t } = useTranslation();

    const filters: Array<{ key: Props['filter']; label: string }> = [
        { key: 'unread', label: t('notifications.filters.unread') },
        { key: 'read', label: t('notifications.filters.read') },
        { key: 'all', label: t('notifications.filters.all') },
    ];

    return (
        <>
            <Head title={t('notifications.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title={t('notifications.title')}
                        description={t('notifications.description')}
                    />

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.post(
                                    readAllNotifications().url,
                                    {},
                                    { preserveScroll: true },
                                )
                            }
                        >
                            <Check className="mr-2 h-4 w-4" />
                            {t('notifications.actions.mark_all_read')}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {filters.map((item) => (
                        <Button
                            key={item.key}
                            size="sm"
                            variant={item.key === filter ? 'default' : 'outline'}
                            onClick={() =>
                                router.visit(
                                    notificationsIndex({
                                        query: { filter: item.key },
                                    }).url,
                                    { preserveScroll: true },
                                )
                            }
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            {t('notifications.list.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('notifications.list.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {notifications.data.length === 0 ? (
                            <div className="py-10 text-center text-sm text-muted-foreground">
                                {t('notifications.list.empty')}
                            </div>
                        ) : (
                            notifications.data.map((n) => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        'flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between',
                                        n.read_at
                                            ? 'bg-muted/20'
                                            : 'bg-background',
                                    )}
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-start gap-2">
                                            <div className="min-w-0">
                                                <div className="truncate font-medium">
                                                    {n.title ?? n.type}
                                                </div>
                                                {n.body && (
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {n.body}
                                                    </p>
                                                )}
                                                {n.created_at && (
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        {new Date(
                                                            n.created_at,
                                                        ).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {n.url && (
                                            <div className="mt-3">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="secondary"
                                                >
                                                    <a href={n.url}>
                                                        {t(
                                                            'notifications.actions.open',
                                                        )}
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!n.read_at && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    router.post(
                                                        readNotification({
                                                            notification: n.id,
                                                        }).url,
                                                        {},
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                <MailOpen className="mr-2 h-4 w-4" />
                                                {t(
                                                    'notifications.actions.mark_read',
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        <Pagination links={notifications.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

NotificationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'notifications.title',
            href: notificationsIndex(),
        },
    ],
};

