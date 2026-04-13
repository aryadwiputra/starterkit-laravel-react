import { router, usePage } from '@inertiajs/react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { stop as impersonateStop } from '@/routes/impersonate';

export function ImpersonationBanner() {
    const { impersonating } = usePage().props;

    if (!impersonating) {
        return null;
    }

    function stopImpersonating() {
        router.post(impersonateStop().url);
    }

    return (
        <div className="flex items-center justify-between gap-4 bg-amber-500 px-4 py-2 text-amber-950">
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                    You are impersonating a user. Original account: <strong>{impersonating.original_user_name}</strong>
                </span>
            </div>
            <Button variant="outline" size="sm" className="border-amber-700 bg-amber-600 text-amber-50 hover:bg-amber-700" onClick={stopImpersonating}>
                <X className="mr-1 h-3 w-3" />
                Stop Impersonating
            </Button>
        </div>
    );
}
