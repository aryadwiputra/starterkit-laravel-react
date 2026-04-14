import { Head } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

export default function Maintenance({ message }: { message: string }) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('maintenance.title')} />

            <div className="flex min-h-screen items-center justify-center p-6">
                <Card className="mx-auto w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            {t('maintenance.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <p>{message}</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Maintenance.layout = null;
