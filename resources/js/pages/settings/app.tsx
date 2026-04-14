import { Form, Head, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppSettingsController from '@/actions/App/Http/Controllers/Settings/AppSettingsController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { edit as editAppSettings } from '@/routes/app-settings';

type Props = {
    settings: {
        name: string;
        logo_url: string | null;
        timezone: string;
        locale: string;
        fallback_locale: string;
        maintenance_enabled: boolean;
        maintenance_message: string | null;
    };
};

export default function AppSettings({ settings }: Props) {
    const { name } = usePage().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(
        settings.logo_url,
    );
    const { t } = useTranslation();

    function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    }

    return (
        <>
            <Head title={t('settings.app.title')} />

            <h1 className="sr-only">{t('settings.app.title')}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={t('settings.app.title')}
                        description={t('settings.app.description')}
                    />
                </div>

                <Form
                    {...AppSettingsController.update.form()}
                    encType="multipart/form-data"
                    className="space-y-6"
                    options={{ preserveScroll: true }}
                >
                    {({ processing, errors }) => (
                        <>
                            <Card>
                                <CardHeader>
                                <CardTitle>{t('settings.app.sections.branding.title')}</CardTitle>
                                <CardDescription>
                                        {t('settings.app.sections.branding.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-2">
                                        <Label htmlFor="name">{t('settings.app.fields.name')}</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            defaultValue={settings.name || name}
                                        />
                                        <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                        <Label>{t('settings.app.fields.logo')}</Label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="group relative"
                                            >
                                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                                                    {logoPreview ? (
                                                        <img
                                                            src={logoPreview}
                                                            alt={settings.name}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            {t('settings.app.fields.logo_empty')}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                            <div className="text-sm text-muted-foreground">
                                                <p>{t('settings.app.fields.logo_help')}</p>
                                            </div>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            id="logo"
                                            type="file"
                                            name="logo"
                                            accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                            className="hidden"
                                            onChange={handleLogoChange}
                                        />
                                        <InputError message={errors.logo} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                <CardTitle>{t('settings.app.sections.localization.title')}</CardTitle>
                                <CardDescription>
                                        {t('settings.app.sections.localization.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-2">
                                        <Label htmlFor="timezone">{t('settings.app.fields.timezone')}</Label>
                                    <Input
                                        id="timezone"
                                        name="timezone"
                                        defaultValue={settings.timezone}
                                        placeholder={t('settings.app.fields.timezone_placeholder')}
                                    />
                                    <InputError message={errors.timezone} />
                                </div>

                                <div className="grid gap-2">
                                        <Label htmlFor="locale">{t('settings.app.fields.locale')}</Label>
                                    <Input
                                        id="locale"
                                        name="locale"
                                        defaultValue={settings.locale}
                                        placeholder={t('settings.app.fields.locale_placeholder')}
                                    />
                                    <InputError message={errors.locale} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="fallback_locale">
                                        {t('settings.app.fields.fallback_locale')}
                                    </Label>
                                    <Input
                                        id="fallback_locale"
                                        name="fallback_locale"
                                        defaultValue={settings.fallback_locale}
                                        placeholder={t('settings.app.fields.fallback_locale_placeholder')}
                                    />
                                    <InputError message={errors.fallback_locale} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t('settings.app.sections.maintenance.title')}</CardTitle>
                                <CardDescription>
                                        {t('settings.app.sections.maintenance.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="maintenance_enabled"
                                        name="maintenance_enabled"
                                        value="1"
                                        defaultChecked={settings.maintenance_enabled}
                                    />
                                        <Label htmlFor="maintenance_enabled">
                                            {t('settings.app.fields.maintenance_enabled')}
                                        </Label>
                                </div>

                                <div className="grid gap-2">
                                        <Label htmlFor="maintenance_message">
                                            {t('settings.app.fields.maintenance_message')}
                                        </Label>
                                        <Input
                                            id="maintenance_message"
                                            name="maintenance_message"
                                            defaultValue={settings.maintenance_message || ''}
                                            placeholder={t('settings.app.fields.maintenance_placeholder')}
                                        />
                                        <InputError message={errors.maintenance_message} />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>
                                {t('common.save_settings')}
                            </Button>
                        </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AppSettings.layout = {
    breadcrumbs: [
        {
            title: 'settings.app.title',
            href: editAppSettings(),
        },
    ],
};
