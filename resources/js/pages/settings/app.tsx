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
import { edit as editAppSettings } from '@/routes/app-settings';

type Props = {
    settings: {
        name: string;
        logo_url: string | null;
        timezone: string;
        locale: string;
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
            <Head title="App settings" />

            <h1 className="sr-only">App settings</h1>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="App settings"
                        description="Control branding, locale, and availability."
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
                                    <CardTitle>Branding</CardTitle>
                                    <CardDescription>
                                        Update the app name and logo shown to users.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Application name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            defaultValue={settings.name || name}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Logo</Label>
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
                                                            No logo
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                            <div className="text-sm text-muted-foreground">
                                                <p>
                                                    Click to upload a new logo (JPG, PNG,
                                                    WebP, SVG). Max 2MB.
                                                </p>
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
                                    <CardTitle>Localization</CardTitle>
                                    <CardDescription>
                                        Define default timezone and language for new sessions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="timezone">Timezone</Label>
                                        <Input
                                            id="timezone"
                                            name="timezone"
                                            defaultValue={settings.timezone}
                                            placeholder="UTC"
                                        />
                                        <InputError message={errors.timezone} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="locale">Default language</Label>
                                        <Input
                                            id="locale"
                                            name="locale"
                                            defaultValue={settings.locale}
                                            placeholder="en"
                                        />
                                        <InputError message={errors.locale} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Maintenance mode</CardTitle>
                                    <CardDescription>
                                        Pause public access while you perform updates.
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
                                            Enable maintenance mode
                                        </Label>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="maintenance_message">
                                            Maintenance message (optional)
                                        </Label>
                                        <Input
                                            id="maintenance_message"
                                            name="maintenance_message"
                                            defaultValue={settings.maintenance_message || ''}
                                            placeholder="We will be back soon."
                                        />
                                        <InputError message={errors.maintenance_message} />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>
                                    Save settings
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
            title: 'App settings',
            href: editAppSettings(),
        },
    ],
};
