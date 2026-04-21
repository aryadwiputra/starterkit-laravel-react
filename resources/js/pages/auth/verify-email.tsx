// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('auth.verify_email_title')} />

            {status === 'verification-link-sent' && (
                <Alert>
                    <AlertTitle>{t('common.status')}</AlertTitle>
                    <AlertDescription>
                        {t('auth.verify_email_sent')}
                    </AlertDescription>
                </Alert>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            variant="secondary"
                            className="w-full"
                        >
                            {processing && <Spinner />}
                            {t('auth.resend_verification')}
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            {t('common.logout')}
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'auth.verify_email_title',
    description: 'auth.verify_email_description',
};
