import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Camera, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/profile';
import { disable, enable } from '@/routes/two-factor';
import { send } from '@/routes/verification';

type Props = {
    mustVerifyEmail: boolean;
    status?: string;
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Profile({
    mustVerifyEmail,
    status,
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const { auth } = usePage().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        auth.user.avatar_path ? `/storage/${auth.user.avatar_path}` : null,
    );

    const initials = auth.user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (ev) => {
                setAvatarPreview(ev.target?.result as string);
            };

            reader.readAsDataURL(file);
        }
    }

    return (
        <>
            <Head title="Profile" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    title="Profile"
                    description="Manage your personal details and security settings."
                />

                <Form
                    {...ProfileController.update.form()}
                    encType="multipart/form-data"
                    options={{ preserveScroll: true }}
                    className="max-w-3xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal details</CardTitle>
                                <CardDescription>
                                    Keep your name, email, and avatar up to date.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-2">
                                    <Label>Avatar</Label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="group relative"
                                        >
                                            <Avatar className="h-20 w-20">
                                                {avatarPreview && (
                                                    <AvatarImage src={avatarPreview} alt={auth.user.name} />
                                                )}
                                                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Camera className="h-6 w-6 text-white" />
                                            </div>
                                        </button>
                                        <div className="text-sm text-muted-foreground">
                                            <p>Click the avatar to upload a new photo.</p>
                                            <p>JPG, PNG or WebP. Max 2MB.</p>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        id="avatar"
                                        type="file"
                                        name="avatar"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                    <InputError className="mt-2" message={errors.avatar} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to resend the verification email.
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing} data-test="update-profile-button">
                                        Save changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </Form>

                <section id="security" className="scroll-mt-24 space-y-6">
                    <Heading
                        variant="small"
                        title="Security"
                        description="Strengthen your account with a strong password and 2FA."
                    />

                    <Card className="max-w-3xl">
                        <CardHeader>
                            <CardTitle>Update password</CardTitle>
                            <CardDescription>
                                Use a long, unique password to keep your account secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...SecurityController.update.form()}
                                options={{ preserveScroll: true }}
                                resetOnError={[
                                    'password',
                                    'password_confirmation',
                                    'current_password',
                                ]}
                                resetOnSuccess
                                onError={(errors) => {
                                    if (errors.password) {
                                        passwordInput.current?.focus();
                                    }

                                    if (errors.current_password) {
                                        currentPasswordInput.current?.focus();
                                    }
                                }}
                                className="space-y-6"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="current_password">
                                                Current password
                                            </Label>

                                            <PasswordInput
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                name="current_password"
                                                autoComplete="current-password"
                                                placeholder="Current password"
                                            />

                                            <InputError message={errors.current_password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">New password</Label>

                                            <PasswordInput
                                                id="password"
                                                ref={passwordInput}
                                                name="password"
                                                autoComplete="new-password"
                                                placeholder="New password"
                                            />

                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirm password
                                            </Label>

                                            <PasswordInput
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                autoComplete="new-password"
                                                placeholder="Confirm password"
                                            />

                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button disabled={processing} data-test="update-password-button">
                                                Save password
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    {canManageTwoFactor && (
                        <Card className="max-w-3xl">
                            <CardHeader>
                                <CardTitle>Two-factor authentication</CardTitle>
                                <CardDescription>
                                    Add a second layer of security to your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {twoFactorEnabled ? (
                                    <div className="flex flex-col items-start justify-start space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            You will be prompted for a secure, random pin during login, which you can retrieve from the TOTP app on your phone.
                                        </p>

                                        <div className="relative inline">
                                            <Form {...disable.form()}>
                                                {({ processing }) => (
                                                    <Button
                                                        variant="destructive"
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        Disable 2FA
                                                    </Button>
                                                )}
                                            </Form>
                                        </div>

                                        <TwoFactorRecoveryCodes
                                            recoveryCodesList={recoveryCodesList}
                                            fetchRecoveryCodes={fetchRecoveryCodes}
                                            errors={errors}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start justify-start space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            When you enable two-factor authentication, you will be prompted for a secure pin during login.
                                        </p>

                                        <div>
                                            {hasSetupData ? (
                                                <Button onClick={() => setShowSetupModal(true)}>
                                                    <ShieldCheck />
                                                    Continue setup
                                                </Button>
                                            ) : (
                                                <Form
                                                    {...enable.form()}
                                                    onSuccess={() => setShowSetupModal(true)}
                                                >
                                                    {({ processing }) => (
                                                        <Button type="submit" disabled={processing}>
                                                            Enable 2FA
                                                        </Button>
                                                    )}
                                                </Form>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {showSetupModal && (
                                    <TwoFactorSetupModal
                                        open={showSetupModal}
                                        onClose={() => {
                                            setShowSetupModal(false);
                                            clearSetupData();
                                        }}
                                        qrCodeSvg={qrCodeSvg}
                                        manualSetupKey={manualSetupKey}
                                        requiresConfirmation={requiresConfirmation}
                                        fetchRecoveryCodes={fetchRecoveryCodes}
                                        errors={errors}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    )}
                </section>

                <DeleteUser />
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile',
            href: edit(),
        },
    ],
};
