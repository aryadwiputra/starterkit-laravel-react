# Starter Kit — Laravel 13 + Inertia.js (React)

Starter kit yang opinionated untuk membangun dashboard admin modern dan aplikasi bergaya SaaS dengan **Laravel 13**, **Inertia v3**, **React 19**, dan **Tailwind CSS v4**.

Repository ini berisi kumpulan modul yang terus bertambah dan siap dipakai di production: settings tersimpan di DB (dengan cache Redis), manajemen role/permission, media library, notifikasi, audit log, API v1 (Sanctum), i18n, dan lainnya.

---

## Tech Stack

- **Backend**: Laravel 13 (PHP 8.3)
- **Frontend**: Inertia.js v3 + React 19 + Vite
- **UI**: Tailwind CSS v4 + Radix UI primitives
- **Auth**: Laravel Fortify (+ optional 2FA)
- **RBAC**: Spatie Laravel Permission
- **Audit log**: Spatie Activitylog
- **Media**: Spatie Media Library
- **API**: `/api/v1/*` dengan Sanctum (personal access tokens)
- **Dokumentasi**: Scramble (OpenAPI UI)
- **Monitoring (optional)**: Sentry
- **Performa (tooling)**: Telescope (dev) + Horizon (monitor queue)

---

## Kebutuhan

- PHP **8.3**
- Composer
- Node.js + npm
- A database (SQLite / MySQL)
- Database (SQLite / MySQL)
- Redis (direkomendasikan)
  - Dibutuhkan untuk: **Horizon**, cache bertag, dan sebagian cache settings
  - Aplikasi berusaha **fail-open** saat Redis bersifat opsional

---

## Mulai Cepat

Dari root repo:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
npm run dev
```

Atau gunakan script setup yang sudah tersedia:

```bash
composer run setup
```

Jalankan full dev stack (server + queue + logs + Vite) dengan:

```bash
composer run dev
```

---

## Akun Default (Seeder)

`php artisan migrate --seed` akan membuat roles, permissions, dan sample users.

- **Super Admin**
  - Email: `superadmin@example.com`
  - Password: `password`
- **Admin**
  - Email: `admin@example.com`
  - Password: `password`

> Role `super-admin` punya akses penuh via rule `Gate::before`.

---

## Modul Aplikasi (Ringkasan)

### Settings (DB-backed + cache Redis)

- Settings admin ada di `/settings/*`:
  - **App Settings**: name, logo, timezone, locale, maintenance mode
  - **Mail Settings**: providers & secrets (stored encrypted in DB), send test email
  - **Feature Flags**: enable/disable by environment and allowlist users/roles
- Akses berbasis permission:
  - `settings.app.manage`, `settings.mail.manage`, `settings.flags.manage`

### User Management

- CRUD **Users** and **Roles** (Spatie Permission)
- Role `super-admin` bersifat **read-only**
- Permissions are created via seeder `database/seeders/RolePermissionSeeder.php`

### Media Library

- Modul media khusus admin di `/media`
- Upload files/images and manage assets
- Thumbnail/WebP conversions via Spatie Media Library
- Chunked uploads supported (large files)

### Notifications

- Notifikasi in-app:
  - Bell polling endpoint: `/notifications/poll`
  - Full list: `/notifications`
  - Mark read / mark all read
- Preferensi notifikasi tersimpan per user

### Audit Trail (Activity Log)

- Admin page: `/settings/activity`
- Logs changes on key models with before/after diffs (secrets masked)

### i18n (Internasionalisasi)

- Terjemahan backend via Laravel `lang/*`
- Frontend translations shared via Inertia and consumed via `useTranslation()`
- Locale switcher tersimpan (session untuk guest, `users.locale` untuk user login)

### API Layer (v1)

- Base API routes: `routes/api.php`
- Versioned routes: `/api/v1/*`
- Auth (Sanctum token-based):
  - `POST /api/v1/auth/tokens` → issue token
  - `DELETE /api/v1/auth/tokens/current` → revoke current token
  - `GET /api/v1/me` → current user resource (requires Bearer token)

- Dokumentasi API:
  - `GET /api/docs` → redirects to Scramble UI (default Scramble path is `/docs/api`)
  - `GET /api/docs.json` → OpenAPI JSON

- Health check:
  - `GET /api/health` → checks database/cache/queue/storage and returns 200 or 503

---

## Dev Tools

### Telescope (khusus development)

- Path: `/telescope`
- Access:
  - Default aktif hanya saat `APP_ENV=local` (atau set `TELESCOPE_ENABLED=true`)
  - Gate `viewTelescope` mengizinkan role `admin` (dan `super-admin` via bypass)

### Horizon (monitor queue)

- Path: `/horizon`
- Requires Redis queue (`QUEUE_CONNECTION=redis`)
- Gate `viewHorizon` mengizinkan role `admin` (dan `super-admin` via bypass)

---

## Environment Variables (umum)

Lihat `.env.example` untuk daftar lengkap. Beberapa yang sering dipakai:

- `APP_ENV`, `APP_DEBUG`, `APP_URL`
- `DB_CONNECTION` (SQLite by default in this repo)
- `CACHE_STORE=redis`
- `QUEUE_CONNECTION=redis`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `SENTRY_DSN` (optional)

---

## Scripts

### Backend (Composer)

```bash
composer run dev
composer run setup
composer run lint
composer run test
```

### Frontend (npm)

```bash
npm run dev
npm run build
npm run types:check
npm run lint:check
npm run format:check
```

---

## Testing

Jalankan semua test:

```bash
php artisan test
```

Jalankan subset:

```bash
php artisan test --compact tests/Feature/Api/V1/ApiAuthTest.php
```

---

## Catatan Production

- Ensure `APP_ENV=production` and `APP_DEBUG=false`.
- Pastikan **Telescope disabled** di production (`TELESCOPE_ENABLED=false`).
- Configure Redis and Horizon for stable queues.
- Configure Sentry by setting `SENTRY_DSN` (optional).

---

## Kontribusi

PR sangat diterima. Mohon:

- Keep changes focused and consistent with existing conventions.
- Add/adjust Pest tests for behavior changes.
- Run `vendor/bin/pint --dirty --format agent` and relevant tests before submitting.

---

## Lisensi

MIT (see `composer.json` for current license metadata).
