import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { useTranslation } from '@/hooks/use-translation';
import AuthControls from '@/layouts/auth/auth-controls';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { t } = useTranslation();
    const titleText = title ? t(title) : '';
    const descriptionText = description ? t(description) : '';

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="w-full max-w-md">
                <div className="mb-4 flex justify-end">
                    <AuthControls />
                </div>

                <div className="space-y-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Link
                            href={home()}
                            className="flex items-center justify-center gap-2 font-medium"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                                <AppLogoIcon className="size-6 fill-current text-foreground" />
                            </div>
                        </Link>

                        <div className="space-y-1">
                            <h1 className="text-xl font-semibold tracking-tight">
                                {titleText}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {descriptionText}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
