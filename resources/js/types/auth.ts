export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    avatar_path?: string | null;
    email_verified_at: string | null;
    locale?: string | null;
    two_factor_enabled?: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    roles?: { id: number; name: string }[];
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

export type Impersonation = {
    original_user_id: number;
    original_user_name: string;
};
