import { Form, Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MailSettingsController from '@/actions/App/Http/Controllers/Settings/MailSettingsController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { edit as editMailSettings } from '@/routes/mail-settings';

type Props = {
    settings: {
        default: string;
        from_address: string | null;
        from_name: string | null;

        smtp_scheme: string | null;
        smtp_host: string | null;
        smtp_port: number | null;
        smtp_username: string | null;
        has_smtp_password: boolean;

        mailgun_domain: string | null;
        mailgun_endpoint: string | null;
        has_mailgun_secret: boolean;

        ses_region: string | null;
        has_ses_key: boolean;
        has_ses_secret: boolean;

        has_resend_key: boolean;
        has_postmark_key: boolean;
    };
};

const providers = [
    { value: 'smtp', label: 'SMTP' },
    { value: 'mailgun', label: 'Mailgun' },
    { value: 'ses', label: 'SES' },
    { value: 'resend', label: 'Resend' },
    { value: 'postmark', label: 'Postmark' },
    { value: 'log', label: 'Log (dev)' },
];

export default function MailSettings({ settings }: Props) {
    const [provider, setProvider] = useState(settings.default || 'log');

    const providerDescription = useMemo(() => {
        const found = providers.find((p) => p.value === provider);
        return found?.label ?? provider;
    }, [provider]);

    return (
        <>
            <Head title="Mail settings" />

            <h1 className="sr-only">Mail settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Mail settings"
                    description="Configure email delivery without editing .env"
                />

                <Form
                    {...MailSettingsController.update.form()}
                    className="space-y-8"
                    options={{ preserveScroll: true }}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-4 rounded-lg border p-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="default">Provider</Label>
                                    <Select
                                        name="default"
                                        defaultValue={provider}
                                        onValueChange={setProvider}
                                    >
                                        <SelectTrigger id="default">
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {providers.map((p) => (
                                                <SelectItem key={p.value} value={p.value}>
                                                    {p.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        Active provider: {providerDescription}
                                    </p>
                                    <InputError message={errors.default} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="from_address">From address</Label>
                                    <Input
                                        id="from_address"
                                        name="from_address"
                                        type="email"
                                        defaultValue={settings.from_address || ''}
                                        placeholder="noreply@example.com"
                                    />
                                    <InputError message={errors.from_address} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="from_name">From name</Label>
                                    <Input
                                        id="from_name"
                                        name="from_name"
                                        defaultValue={settings.from_name || ''}
                                        placeholder="My App"
                                    />
                                    <InputError message={errors.from_name} />
                                </div>
                            </div>

                            {provider === 'smtp' && (
                                <div className="space-y-4 rounded-lg border p-4">
                                    <h2 className="text-sm font-medium">SMTP</h2>

                                    <div className="grid gap-2">
                                        <Label htmlFor="smtp_scheme">Scheme</Label>
                                        <Select
                                            name="smtp_scheme"
                                            defaultValue={settings.smtp_scheme || 'smtp'}
                                        >
                                            <SelectTrigger id="smtp_scheme">
                                                <SelectValue placeholder="smtp" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="smtp">smtp</SelectItem>
                                                <SelectItem value="smtps">smtps</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.smtp_scheme} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="smtp_host">Host</Label>
                                        <Input
                                            id="smtp_host"
                                            name="smtp_host"
                                            defaultValue={settings.smtp_host || ''}
                                            placeholder="smtp.mailtrap.io"
                                        />
                                        <InputError message={errors.smtp_host} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="smtp_port">Port</Label>
                                        <Input
                                            id="smtp_port"
                                            name="smtp_port"
                                            type="number"
                                            defaultValue={settings.smtp_port ?? 587}
                                        />
                                        <InputError message={errors.smtp_port} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="smtp_username">Username</Label>
                                        <Input
                                            id="smtp_username"
                                            name="smtp_username"
                                            defaultValue={settings.smtp_username || ''}
                                        />
                                        <InputError message={errors.smtp_username} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="smtp_password">Password</Label>
                                        <Input
                                            id="smtp_password"
                                            name="smtp_password"
                                            type="password"
                                            placeholder={settings.has_smtp_password ? '•••••••• (set)' : 'Enter password'}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Leave blank to keep existing password.
                                        </p>
                                        <InputError message={errors.smtp_password} />
                                    </div>
                                </div>
                            )}

                            {provider === 'mailgun' && (
                                <div className="space-y-4 rounded-lg border p-4">
                                    <h2 className="text-sm font-medium">Mailgun</h2>

                                    <div className="grid gap-2">
                                        <Label htmlFor="mailgun_domain">Domain</Label>
                                        <Input
                                            id="mailgun_domain"
                                            name="mailgun_domain"
                                            defaultValue={settings.mailgun_domain || ''}
                                            placeholder="mg.example.com"
                                        />
                                        <InputError message={errors.mailgun_domain} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="mailgun_secret">API key</Label>
                                        <Input
                                            id="mailgun_secret"
                                            name="mailgun_secret"
                                            type="password"
                                            placeholder={settings.has_mailgun_secret ? '•••••••• (set)' : 'Enter API key'}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Leave blank to keep existing key.
                                        </p>
                                        <InputError message={errors.mailgun_secret} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="mailgun_endpoint">Endpoint (optional)</Label>
                                        <Input
                                            id="mailgun_endpoint"
                                            name="mailgun_endpoint"
                                            defaultValue={settings.mailgun_endpoint || ''}
                                            placeholder="api.mailgun.net"
                                        />
                                        <InputError message={errors.mailgun_endpoint} />
                                    </div>
                                </div>
                            )}

                            {provider === 'ses' && (
                                <div className="space-y-4 rounded-lg border p-4">
                                    <h2 className="text-sm font-medium">AWS SES</h2>

                                    <div className="grid gap-2">
                                        <Label htmlFor="ses_key">Access key</Label>
                                        <Input
                                            id="ses_key"
                                            name="ses_key"
                                            type="password"
                                            placeholder={settings.has_ses_key ? '•••••••• (set)' : 'Enter access key'}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Leave blank to keep existing key.
                                        </p>
                                        <InputError message={errors.ses_key} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="ses_secret">Secret</Label>
                                        <Input
                                            id="ses_secret"
                                            name="ses_secret"
                                            type="password"
                                            placeholder={settings.has_ses_secret ? '•••••••• (set)' : 'Enter secret'}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Leave blank to keep existing secret.
                                        </p>
                                        <InputError message={errors.ses_secret} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="ses_region">Region</Label>
                                        <Input
                                            id="ses_region"
                                            name="ses_region"
                                            defaultValue={settings.ses_region || ''}
                                            placeholder="us-east-1"
                                        />
                                        <InputError message={errors.ses_region} />
                                    </div>
                                </div>
                            )}

                            {provider === 'resend' && (
                                <div className="space-y-4 rounded-lg border p-4">
                                    <h2 className="text-sm font-medium">Resend</h2>

                                    <div className="grid gap-2">
                                        <Label htmlFor="resend_key">API key</Label>
                                        <Input
                                            id="resend_key"
                                            name="resend_key"
                                            type="password"
                                            placeholder={settings.has_resend_key ? '•••••••• (set)' : 'Enter API key'}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Leave blank to keep existing key.
                                        </p>
                                        <InputError message={errors.resend_key} />
                                    </div>
                                </div>
                            )}

                            {provider === 'postmark' && (
                                <div className="space-y-4 rounded-lg border p-4">
                                    <h2 className="text-sm font-medium">Postmark</h2>

                                    <div className="grid gap-2">
                                        <Label htmlFor="postmark_key">Server token</Label>
                                        <Input
                                            id="postmark_key"
                                            name="postmark_key"
                                            type="password"
                                            placeholder={settings.has_postmark_key ? '•••••••• (set)' : 'Enter server token'}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Leave blank to keep existing token.
                                        </p>
                                        <InputError message={errors.postmark_key} />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save mail settings</Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-y-4 rounded-lg border p-4">
                    <h2 className="text-sm font-medium">Send test email</h2>
                    <Form
                        {...MailSettingsController.test.form()}
                        className="space-y-4"
                        options={{ preserveScroll: true }}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="to">To</Label>
                                    <Input id="to" name="to" type="email" placeholder="you@example.com" required />
                                    <InputError message={errors.to} />
                                </div>
                                <Button disabled={processing} variant="secondary">
                                    Send test email
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

MailSettings.layout = {
    breadcrumbs: [
        {
            title: 'Mail settings',
            href: editMailSettings(),
        },
    ],
};

