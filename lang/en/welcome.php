<?php

return [
    'meta_title' => ':app — Laravel Inertia React Starter Kit',
    'nav' => [
        'features' => 'Features',
        'quickstart' => 'Quickstart',
        'usage' => 'How to use',
        'links' => 'Links',
    ],
    'hero' => [
        'kicker' => 'Laravel 13 · Inertia v3 · React 19 · Tailwind v4',
        'title' => 'Build modern admin dashboards, faster.',
        'description' => 'An opinionated starter kit with production-ready modules: settings in database, RBAC, media library, notifications, audit log, API v1, i18n, and more.',
        'primary_cta' => 'Quickstart',
        'secondary_cta' => 'Explore features',
        'note' => 'Tip: most configuration can be managed from the UI (DB-backed settings) without server restarts.',
        'side' => [
            'title' => 'Ready to build',
            'description' => 'A modular starter kit designed for speed and maintainability.',
            'checks' => [
                'Production-ready modules',
                'i18n & localization support',
            ],
            'stats' => [
                'stack' => 'Tech stack',
                'stack_value' => 'Laravel 13 · Inertia v3 · React 19 · Tailwind v4',
                'modules' => 'Included modules',
                'modules_value' => 'Settings, RBAC, Media, Notifications, Audit Log, API v1, i18n, and more',
            ],
            'cta' => [
                'title' => 'Jump to',
                'features' => 'Features',
                'links' => 'Important links',
            ],
        ],
    ],
    'sections' => [
        'features' => [
            'title' => 'What you get',
            'description' => 'A quick overview of the modules and capabilities included in this starter kit.',
        ],
        'quickstart' => [
            'title' => 'Quickstart',
            'description' => 'Install dependencies, run migrations, and start the dev stack.',
        ],
        'accounts' => [
            'title' => 'Default accounts (Seeder)',
            'description' => 'Use these accounts after running the database seeders.',
        ],
        'usage' => [
            'title' => 'How it works',
            'description' => 'A short flow that helps you explore the starter kit and continue development.',
        ],
        'links' => [
            'title' => 'Important links',
            'description' => 'Useful endpoints for docs, monitoring, and health checks.',
        ],
    ],
    'features' => [
        'settings' => [
            'title' => 'Admin settings (DB-backed)',
            'description' => 'Manage App/Mail/Feature Flags from UI, stored in database with Redis caching.',
        ],
        'rbac' => [
            'title' => 'RBAC (Roles & Permissions)',
            'description' => 'User/Role management with Spatie Permission and policy-based authorization.',
        ],
        'media' => [
            'title' => 'Media library',
            'description' => 'Upload and manage files/images with conversions (thumbnail + WebP) and chunked upload.',
        ],
        'notifications' => [
            'title' => 'Notifications',
            'description' => 'In-app notifications with polling, plus user preferences per channel/type.',
        ],
        'audit' => [
            'title' => 'Audit trail',
            'description' => 'Track changes across key models with before/after diffs (secrets masked).',
        ],
        'i18n' => [
            'title' => 'Internationalization (i18n)',
            'description' => 'Backend + frontend translations, with locale switcher and user/session persistence.',
        ],
        'api' => [
            'title' => 'API v1 + docs',
            'description' => 'Versioned REST API using Sanctum personal access tokens, documented via Scramble.',
        ],
        'health' => [
            'title' => 'Health checks',
            'description' => 'Public `/api/health` endpoint checks DB/cache/queue/storage for monitoring.',
        ],
        'errors_security' => [
            'title' => 'Errors & security',
            'description' => 'Branded error pages and secure defaults (CSRF, output escaping, headers).',
        ],
        'perf' => [
            'title' => 'Performance tooling',
            'description' => 'Telescope for debugging (dev) and Horizon for queue monitoring (Redis).',
        ],
    ],
    'quickstart' => [
        'commands' => <<<'BASH'
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
npm run dev

# or run everything:
composer run setup

# dev stack (server + queue + logs + vite):
composer run dev
BASH,
        'note' => 'If the UI does not update, run `npm run dev` or `npm run build` depending on your environment.',
    ],
    'accounts' => [
        'email' => 'Email',
        'password' => 'Password',
        'super_admin' => [
            'title' => 'Super Admin',
            'description' => 'Full access via Gate::before.',
            'note' => 'This role is read-only in Roles module (cannot be edited/deleted).',
        ],
        'admin' => [
            'title' => 'Admin',
            'description' => 'Standard admin role with common management permissions.',
            'note' => 'Permissions can be adjusted via Roles module if needed.',
        ],
    ],
    'usage' => [
        'pro_tip' => [
            'title' => 'Pro tip',
        ],
        'flow' => [
            'title' => 'Suggested flow',
            'description' => 'A simple path to explore and start building.',
        ],
        'steps' => [
            'Run Quickstart commands and login as admin.',
            'Open Settings to configure App/Mail/Feature Flags (DB overrides env fallback).',
            'Use Users & Roles to manage access (Spatie Permission).',
            'Use Media Library to upload files (supports chunked uploads).',
            'Use `make:module` and `inertia:types` to speed up development.',
        ],
        'tips' => [
            'title' => 'Tips',
            'description' => 'Small things that save time in day-to-day development.',
            'items' => [
                'Mail settings secrets are encrypted and never echoed back to the UI.',
                'Leave settings fields empty to inherit values from `.env` (no file writes).',
                'Run Pest tests and Pint regularly; pre-commit hooks help prevent regressions.',
            ],
        ],
    ],
    'links' => [
        'items' => [
            'api_docs' => [
                'label' => 'API documentation (/api/docs)',
                'description' => 'Scramble UI for OpenAPI documentation.',
            ],
            'openapi' => [
                'label' => 'OpenAPI JSON (/api/docs.json)',
                'description' => 'Machine-readable OpenAPI spec.',
            ],
            'health' => [
                'label' => 'Health check (/api/health)',
                'description' => 'Checks database/cache/queue/storage and returns 200 or 503.',
            ],
            'horizon' => [
                'label' => 'Horizon (/horizon)',
                'description' => 'Queue dashboard (requires Redis queue + authorized user).',
            ],
            'telescope' => [
                'label' => 'Telescope (/telescope)',
                'description' => 'Debugging tool (dev-only, requires authorized user).',
            ],
        ],
    ],
    'footer' => [
        'license' => 'Open source — MIT License.',
        'readme' => 'See README.md in this repository for full details.',
    ],
];
