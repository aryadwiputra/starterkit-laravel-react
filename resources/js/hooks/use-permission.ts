import { usePage } from '@inertiajs/react';

export function useCan(permission: string): boolean {
    const { permissions } = usePage().props;

    return permission ? (permissions as string[]).includes(permission) : false;
}

export function useHasRole(role: string): boolean {
    const { roles } = usePage().props;

    return role ? (roles as string[]).includes(role) : false;
}

export function useHasAnyRole(...rolesToCheck: string[]): boolean {
    const { roles } = usePage().props;

    return rolesToCheck.some((role) => (roles as string[]).includes(role));
}

export function usePermissions(): string[] {
    const { permissions } = usePage().props;

    return permissions as string[];
}

export function useRoles(): string[] {
    const { roles } = usePage().props;

    return roles as string[];
}
