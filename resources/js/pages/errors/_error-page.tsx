import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Ban, FileQuestion, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    status: number;
    title: string;
    description: string;
    primary_action: 'back' | 'reload';
    primary_label: string;
    secondary_href: string;
    secondary_label: string;
};

function Icon({ status }: { status: number }) {
    if (status === 403) return <Ban className="h-5 w-5" />;
    if (status === 404) return <FileQuestion className="h-5 w-5" />;
    if (status === 503) return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    return <RefreshCw className="h-5 w-5" />;
}

export default function ErrorPage({
    status,
    title,
    description,
    primary_action,
    primary_label,
    secondary_href,
    secondary_label,
}: Props) {
    return (
        <>
            <Head title={title} />

            <div className="flex min-h-screen items-center justify-center p-6">
                <Card className="mx-auto w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon status={status} />
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-sm text-muted-foreground">{description}</p>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (primary_action === 'back') {
                                        window.history.back();
                                    } else {
                                        window.location.reload();
                                    }
                                }}
                            >
                                {primary_label}
                            </Button>

                            <Button type="button" onClick={() => router.visit(secondary_href)}>
                                {secondary_label}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ErrorPage.layout = null;
