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
    Settings as SettingsIcon,
    Shield,
    Terminal,
    ChevronRight,
    CheckCircle2,
    Command,
    ArrowRight,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/use-translation';
import { dashboard, login, register } from '@/routes';
import { health as apiHealth } from '@/routes/api';
import { update as updateLocale } from '@/routes/locale';

type Props = {
    canRegister?: boolean;
};

export default function Welcome({ canRegister = true }: Props) {
    const { t } = useTranslation();
    const { auth, name, locale, availableLocales, localeLabels } = usePage().props as {
        auth: { user: unknown | null };
        name: string;
        locale: string;
        availableLocales: string[];
        localeLabels: Record<string, string>;
    };

    const featureCards = [
        { icon: SettingsIcon, key: 'settings', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { icon: Shield, key: 'rbac', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { icon: LayoutGrid, key: 'media', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { icon: Bell, key: 'notifications', color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { icon: FileText, key: 'audit', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { icon: Languages, key: 'i18n', color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { icon: Globe, key: 'api', color: 'text-sky-500', bg: 'bg-sky-500/10' },
        { icon: HeartPulse, key: 'health', color: 'text-red-500', bg: 'bg-red-500/10' },
        { icon: LockKeyhole, key: 'errors_security', color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { icon: Gauge, key: 'perf', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    ] as const;

    const currentLocaleLabel = localeLabels[locale] ?? locale;

    return (
        <>
            <Head title={t('welcome.meta_title', { app: name })} />

            <div className="min-h-screen bg-background selection:bg-primary/10">
                {/* Modern Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                            <div className="flex items-center">
                                <AppLogo />
                            </div>
                        </Link>

                        <nav className="flex items-center gap-4">
                            <div className="hidden items-center gap-6 md:flex mr-4">
                                {['features', 'quickstart', 'usage', 'links'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item}`}
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {t(`welcome.nav.${item}`)}
                                    </a>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 border-l pl-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-full">
                                            {currentLocaleLabel}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="min-w-40">
                                        <DropdownMenuLabel>{t('common.language')}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup
                                            value={locale}
                                            onValueChange={(value) =>
                                                router.post(updateLocale().url, { locale: value }, { preserveScroll: true })
                                            }
                                        >
                                            {availableLocales.map((option) => (
                                                <DropdownMenuRadioItem key={option} value={option}>
                                                    {localeLabels[option] ?? option}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {auth.user ? (
                                    <Button asChild variant="default" size="sm" className="rounded-full px-5">
                                        <Link href={dashboard()}>{t('common.dashboard')}</Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild variant="ghost" size="sm" className="rounded-full">
                                            <Link href={login()}>{t('auth.login')}</Link>
                                        </Button>
                                        {canRegister && (
                                            <Button asChild size="sm" className="rounded-full px-5">
                                                <Link href={register()}>{t('auth.register')}</Link>
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4">
                    {/* Hero Section - Re-styled for better focus */}
                    <section className="relative py-20 md:py-32 overflow-hidden">
                        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                            <div className="space-y-8 text-left">
                                <Badge variant="secondary" className="rounded-full px-4 py-1 font-medium">
                                    <Terminal className="mr-2 h-3.5 w-3.5" />
                                    {t('welcome.hero.kicker')}
                                </Badge>
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:leading-[1.1]">
                                        {t('welcome.hero.title')}
                                    </h1>
                                    <p className="max-w-[540px] text-lg text-muted-foreground leading-relaxed">
                                        {t('welcome.hero.description')}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
                                        <a href="#quickstart">
                                            {t('welcome.hero.primary_cta')}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base">
                                        <a href="#features">{t('welcome.hero.secondary_cta')}</a>
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground italic">{t('welcome.hero.note')}</p>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                                <div className="relative bg-card border rounded-2xl p-8 shadow-2xl">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <h3 className="font-bold text-lg">{t('welcome.hero.side.title')}</h3>
                                            <div className="flex gap-1">
                                                <div className="size-3 rounded-full bg-red-500/20" />
                                                <div className="size-3 rounded-full bg-amber-500/20" />
                                                <div className="size-3 rounded-full bg-emerald-500/20" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-muted/40 p-4 rounded-xl space-y-1">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                                                    {t('welcome.hero.side.stats.stack')}
                                                </span>
                                                <p className="text-sm font-semibold">{t('welcome.hero.side.stats.stack_value')}</p>
                                            </div>
                                            <div className="bg-muted/40 p-4 rounded-xl space-y-1">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                                                    {t('welcome.hero.side.stats.modules')}
                                                </span>
                                                <p className="text-sm font-semibold">{t('welcome.hero.side.stats.modules_value')}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                                <span>{t('welcome.hero.side.checks.0')}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                                <span>{t('welcome.hero.side.checks.1')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section - No more Cards, using Icon Grid */}
                    <section id="features" className="py-24 scroll-mt-16">
                        <div className="text-center space-y-4 mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('welcome.sections.features.title')}</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('welcome.sections.features.description')}</p>
                        </div>

                        <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 px-4">
                            {featureCards.map(({ icon: Icon, key, color, bg }) => (
                                <div key={key} className="group relative">
                                    <div className={`mb-5 inline-flex size-12 items-center justify-center rounded-2xl ${bg} ${color} transition-transform group-hover:-translate-y-1 group-hover:scale-110 duration-300`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 font-bold text-xl tracking-tight">{t(`welcome.features.${key}.title`)}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{t(`welcome.features.${key}.description`)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Quickstart - Clean Terminal Feel */}
                    <section id="quickstart" className="py-24 scroll-mt-16 bg-muted/30 -mx-4 px-4 rounded-[3rem]">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center">
                                <Heading
                                    title={t('welcome.sections.quickstart.title')}
                                    description={t('welcome.sections.quickstart.description')}
                                />
                            </div>
                            <div className="mt-10 relative">
                                <div className="absolute -top-3 left-4 flex gap-1.5 z-10">
                                    <div className="size-3 rounded-full bg-slate-700" />
                                    <div className="size-3 rounded-full bg-slate-700" />
                                    <div className="size-3 rounded-full bg-slate-700" />
                                </div>
                                <div className="rounded-2xl bg-slate-950 p-6 shadow-2xl shadow-primary/10 border border-slate-800">
                                    <pre className="font-mono text-sm leading-relaxed text-slate-300 overflow-x-auto">
                                        <code>{t('welcome.quickstart.commands')}</code>
                                    </pre>
                                </div>
                                <p className="mt-4 text-center text-sm text-muted-foreground">
                                    <Command className="inline h-3 w-3 mr-1" />
                                    {t('welcome.quickstart.note')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Accounts - Simple & Informative */}
                    <section id="accounts" className="py-24 scroll-mt-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">{t('welcome.sections.accounts.title')}</h2>
                            <p className="text-muted-foreground">{t('welcome.sections.accounts.description')}</p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                            {[
                                { titleKey: 'super_admin', email: 'superadmin@example.com' },
                                { titleKey: 'admin', email: 'admin@example.com' }
                            ].map((acc) => (
                                <div key={acc.titleKey} className="group p-8 rounded-3xl border bg-card hover:border-primary/50 transition-all duration-300">
                                    <h3 className="text-xl font-bold mb-2">{t(`welcome.accounts.${acc.titleKey}.title`)}</h3>
                                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{t(`welcome.accounts.${acc.titleKey}.description`)}</p>
                                    <div className="space-y-3 font-mono text-sm">
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                                            <span className="text-muted-foreground">{t('welcome.accounts.email')}</span>
                                            <span className="font-medium">{acc.email}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                                            <span className="text-muted-foreground">{t('welcome.accounts.password')}</span>
                                            <span className="font-medium text-primary">password</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Usage Flow - Step Navigation */}
                    <section id="usage" className="py-24 scroll-mt-16 border-y">
                        <div className="grid lg:grid-cols-2 gap-16 items-start">
                            <div className="sticky top-24">
                                <h2 className="text-4xl font-bold tracking-tight mb-4">{t('welcome.usage.flow.title')}</h2>
                                <p className="text-muted-foreground text-lg mb-8">{t('welcome.usage.flow.description')}</p>
                                <div className="space-y-4">
                                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <h4 className="font-bold flex items-center gap-2 mb-2">
                                            <SettingsIcon className="h-4 w-4 text-primary" />
                                            {t('welcome.usage.pro_tip.title')}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">{t('welcome.usage.tips.items.1')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-12">
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <div key={index} className="flex gap-6 relative group">
                                        {index !== 4 && <div className="absolute left-6 top-12 bottom-0 w-px bg-border group-hover:bg-primary transition-colors" />}
                                        <div className="size-12 rounded-full border-2 bg-background flex items-center justify-center font-bold text-lg shrink-0 z-10 group-hover:border-primary group-hover:text-primary transition-colors">
                                            {index + 1}
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-lg leading-relaxed text-foreground/90 font-medium">
                                                {t(`welcome.usage.steps.${index}`)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Links Section - List Style */}
                    <section id="links" className="py-24 scroll-mt-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold">{t('welcome.sections.links.title')}</h2>
                        </div>
                        <div className="grid gap-4 max-w-3xl mx-auto">
                            {[
                                { href: '/api/docs', labelKey: 'api_docs' },
                                { href: '/api/docs.json', labelKey: 'openapi' },
                                { href: apiHealth().url, labelKey: 'health' },
                                { href: '/horizon', labelKey: 'horizon' },
                                { href: '/telescope', labelKey: 'telescope' },
                            ].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="group flex items-center justify-between p-5 rounded-2xl border bg-card hover:bg-muted/50 transition-all"
                                    onClick={(event) => {
                                        if (link.href.startsWith('/')) {
                                            event.preventDefault();
                                            router.visit(link.href);
                                        }
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold">{t(`welcome.links.items.${link.labelKey}.label`)}</span>
                                        <span className="text-sm text-muted-foreground">{t(`welcome.links.items.${link.labelKey}.description`)}</span>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </a>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="border-t py-12 bg-muted/20">
                    <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center opacity-50">
                                <AppLogo />
                            </div>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <p className="text-sm text-muted-foreground">{t('welcome.footer.license')}</p>
                            <p className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                                <Terminal className="h-4 w-4" />
                                <span>{t('welcome.footer.readme')}</span>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
