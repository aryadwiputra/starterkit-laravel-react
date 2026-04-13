import type { Auth, Impersonation } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            permissions: string[];
            roles: string[];
            impersonating: Impersonation | null;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
