import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Monitor, Moon, Sun, User as UserIcon } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useAppearance } from '@/hooks/use-appearance';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTranslation } from '@/hooks/use-translation';
import { logout } from '@/routes';
import { update as updateLocale } from '@/routes/locale';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useTranslation();
    const { locale, availableLocales, localeLabels } = usePage().props as {
        locale: string;
        availableLocales: string[];
        localeLabels: Record<string, string>;
    };

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <UserIcon className="mr-2" />
                        {t('common.profile')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t('common.theme')}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
                value={appearance}
                onValueChange={(value) =>
                    updateAppearance(value as 'light' | 'dark' | 'system')
                }
            >
                <DropdownMenuRadioItem value="light">
                    <Sun className="h-4 w-4" />
                    {t('common.light')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                    <Moon className="h-4 w-4" />
                    {t('common.dark')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                    <Monitor className="h-4 w-4" />
                    {t('common.system')}
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t('common.language')}</DropdownMenuLabel>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    {t('common.logout')}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
