import { Link, usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import AuthControls from '@/layouts/auth/auth-controls';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props as { name: string };
    const { t } = useTranslation();
    const titleText = title ? t(title) : '';
    const descriptionText = description ? t(description) : '';

    return (
        <div className="grid min-h-svh bg-background lg:grid-cols-2">
            <aside className="relative hidden overflow-hidden border-r bg-muted lg:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800" />
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                        backgroundSize: '24px 24px',
                    }}
                />

                <div className="relative flex w-full flex-col p-10 text-white">
                    <Link
                        href={home()}
                        className="flex items-center gap-3 text-lg font-semibold tracking-tight"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                            <AppLogoIcon className="size-6 fill-current text-white" />
                        </div>
                        <span>{name}</span>
                    </Link>

                    <div className="mt-14 space-y-4">
                        <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                            {t('auth.layout.headline')}
                        </h2>
                        <p className="max-w-md text-base text-white/75">
                            {t('auth.layout.subheadline')}
                        </p>
                    </div>

                    <ul className="mt-8 space-y-4 text-sm text-white/80">
                        {[
                            t('auth.layout.bullets.fast_setup'),
                            t('auth.layout.bullets.secure_by_default'),
                            t('auth.layout.bullets.modern_ui'),
                        ].map((text) => (
                            <li key={text} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 size-4 text-white/80" />
                                <span className="leading-relaxed">{text}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto pt-10 text-xs text-white/50">
                        {t('auth.layout.footer_note')}
                    </div>
                </div>
            </aside>

            <main className="flex items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-md">
                    <div className="mb-4 flex items-center justify-between">
                        <Link
                            href={home()}
                            className="flex items-center gap-2 font-medium lg:hidden"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                                <AppLogoIcon className="size-6 fill-current text-foreground" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight">
                                {name}
                            </span>
                        </Link>

                        <div className="ml-auto">
                            <AuthControls />
                        </div>
                    </div>

                    <Card className="py-0">
                        <CardHeader className="gap-1.5">
                            <h1 className="text-xl font-semibold tracking-tight">
                                {titleText}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {descriptionText}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
