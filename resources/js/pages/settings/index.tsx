import { Head, Link } from '@inertiajs/react';
import type { ElementType } from 'react';
import { Flag, Mail, Sliders } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCan } from '@/hooks/use-permission';
import { useTranslation } from '@/hooks/use-translation';
import { edit as editAppSettings } from '@/routes/app-settings';
import { index as featureFlagsIndex } from '@/routes/feature-flags';
import { edit as editMailSettings } from '@/routes/mail-settings';
import { index as settingsIndex } from '@/routes/settings';

type SettingsCard = {
    title: string;
    description: string;
    href: string;
    icon: ElementType;
    visible: boolean;
};

export default function SettingsIndex() {
    const canManageApp = useCan('settings.app.manage');
    const canManageMail = useCan('settings.mail.manage');
    const canManageFlags = useCan('settings.flags.manage');
    const { t } = useTranslation();

    const cards: SettingsCard[] = [
        {
            title: t('settings.cards.app.title'),
            description: t('settings.cards.app.description'),
            href: editAppSettings(),
            icon: Sliders,
            visible: canManageApp,
        },
        {
            title: t('settings.cards.mail.title'),
            description: t('settings.cards.mail.description'),
            href: editMailSettings(),
            icon: Mail,
            visible: canManageMail,
        },
        {
            title: t('settings.cards.feature_flags.title'),
            description: t('settings.cards.feature_flags.description'),
            href: featureFlagsIndex(),
            icon: Flag,
            visible: canManageFlags,
        },
    ];

    return (
        <>
            <Head title={t('common.settings')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title={t('settings.title')}
                    description={t('settings.description')}
                />

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {cards
                        .filter((card) => card.visible)
                        .map((card) => {
                            const Icon = card.icon;

                            return (
                                <Card
                                    key={card.title}
                                    className="flex h-full flex-col transition-colors hover:border-foreground/30"
                                >
                                    <CardHeader className="gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/30 text-foreground">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">
                                                    {card.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {card.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="mt-auto">
                                        <Button
                                            variant="outline"
                                            asChild
                                            className="w-full justify-center"
                                        >
                                            <Link href={card.href}>{t('common.open')}</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                </div>
            </div>
        </>
    );
}

SettingsIndex.layout = {
    breadcrumbs: [
        {
            title: 'common.settings',
            href: settingsIndex(),
        },
    ],
};
