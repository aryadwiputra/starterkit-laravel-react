import { Form, Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MailSettingsController from '@/actions/App/Http/Controllers/Settings/MailSettingsController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
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

export default function MailSettings({ settings }: Props) {
    const [provider, setProvider] = useState(settings.default || 'log');
    const { t } = useTranslation();
    const providers = [
        { value: 'smtp', label: t('settings.mail.providers.smtp') },
        { value: 'mailgun', label: t('settings.mail.providers.mailgun') },
        { value: 'ses', label: t('settings.mail.providers.ses') },
        { value: 'resend', label: t('settings.mail.providers.resend') },
        { value: 'postmark', label: t('settings.mail.providers.postmark') },
        { value: 'log', label: t('settings.mail.providers.log') },
    ];

    const providerDescription = useMemo(() => {
        const found = providers.find((p) => p.value === provider);

        return found?.label ?? provider;
    }, [provider]);

    return (
        <>
            <Head title={t('settings.mail.title')} />

            <h1 className="sr-only">{t('settings.mail.title')}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={t('settings.mail.title')}
                        description={t('settings.mail.description')}
                    />
                </div>

                <Form
                    {...MailSettingsController.update.form()}
                    className="space-y-8"
                    options={{ preserveScroll: true }}
                >
                    {({ processing, errors }) => (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('settings.mail.sections.general.title')}</CardTitle>
                                    <CardDescription>
                                        {t('settings.mail.sections.general.description')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="default">{t('settings.mail.fields.provider')}</Label>
                                        <Select
                                            name="default"
                                            defaultValue={provider}
                                            onValueChange={setProvider}
                                        >
                                            <SelectTrigger id="default">
                                                <SelectValue placeholder={t('settings.mail.fields.provider_placeholder')} />
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
                                            {t('settings.mail.fields.provider_active', { provider: providerDescription })}
                                        </p>
                                        <InputError message={errors.default} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="from_address">{t('settings.mail.fields.from_address')}</Label>
                                        <Input
                                            id="from_address"
                                            name="from_address"
                                            type="email"
                                            defaultValue={settings.from_address || ''}
                                            placeholder={t('settings.mail.fields.from_address_placeholder')}
                                        />
                                        <InputError message={errors.from_address} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="from_name">{t('settings.mail.fields.from_name')}</Label>
                                        <Input
                                            id="from_name"
                                            name="from_name"
                                            defaultValue={settings.from_name || ''}
                                            placeholder={t('settings.mail.fields.from_name_placeholder')}
                                        />
                                        <InputError message={errors.from_name} />
                                    </div>
                                </CardContent>
                            </Card>

                            {provider === 'smtp' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('settings.mail.sections.smtp.title')}</CardTitle>
                                        <CardDescription>
                                            {t('settings.mail.sections.smtp.description')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">

                                    <div className="grid gap-2">
                                        <Label htmlFor="smtp_scheme">{t('settings.mail.fields.smtp_scheme')}</Label>
                                        <Select
                                            name="smtp_scheme"
                                            defaultValue={settings.smtp_scheme || 'smtp'}
                                        >
                                            <SelectTrigger id="smtp_scheme">
                                                <SelectValue placeholder={t('settings.mail.fields.smtp_scheme_placeholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="smtp">
                                                    {t('settings.mail.fields.smtp_scheme_smtp')}
                                                </SelectItem>
                                                <SelectItem value="smtps">
                                                    {t('settings.mail.fields.smtp_scheme_smtps')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.smtp_scheme} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="smtp_host">{t('settings.mail.fields.smtp_host')}</Label>
                                        <Input
                                            id="smtp_host"
                                            name="smtp_host"
                                            defaultValue={settings.smtp_host || ''}
                                            placeholder={t('settings.mail.fields.smtp_host_placeholder')}
                                        />
                                        <InputError message={errors.smtp_host} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="smtp_port">{t('settings.mail.fields.smtp_port')}</Label>
                                        <Input
                                            id="smtp_port"
                                            name="smtp_port"
                                            type="number"
                                            defaultValue={settings.smtp_port ?? 587}
                                        />
                                        <InputError message={errors.smtp_port} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="smtp_username">{t('settings.mail.fields.smtp_username')}</Label>
                                        <Input
                                            id="smtp_username"
                                            name="smtp_username"
                                            defaultValue={settings.smtp_username || ''}
                                        />
                                        <InputError message={errors.smtp_username} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="smtp_password">{t('settings.mail.fields.smtp_password')}</Label>
                                        <Input
                                            id="smtp_password"
                                            name="smtp_password"
                                            type="password"
                                            placeholder={
                                                settings.has_smtp_password
                                                    ? t('settings.mail.fields.smtp_password_set')
                                                    : t('settings.mail.fields.smtp_password_placeholder')
                                            }
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {t('settings.mail.fields.smtp_password_help')}
                                        </p>
                                        <InputError message={errors.smtp_password} />
                                    </div>
                                    </CardContent>
                                </Card>
                            )}

                            {provider === 'mailgun' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('settings.mail.sections.mailgun.title')}</CardTitle>
                                        <CardDescription>
                                            {t('settings.mail.sections.mailgun.description')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">

                                    <div className="grid gap-2">
                                        <Label htmlFor="mailgun_domain">{t('settings.mail.fields.mailgun_domain')}</Label>
                                        <Input
                                            id="mailgun_domain"
                                            name="mailgun_domain"
                                            defaultValue={settings.mailgun_domain || ''}
                                            placeholder={t('settings.mail.fields.mailgun_domain_placeholder')}
                                        />
                                        <InputError message={errors.mailgun_domain} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="mailgun_secret">{t('settings.mail.fields.mailgun_secret')}</Label>
                                        <Input
                                            id="mailgun_secret"
                                            name="mailgun_secret"
                                            type="password"
                                            placeholder={
                                                settings.has_mailgun_secret
                                                    ? t('settings.mail.fields.mailgun_secret_set')
                                                    : t('settings.mail.fields.mailgun_secret_placeholder')
                                            }
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {t('settings.mail.fields.mailgun_secret_help')}
                                        </p>
                                        <InputError message={errors.mailgun_secret} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="mailgun_endpoint">{t('settings.mail.fields.mailgun_endpoint')}</Label>
                                        <Input
                                            id="mailgun_endpoint"
                                            name="mailgun_endpoint"
                                            defaultValue={settings.mailgun_endpoint || ''}
                                            placeholder={t('settings.mail.fields.mailgun_endpoint_placeholder')}
                                        />
                                        <InputError message={errors.mailgun_endpoint} />
                                    </div>
                                    </CardContent>
                                </Card>
                            )}

                            {provider === 'ses' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('settings.mail.sections.ses.title')}</CardTitle>
                                        <CardDescription>
                                            {t('settings.mail.sections.ses.description')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">

                                    <div className="grid gap-2">
                                        <Label htmlFor="ses_key">{t('settings.mail.fields.ses_key')}</Label>
                                        <Input
                                            id="ses_key"
                                            name="ses_key"
                                            type="password"
                                            placeholder={
                                                settings.has_ses_key
                                                    ? t('settings.mail.fields.ses_key_set')
                                                    : t('settings.mail.fields.ses_key_placeholder')
                                            }
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {t('settings.mail.fields.ses_key_help')}
                                        </p>
                                        <InputError message={errors.ses_key} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="ses_secret">{t('settings.mail.fields.ses_secret')}</Label>
                                        <Input
                                            id="ses_secret"
                                            name="ses_secret"
                                            type="password"
                                            placeholder={
                                                settings.has_ses_secret
                                                    ? t('settings.mail.fields.ses_secret_set')
                                                    : t('settings.mail.fields.ses_secret_placeholder')
                                            }
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {t('settings.mail.fields.ses_secret_help')}
                                        </p>
                                        <InputError message={errors.ses_secret} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="ses_region">{t('settings.mail.fields.ses_region')}</Label>
                                        <Input
                                            id="ses_region"
                                            name="ses_region"
                                            defaultValue={settings.ses_region || ''}
                                            placeholder={t('settings.mail.fields.ses_region_placeholder')}
                                        />
                                        <InputError message={errors.ses_region} />
                                    </div>
                                    </CardContent>
                                </Card>
                            )}

                            {provider === 'resend' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('settings.mail.sections.resend.title')}</CardTitle>
                                        <CardDescription>
                                            {t('settings.mail.sections.resend.description')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">

                                    <div className="grid gap-2">
                                        <Label htmlFor="resend_key">{t('settings.mail.fields.resend_key')}</Label>
                                        <Input
                                            id="resend_key"
                                            name="resend_key"
                                            type="password"
                                            placeholder={
                                                settings.has_resend_key
                                                    ? t('settings.mail.fields.resend_key_set')
                                                    : t('settings.mail.fields.resend_key_placeholder')
                                            }
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {t('settings.mail.fields.resend_key_help')}
                                        </p>
                                        <InputError message={errors.resend_key} />
                                    </div>
                                    </CardContent>
                                </Card>
                            )}

                            {provider === 'postmark' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('settings.mail.sections.postmark.title')}</CardTitle>
                                        <CardDescription>
                                            {t('settings.mail.sections.postmark.description')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">

                                    <div className="grid gap-2">
                                        <Label htmlFor="postmark_key">{t('settings.mail.fields.postmark_key')}</Label>
                                        <Input
                                            id="postmark_key"
                                            name="postmark_key"
                                            type="password"
                                            placeholder={
                                                settings.has_postmark_key
                                                    ? t('settings.mail.fields.postmark_key_set')
                                                    : t('settings.mail.fields.postmark_key_placeholder')
                                            }
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {t('settings.mail.fields.postmark_key_help')}
                                        </p>
                                        <InputError message={errors.postmark_key} />
                                    </div>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('settings.mail.actions.save')}</Button>
                            </div>
                        </>
                    )}
                </Form>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('settings.mail.sections.test.title')}</CardTitle>
                        <CardDescription>
                            {t('settings.mail.sections.test.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...MailSettingsController.test.form()}
                            className="space-y-4"
                            options={{ preserveScroll: true }}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="to">{t('settings.mail.fields.test_to')}</Label>
                                        <Input
                                            id="to"
                                            name="to"
                                            type="email"
                                            placeholder={t('settings.mail.fields.test_to_placeholder')}
                                            required
                                        />
                                        <InputError message={errors.to} />
                                    </div>
                                    <Button disabled={processing} variant="secondary">
                                        {t('settings.mail.actions.send_test')}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MailSettings.layout = {
    breadcrumbs: [
        {
            title: 'settings.mail.title',
            href: editMailSettings(),
        },
    ],
};
