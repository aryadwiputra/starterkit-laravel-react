import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useCan } from '@/hooks/use-permission';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppSettings } from '@/routes/app-settings';
import { edit as editAppearance } from '@/routes/appearance';
import { index as featureFlagsIndex } from '@/routes/feature-flags';
import { edit as editMailSettings } from '@/routes/mail-settings';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const accountNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const canManageApp = useCan('settings.app.manage');
    const canManageMail = useCan('settings.mail.manage');
    const canManageFlags = useCan('settings.flags.manage');

    const adminNavItems: NavItem[] = [
        ...(canManageApp ? [{ title: 'App', href: editAppSettings(), icon: null }] : []),
        ...(canManageMail ? [{ title: 'Mail', href: editMailSettings(), icon: null }] : []),
        ...(canManageFlags ? [{ title: 'Feature flags', href: featureFlagsIndex(), icon: null }] : []),
    ];

    return (
        <div className="px-4 py-6">
            <Heading
                title="Settings"
                description="Manage your profile and account settings"
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label="Settings"
                    >
                        <p className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">
                            Account
                        </p>
                        {accountNavItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': isCurrentOrParentUrl(item.href),
                                })}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}

                        {adminNavItems.length > 0 && (
                            <>
                                <p className="mt-4 px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">
                                    Admin
                                </p>
                                {adminNavItems.map((item, index) => (
                                    <Button
                                        key={`${toUrl(item.href)}-admin-${index}`}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn('w-full justify-start', {
                                            'bg-muted': isCurrentOrParentUrl(item.href),
                                        })}
                                    >
                                        <Link href={item.href}>{item.title}</Link>
                                    </Button>
                                ))}
                            </>
                        )}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
