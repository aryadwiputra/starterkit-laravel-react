<?php

return [
    'meta_title' => ':app — Starter Kit Laravel Inertia React',
    'nav' => [
        'features' => 'Fitur',
        'quickstart' => 'Mulai cepat',
        'usage' => 'Cara pakai',
        'links' => 'Link',
    ],
    'hero' => [
        'kicker' => 'Laravel 13 · Inertia v3 · React 19 · Tailwind v4',
        'title' => 'Bangun dashboard admin modern, lebih cepat.',
        'description' => 'Starter kit yang opinionated dengan modul siap pakai untuk production: settings di database, RBAC, media library, notifikasi, audit log, API v1, i18n, dan lainnya.',
        'primary_cta' => 'Mulai cepat',
        'secondary_cta' => 'Lihat fitur',
        'note' => 'Tips: sebagian besar konfigurasi bisa diatur dari UI (DB-backed settings) tanpa restart server.',
        'side' => [
            'title' => 'Siap untuk develop',
            'description' => 'Starter kit modular yang fokus pada speed dan maintainability.',
            'stats' => [
                'stack' => 'Tech stack',
                'stack_value' => 'Laravel 13 · Inertia v3 · React 19 · Tailwind v4',
                'modules' => 'Modul tersedia',
                'modules_value' => 'Settings, RBAC, Media, Notifikasi, Audit Log, API v1, i18n, dan lainnya',
            ],
            'cta' => [
                'title' => 'Lompat ke',
                'features' => 'Fitur',
                'links' => 'Link penting',
            ],
        ],
    ],
    'sections' => [
        'features' => [
            'title' => 'Apa saja yang kamu dapatkan',
            'description' => 'Ringkasan modul dan kemampuan yang sudah tersedia di starter kit ini.',
        ],
        'quickstart' => [
            'title' => 'Mulai cepat',
            'description' => 'Install dependency, migrate database, dan jalankan dev stack.',
        ],
        'accounts' => [
            'title' => 'Akun default (Seeder)',
            'description' => 'Gunakan akun ini setelah menjalankan seeder database.',
        ],
        'usage' => [
            'title' => 'Cara kerja',
            'description' => 'Alur singkat untuk memahami starter kit ini dan lanjut mengembangkan fitur.',
        ],
        'links' => [
            'title' => 'Link penting',
            'description' => 'Endpoint berguna untuk dokumentasi, monitoring, dan health check.',
        ],
    ],
    'features' => [
        'settings' => [
            'title' => 'Admin settings (DB-backed)',
            'description' => 'Atur App/Mail/Feature Flags dari UI, tersimpan di database dengan cache Redis.',
        ],
        'rbac' => [
            'title' => 'RBAC (Roles & Permissions)',
            'description' => 'Manajemen user/role berbasis Spatie Permission dan policy authorization.',
        ],
        'media' => [
            'title' => 'Media library',
            'description' => 'Upload dan kelola file/gambar dengan conversion (thumbnail + WebP) dan chunked upload.',
        ],
        'notifications' => [
            'title' => 'Notifikasi',
            'description' => 'Notifikasi in-app dengan polling, plus preferensi user per channel/tipe.',
        ],
        'audit' => [
            'title' => 'Audit trail',
            'description' => 'Lacak perubahan model penting dengan before/after diff (secret dimasking).',
        ],
        'i18n' => [
            'title' => 'Internasionalisasi (i18n)',
            'description' => 'Terjemahan backend + frontend, dengan locale switcher (session/user).',
        ],
        'api' => [
            'title' => 'API v1 + docs',
            'description' => 'REST API versioned dengan Sanctum token, terdokumentasi via Scramble.',
        ],
        'health' => [
            'title' => 'Health checks',
            'description' => 'Endpoint publik `/api/health` untuk cek DB/cache/queue/storage (monitoring).',
        ],
        'errors_security' => [
            'title' => 'Error & security',
            'description' => 'Halaman error branded dan default security yang aman (CSRF, escape output, headers).',
        ],
        'perf' => [
            'title' => 'Tooling performa',
            'description' => 'Telescope untuk debugging (dev) dan Horizon untuk monitor queue (Redis).',
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

# atau jalankan semuanya:
composer run setup

# dev stack (server + queue + logs + vite):
composer run dev
BASH,
        'note' => 'Jika perubahan UI tidak terlihat, jalankan `npm run dev` atau `npm run build` sesuai environment kamu.',
    ],
    'accounts' => [
        'email' => 'Email',
        'password' => 'Password',
        'super_admin' => [
            'title' => 'Super Admin',
            'description' => 'Akses penuh via Gate::before.',
            'note' => 'Role ini bersifat read-only di modul Roles (tidak bisa edit/delete).',
        ],
        'admin' => [
            'title' => 'Admin',
            'description' => 'Role admin standar dengan permission manajemen umum.',
            'note' => 'Permission bisa disesuaikan lewat modul Roles jika dibutuhkan.',
        ],
    ],
    'usage' => [
        'flow' => [
            'title' => 'Alur yang disarankan',
            'description' => 'Jalur sederhana untuk eksplorasi dan mulai develop.',
        ],
        'steps' => [
            'Jalankan perintah Mulai cepat lalu login sebagai admin.',
            'Buka Settings untuk konfigurasi App/Mail/Feature Flags (DB override fallback env).',
            'Kelola akses lewat Users & Roles (Spatie Permission).',
            'Gunakan Media Library untuk upload file (support chunked uploads).',
            'Gunakan `make:module` dan `inertia:types` agar develop lebih cepat.',
        ],
        'tips' => [
            'title' => 'Tips',
            'description' => 'Hal kecil yang membantu kerja harian jadi lebih cepat.',
            'items' => [
                'Secret untuk Mail settings terenkripsi dan tidak pernah ditampilkan kembali di UI.',
                'Kosongkan field settings untuk mewarisi nilai dari `.env` (tanpa menulis file).',
                'Jalankan test Pest dan Pint secara rutin; pre-commit hook membantu mencegah regresi.',
            ],
        ],
    ],
    'links' => [
        'items' => [
            'api_docs' => [
                'label' => 'Dokumentasi API (/api/docs)',
                'description' => 'UI Scramble untuk dokumentasi OpenAPI.',
            ],
            'openapi' => [
                'label' => 'OpenAPI JSON (/api/docs.json)',
                'description' => 'Spesifikasi OpenAPI dalam format JSON (machine-readable).',
            ],
            'health' => [
                'label' => 'Health check (/api/health)',
                'description' => 'Cek database/cache/queue/storage dan return 200 atau 503.',
            ],
            'horizon' => [
                'label' => 'Horizon (/horizon)',
                'description' => 'Dashboard queue (butuh Redis queue + user authorized).',
            ],
            'telescope' => [
                'label' => 'Telescope (/telescope)',
                'description' => 'Tool debugging (dev-only, butuh user authorized).',
            ],
        ],
    ],
    'footer' => [
        'license' => 'Open source — Lisensi MIT.',
        'readme' => 'Lihat README.md di repository ini untuk detail lengkap.',
    ],
];
