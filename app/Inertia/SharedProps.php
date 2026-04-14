<?php

namespace App\Inertia;

use App\Services\FeatureFlagService;
use App\Services\TranslationsResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SharedProps
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $featureFlags = app(FeatureFlagService::class);
        $translations = app(TranslationsResolver::class)->resolve($request);

        $logoPath = settings('app.logo_path');
        $logoUrl = is_string($logoPath) && $logoPath !== '' ? Storage::disk('public')->url($logoPath) : null;

        return [
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

    public function typescriptDefinition(): string
    {
        return <<<'TS'
import type { Auth, Impersonation } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            appLogoUrl: string | null;
            auth: Auth;
            permissions: string[];
            roles: string[];
            features: string[];
            impersonating: Impersonation | null;
            sidebarOpen: boolean;
            locale: string;
            fallbackLocale: string;
            availableLocales: string[];
            localeLabels: Record<string, string>;
            translations: Record<string, unknown>;
            [key: string]: unknown;
        };
    }
}
TS;
    }
}
