<?php

namespace App\Http\Middleware;

use App\Services\FeatureFlagService;
use App\Services\TranslationsResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $featureFlags = app(FeatureFlagService::class);
        $translations = app(TranslationsResolver::class)->resolve($request);

        $logoPath = settings('app.logo_path');
        $logoUrl = is_string($logoPath) && $logoPath !== '' ? Storage::disk('public')->url($logoPath) : null;

        return [
            ...parent::share($request),
            'name' => settings('app.name', config('app.name')),
            'appLogoUrl' => $logoUrl,
            'auth' => [
                'user' => $user,
            ],
            'permissions' => $user ? $user->getAllPermissions()->pluck('name')->toArray() : [],
            'roles' => $user ? $user->getRoleNames()->toArray() : [],
            'features' => $featureFlags->enabledKeysForUser($user),
            'impersonating' => $request->session()->has('impersonate.original_id') ? [
                'original_user_id' => $request->session()->get('impersonate.original_id'),
                'original_user_name' => $request->session()->get('impersonate.original_name'),
            ] : null,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => app()->getLocale(),
            'fallbackLocale' => config('app.fallback_locale'),
            'availableLocales' => config('app.available_locales', []),
            'localeLabels' => config('app.locale_labels', []),
            'translations' => $translations,
        ];
    }
}
