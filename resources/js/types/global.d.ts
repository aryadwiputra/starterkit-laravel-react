import type { Auth, Impersonation } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            appLogoUrl: string | null;
            auth: Auth;
            permissions: string[];
            roles: string[];
            features: string[];
            impersonating: Impersonation | null;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
