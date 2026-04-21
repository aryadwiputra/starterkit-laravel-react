import { router, usePage } from '@inertiajs/react';
import { Globe, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { useTranslation } from '@/hooks/use-translation';
import { update as updateLocale } from '@/routes/locale';

export default function AuthControls() {
    const { t } = useTranslation();
    const { appearance, updateAppearance } = useAppearance();
    const { locale, availableLocales, localeLabels } = usePage().props as {
        locale: string;
        availableLocales: string[];
        localeLabels: Record<string, string>;
    };

    const currentLocaleLabel = localeLabels[locale] ?? locale;

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        aria-label={t('common.theme')}
                    >
                        {appearance === 'dark' ? (
                            <Moon className="size-4" />
                        ) : appearance === 'light' ? (
                            <Sun className="size-4" />
                        ) : (
                            <Monitor className="size-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-44">
                    <DropdownMenuLabel>{t('common.theme')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
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
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        aria-label={t('common.language')}
                    >
                        <Globe className="mr-2 size-4" />
                        {currentLocaleLabel}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-44">
                    <DropdownMenuLabel>{t('common.language')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                        value={locale}
                        onValueChange={(value) =>
                            router.post(
                                updateLocale().url,
                                { locale: value },
                                { preserveScroll: true },
                            )
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
        </div>
    );
}

