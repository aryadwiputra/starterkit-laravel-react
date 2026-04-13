import type { ReactNode } from 'react';
import { useCan, useHasRole } from '@/hooks/use-permission';

type CanProps = {
    permission?: string;
    role?: string;
    children: ReactNode;
    fallback?: ReactNode;
};

export function Can({ permission, role, children, fallback = null }: CanProps) {
    const hasPermission = useCan(permission ?? '');
    const hasRole = useHasRole(role ?? '');

    const isAuthorized = (permission ? hasPermission : true) && (role ? hasRole : true);

    if (isAuthorized) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
