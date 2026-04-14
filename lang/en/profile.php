<?php

return [
    'title' => 'Profile',
    'description' => 'Manage your personal details and security settings.',
    'fields' => [
        'avatar' => 'Avatar',
        'avatar_help' => 'Click the avatar to upload a new photo.',
        'avatar_help_2' => 'JPG, PNG or WebP. Max 2MB.',
        'name_placeholder' => 'Full name',
        'email_placeholder' => 'Email address',
        'current_password' => 'Current password',
        'new_password' => 'New password',
        'confirm_password' => 'Confirm password',
    ],
    'email_unverified' => 'Your email address is unverified.',
    'resend_verification' => 'Click here to resend the verification email.',
    'verification_sent' => 'A new verification link has been sent to your email address.',
    'sections' => [
        'personal' => [
            'title' => 'Personal details',
            'description' => 'Keep your name, email, and avatar up to date.',
        ],
        'security' => [
            'title' => 'Security',
            'description' => 'Strengthen your account with a strong password and 2FA.',
        ],
        'password' => [
            'title' => 'Update password',
            'description' => 'Use a long, unique password to keep your account secure.',
        ],
        'two_factor' => [
            'title' => 'Two-factor authentication',
            'description' => 'Add a second layer of security to your account.',
            'enabled_help' => 'You will be prompted for a secure, random pin during login, which you can retrieve from the TOTP app on your phone.',
            'disabled_help' => 'When you enable two-factor authentication, you will be prompted for a secure pin during login.',
        ],
    ],
    'actions' => [
        'save_password' => 'Save password',
        'enable_2fa' => 'Enable 2FA',
        'disable_2fa' => 'Disable 2FA',
        'continue_setup' => 'Continue setup',
    ],
    'delete' => [
        'title' => 'Delete account',
        'description' => 'Delete your account and all of its resources',
        'warning_title' => 'Warning',
        'warning_description' => 'Please proceed with caution, this cannot be undone.',
        'action' => 'Delete account',
        'confirm_title' => 'Are you sure you want to delete your account?',
        'confirm_description' => 'Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
    ],
    'two_factor' => [
        'manual_code' => 'or, enter the code manually',
        'enabled_title' => 'Two-factor authentication enabled',
        'enabled_description' => 'Two-factor authentication is now enabled. Scan the QR code or enter the setup key in your authenticator app.',
        'verify_title' => 'Verify authentication code',
        'verify_description' => 'Enter the 6-digit code from your authenticator app',
        'enable_title' => 'Enable two-factor authentication',
        'enable_description' => 'To finish enabling two-factor authentication, scan the QR code or enter the setup key in your authenticator app',
        'recovery_title' => '2FA recovery codes',
        'recovery_description' => 'Recovery codes let you regain access if you lose your 2FA device. Store them in a secure password manager.',
        'hide_recovery' => 'Hide recovery codes',
        'view_recovery' => 'View recovery codes',
        'regenerate' => 'Regenerate codes',
        'loading' => 'Loading recovery codes',
        'recovery_help' => 'Each recovery code can be used once to access your account and will be removed after use. If you need more, click Regenerate codes above.',
    ],
    'toast' => [
        'updated' => 'Profile updated.',
        'password_updated' => 'Password updated.',
    ],
];
