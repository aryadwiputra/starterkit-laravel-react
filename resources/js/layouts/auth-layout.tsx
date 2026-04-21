import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';

export default function AuthLayout({
    title = '',
    description = '',
    variant = 'split',
    children,
}: {
    title?: string;
    description?: string;
    variant?: 'split' | 'simple';
    children: React.ReactNode;
}) {
    const Template = variant === 'simple' ? AuthSimpleLayout : AuthSplitLayout;

    return (
        <Template title={title} description={description}>
            {children}
        </Template>
    );
}
