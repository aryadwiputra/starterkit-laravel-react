# Developer Experience (DX)

Dokumen ini menjelaskan fitur DX pada starter kit ini: generator module, Inertia shared props yang type‑safe, IDE helper, quality gate (Pint + PHPStan + ESLint/Prettier) via Husky, dan fondasi testing dengan Pest.

## 1) Generator Module: `php artisan make:module`

Command ini membuat scaffolding end‑to‑end untuk sebuah module CRUD berbasis **Laravel + Inertia React**.

Contoh:

```bash
php artisan make:module Post
```

Output (minimal):

- Backend:
  - `app/Models/Post.php`
  - `database/migrations/*_create_posts_table.php`
  - `app/Http/Controllers/PostController.php` (index/create/store/edit/update/destroy)
  - `app/Http/Requests/StorePostRequest.php`, `app/Http/Requests/UpdatePostRequest.php`
  - `app/Policies/PostPolicy.php`
  - `app/Http/Resources/PostResource.php`
  - `app/Services/PostService.php`
- Frontend:
  - `resources/js/pages/posts/index.tsx`
  - `resources/js/pages/posts/create.tsx`
  - `resources/js/pages/posts/edit.tsx`
  - `resources/js/types/post.ts`
- Wiring otomatis:
  - Menambahkan `Route::resource('posts', PostController::class)` ke `routes/web.php` (idempotent).
  - Menambahkan `Gate::policy(Post::class, PostPolicy::class)` ke `app/Providers/AppServiceProvider.php` (idempotent).

Catatan:
- Generator ini **idempotent**: aman dijalankan ulang, tidak menduplikasi route/policy dan tidak membuat migration kedua untuk table yang sama.
- Secara default command akan menjalankan `php artisan wayfinder:generate --with-form` agar import `@/actions/*` dan `.form()` siap dipakai di React.

Opsi:

```bash
php artisan make:module Post --no-wayfinder
```

## 2) Type Safety: `php artisan inertia:types`

Starter kit ini memakai “single source of truth” untuk shared props Inertia di:

- `app/Inertia/SharedProps.php`

Shared props kemudian di‑share oleh:

- `app/Http/Middleware/HandleInertiaRequests.php`

Untuk menghindari mismatch antara PHP dan TypeScript, gunakan:

```bash
composer inertia:types
```

Command ini akan menulis ulang:

- `resources/js/types/global.d.ts`

Tips:
- Jika kamu menambah/mengubah shared props di `SharedProps::toArray()`, jalankan lagi `composer inertia:types`.

## 3) IDE Helper (PhpStorm / Intelephense)

Paket `barryvdh/laravel-ide-helper` sudah disiapkan sebagai dev dependency.

Generate ulang helper:

```bash
composer ide-helper
```

File hasil generate di‑ignore oleh Git:
- `_ide_helper.php`
- `.phpstorm.meta.php`

## 4) Code Quality (Pint + PHPStan + ESLint + Prettier)

Backend:
- Pint:
  - `composer lint`
  - `composer lint:check`
- PHPStan (Larastan):
  - `composer analyze` (level 6, lihat `phpstan.neon`)

Frontend:
- ESLint:
  - `npm run lint`
  - `npm run lint:check`
- Prettier:
  - `npm run format`
  - `npm run format:check`
- TypeScript:
  - `npm run types:check`

## 5) Husky + lint-staged (pre-commit)

Hook pre-commit akan:

1) Auto-fix JS/TS (ESLint + Prettier) hanya untuk file yang berubah.
2) Memblok commit jika Pint/PHPStan gagal.

Setup (sekali, setelah clone):

```bash
npm install
```

Husky akan aktif via script `prepare`.

## 6) Testing Foundation (Pest)

Helpers global tersedia di `tests/Pest.php`:

- `asAdmin()`
- `asSuperAdmin()`
- `asUser()`

Helpers tersebut akan:
- seed `RolePermissionSeeder`
- membuat user dengan role yang sesuai
- otomatis `actingAs()`

Coverage (membutuhkan Xdebug/PCOV):

```bash
composer test:coverage
```

