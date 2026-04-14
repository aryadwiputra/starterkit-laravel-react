import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    FileText,
    Gauge,
    Globe,
    HeartPulse,
    Languages,
    LayoutGrid,
    LockKeyhole,
    Mail,
    Settings as SettingsIcon,
    Shield,
    Terminal,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { dashboard, login, register } from '@/routes';
import { health as apiHealth } from '@/routes/api';

type Props = {
    canRegister?: boolean;
};

export default function Welcome({ canRegister = true }: Props) {
    const { t } = useTranslation();
    const { auth, name } = usePage().props as {
        auth: { user: unknown | null };
        name: string;
    };

    const featureCards = [
        { icon: SettingsIcon, key: 'settings' },
        { icon: Shield, key: 'rbac' },
        { icon: LayoutGrid, key: 'media' },
        { icon: Bell, key: 'notifications' },
        { icon: FileText, key: 'audit' },
        { icon: Languages, key: 'i18n' },
        { icon: Globe, key: 'api' },
        { icon: HeartPulse, key: 'health' },
        { icon: LockKeyhole, key: 'errors_security' },
        { icon: Gauge, key: 'perf' },
    ] as const;

    const usageSteps = [
        'welcome.usage.steps.0',
        'welcome.usage.steps.1',
        'welcome.usage.steps.2',
        'welcome.usage.steps.3',
        'welcome.usage.steps.4',
    ] as const;

    const importantLinks = [
        {
            href: '/api/docs',
            labelKey: 'welcome.links.items.api_docs.label',
            descriptionKey: 'welcome.links.items.api_docs.description',
        },
        {
            href: '/api/docs.json',
            labelKey: 'welcome.links.items.openapi.label',
            descriptionKey: 'welcome.links.items.openapi.description',
        },
        {
            href: apiHealth().url,
            labelKey: 'welcome.links.items.health.label',
            descriptionKey: 'welcome.links.items.health.description',
        },
        {
            href: '/horizon',
            labelKey: 'welcome.links.items.horizon.label',
            descriptionKey: 'welcome.links.items.horizon.description',
        },
        {
            href: '/telescope',
            labelKey: 'welcome.links.items.telescope.label',
            descriptionKey: 'welcome.links.items.telescope.description',
        },
    ] as const;

    return (
        <>
            <Head title={t('welcome.meta_title', { app: name })} />

            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                        <Link href="/" className="flex items-center gap-3">
                            <AppLogo />
                        </Link>

                        <nav className="flex items-center gap-2">
                            <div className="hidden items-center gap-1 md:flex">
                                <a
                                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                                    href="#features"
                                >
                                    {t('welcome.nav.features')}
                                </a>
                                <a
                                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                                    href="#quickstart"
                                >
                                    {t('welcome.nav.quickstart')}
                                </a>
                                <a
                                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                                    href="#usage"
                                >
                                    {t('welcome.nav.usage')}
                                </a>
                                <a
                                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                                    href="#links"
                                >
                                    {t('welcome.nav.links')}
                                </a>
                            </div>

                            {auth.user ? (
                                <Button asChild variant="outline" size="sm">
                                    <Link href={dashboard()}>{t('common.dashboard')}</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={login()}>{t('auth.login')}</Link>
                                    </Button>
                                    {canRegister ? (
                                        <Button asChild size="sm">
                                            <Link href={register()}>{t('auth.register')}</Link>
                                        </Button>
                                    ) : null}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl space-y-20 px-4 py-12 md:py-16">
                    <section className="grid items-start gap-10 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
                                <Terminal className="h-3.5 w-3.5" />
                                <span>{t('welcome.hero.kicker')}</span>
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    {t('welcome.hero.title')}
                                </h1>
                                <p className="max-w-prose text-base text-muted-foreground">
                                    {t('welcome.hero.description')}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button asChild>
                                    <a href="#quickstart">{t('welcome.hero.primary_cta')}</a>
                                </Button>
                                <Button asChild variant="outline">
                                    <a href="#features">{t('welcome.hero.secondary_cta')}</a>
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground">{t('welcome.hero.note')}</p>
                        </div>

                        <Card className="border-dashed">
                            <CardHeader>
                                <CardTitle>{t('welcome.hero.side.title')}</CardTitle>
                                <CardDescription>{t('welcome.hero.side.description')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-lg border bg-muted/10 p-3">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {t('welcome.hero.side.stats.stack')}
                                        </p>
                                        <p className="mt-1 text-sm">{t('welcome.hero.side.stats.stack_value')}</p>
                                    </div>
                                    <div className="rounded-lg border bg-muted/10 p-3">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {t('welcome.hero.side.stats.modules')}
                                        </p>
                                        <p className="mt-1 text-sm">{t('welcome.hero.side.stats.modules_value')}</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-muted/10 p-3">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {t('welcome.hero.side.cta.title')}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <Button asChild size="sm" variant="outline">
                                            <a href="#features">{t('welcome.hero.side.cta.features')}</a>
                                        </Button>
                                        <Button asChild size="sm" variant="outline">
                                            <a href="#links">{t('welcome.hero.side.cta.links')}</a>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section id="features" className="scroll-mt-24">
                        <Heading
                            title={t('welcome.sections.features.title')}
                            description={t('welcome.sections.features.description')}
                        />

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {featureCards.map(({ icon: Icon, key }) => (
                                <Card key={key} className="transition-shadow hover:shadow-md">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">
                                                    {t(`welcome.features.${key}.title`)}
                                                </CardTitle>
                                                <CardDescription>
                                                    {t(`welcome.features.${key}.description`)}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section id="quickstart" className="scroll-mt-24">
                        <Heading
                            title={t('welcome.sections.quickstart.title')}
                            description={t('welcome.sections.quickstart.description')}
                        />

                        <Card>
                            <CardContent className="space-y-4">
                                <pre className="overflow-x-auto rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed">
                                    <code>{t('welcome.quickstart.commands')}</code>
                                </pre>
                                <p className="text-sm text-muted-foreground">
                                    {t('welcome.quickstart.note')}
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section id="accounts" className="scroll-mt-24">
                        <Heading
                            title={t('welcome.sections.accounts.title')}
                            description={t('welcome.sections.accounts.description')}
                        />

                        <div className="grid gap-4 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('welcome.accounts.super_admin.title')}</CardTitle>
                                    <CardDescription>{t('welcome.accounts.super_admin.description')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">{t('welcome.accounts.email')}</span>
                                        <code className="rounded bg-muted/30 px-2 py-1">superadmin@example.com</code>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">{t('welcome.accounts.password')}</span>
                                        <code className="rounded bg-muted/30 px-2 py-1">password</code>
                                    </div>
                                    <p className="pt-2 text-xs text-muted-foreground">
                                        {t('welcome.accounts.super_admin.note')}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('welcome.accounts.admin.title')}</CardTitle>
                                    <CardDescription>{t('welcome.accounts.admin.description')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">{t('welcome.accounts.email')}</span>
                                        <code className="rounded bg-muted/30 px-2 py-1">admin@example.com</code>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">{t('welcome.accounts.password')}</span>
                                        <code className="rounded bg-muted/30 px-2 py-1">password</code>
                                    </div>
                                    <p className="pt-2 text-xs text-muted-foreground">
                                        {t('welcome.accounts.admin.note')}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <section id="usage" className="scroll-mt-24">
                        <Heading
                            title={t('welcome.sections.usage.title')}
                            description={t('welcome.sections.usage.description')}
                        />

                        <div className="grid gap-4 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('welcome.usage.flow.title')}</CardTitle>
                                    <CardDescription>{t('welcome.usage.flow.description')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="space-y-3 text-sm">
                                        {usageSteps.map((key, index) => (
                                            <li key={key} className="flex gap-3">
                                                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted/20 text-xs text-muted-foreground">
                                                    {index + 1}
                                                </span>
                                                <span>{t(key)}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('welcome.usage.tips.title')}</CardTitle>
                                    <CardDescription>{t('welcome.usage.tips.description')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <p>{t('welcome.usage.tips.items.0')}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <SettingsIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <p>{t('welcome.usage.tips.items.1')}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Shield className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <p>{t('welcome.usage.tips.items.2')}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <section id="links" className="scroll-mt-24">
                        <Heading
                            title={t('welcome.sections.links.title')}
                            description={t('welcome.sections.links.description')}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            {importantLinks.map((link) => (
                                <Card key={link.href}>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            <a
                                                className="hover:underline"
                                                href={link.href}
                                                onClick={(event) => {
                                                    if (link.href.startsWith('/')) {
                                                        event.preventDefault();
                                                        router.visit(link.href);
                                                    }
                                                }}
                                            >
                                                {t(link.labelKey)}
                                            </a>
                                        </CardTitle>
                                        <CardDescription>{t(link.descriptionKey)}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="border-t">
                    <div className="mx-auto max-w-6xl space-y-2 px-4 py-10 text-sm text-muted-foreground">
                        <p>{t('welcome.footer.license')}</p>
                        <p className="flex items-center gap-2">
                            <Terminal className="h-4 w-4" />
                            <span>{t('welcome.footer.readme')}</span>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
