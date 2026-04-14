# Starter Kit — Laravel 13 + Inertia.js (React)

Opinionated starter kit for building modern admin dashboards and SaaS-style apps with **Laravel 13**, **Inertia v3**, **React 19**, and **Tailwind CSS v4**.

This repository includes a growing set of production-grade modules: settings stored in DB (with Redis cache), role/permission management, media library, notifications, audit logs, API v1 (Sanctum), i18n, and more.

---

## Tech Stack

- **Backend**: Laravel 13 (PHP 8.3)
- **Frontend**: Inertia.js v3 + React 19 + Vite
- **UI**: Tailwind CSS v4 + Radix UI primitives
- **Auth**: Laravel Fortify (+ optional 2FA)
- **RBAC**: Spatie Laravel Permission
- **Audit log**: Spatie Activitylog
- **Media**: Spatie Media Library
- **API**: `/api/v1/*` with Sanctum (personal access tokens)
- **Docs**: Scramble (OpenAPI UI)
- **Monitoring (optional)**: Sentry
- **Performance tooling**: Telescope (dev) + Horizon (queue monitor)

---

## Requirements

- PHP **8.3**
- Composer
- Node.js + npm
- A database (SQLite / MySQL)
- Redis (recommended)
  - Required for: **Horizon**, tagged caches, and some settings caches
  - App attempts to **fail-open** in places where Redis is optional

---

## Quick Start

From the repo root:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
npm run dev
```

Or use the bundled setup script:

```bash
composer run setup
```

Run the full dev stack (server + queue + logs + Vite) using:

```bash
composer run dev
```

---

## Default Seeded Accounts

`php artisan migrate --seed` seeds roles, permissions, and sample users.

- **Super Admin**
  - Email: `superadmin@example.com`
  - Password: `password`
- **Admin**
  - Email: `admin@example.com`
  - Password: `password`

> The `super-admin` role is all-powerful via a `Gate::before` rule.

---

## App Modules (Highlights)

### Settings (DB-backed + Redis cache)

- Admin settings under `/settings/*`:
  - **App Settings**: name, logo, timezone, locale, maintenance mode
  - **Mail Settings**: providers & secrets (stored encrypted in DB), send test email
  - **Feature Flags**: enable/disable by environment and allowlist users/roles
- Access rules are permission-based:
  - `settings.app.manage`, `settings.mail.manage`, `settings.flags.manage`

### User Management

- CRUD **Users** and **Roles** (Spatie Permission)
- Role `super-admin` is **read-only**
- Permissions are created via seeder `database/seeders/RolePermissionSeeder.php`

### Media Library

- Admin-only media module under `/media`
- Upload files/images and manage assets
- Thumbnail/WebP conversions via Spatie Media Library
- Chunked uploads supported (large files)

### Notifications

- In-app notifications:
  - Bell polling endpoint: `/notifications/poll`
  - Full list: `/notifications`
  - Mark read / mark all read
- Notification preferences stored per user

### Audit Trail (Activity Log)

- Admin page: `/settings/activity`
- Logs changes on key models with before/after diffs (secrets masked)

### i18n (Internationalization)

- Backend translations via Laravel `lang/*`
- Frontend translations shared via Inertia and consumed via `useTranslation()`
- Locale switcher persisted (session for guests, `users.locale` for authenticated)

### API Layer (v1)

- Base API routes: `routes/api.php`
- Versioned routes: `/api/v1/*`
- Auth (Sanctum token-based):
  - `POST /api/v1/auth/tokens` → issue token
  - `DELETE /api/v1/auth/tokens/current` → revoke current token
  - `GET /api/v1/me` → current user resource (requires Bearer token)

API docs:
- `GET /api/docs` → redirects to Scramble UI (default Scramble path is `/docs/api`)
- `GET /api/docs.json` → OpenAPI JSON

Health check:
- `GET /api/health` → checks database/cache/queue/storage and returns 200 or 503

---

## Dev Tools

### Telescope (dev-only)

- Path: `/telescope`
- Access:
  - Enabled by default only when `APP_ENV=local` (or explicitly `TELESCOPE_ENABLED=true`)
  - Gate `viewTelescope` allows access for role `admin` (and `super-admin` via bypass)

### Horizon (queue monitor)

- Path: `/horizon`
- Requires Redis queue (`QUEUE_CONNECTION=redis`)
- Gate `viewHorizon` allows access for role `admin` (and `super-admin` via bypass)

---

## Environment Variables (common)

See `.env.example` for the full list. Common ones:

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

Run all tests:

```bash
php artisan test
```

Run a subset:

```bash
php artisan test --compact tests/Feature/Api/V1/ApiAuthTest.php
```

---

## Notes for Production

- Ensure `APP_ENV=production` and `APP_DEBUG=false`.
- Keep **Telescope disabled** in production (`TELESCOPE_ENABLED=false`).
- Configure Redis and Horizon for stable queues.
- Configure Sentry by setting `SENTRY_DSN` (optional).

---

## Contributing

PRs are welcome. Please:

- Keep changes focused and consistent with existing conventions.
- Add/adjust Pest tests for behavior changes.
- Run `vendor/bin/pint --dirty --format agent` and relevant tests before submitting.

---

## License

MIT (see `composer.json` for current license metadata).

