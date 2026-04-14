<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;

class TranslationsResolver
{
    /**
     * Resolve translations for the current request.
     *
     * @return array<string, array<string, mixed>>
     */
    public function resolve(Request $request): array
    {
        $routeName = $request->route()?->getName();
        $modules = $this->modulesForRoute($routeName);
        $locale = app()->getLocale();

        $translations = [];
        foreach ($modules as $module) {
            $translations[$module] = Lang::get($module, [], $locale);
        }

        return $translations;
    }

    /**
     * Determine translation modules for a given route name.
     *
     * @return array<int, string>
     */
    private function modulesForRoute(?string $routeName): array
    {
        $modules = ['common'];

        if (! $routeName) {
            return $modules;
        }

        if (str_starts_with($routeName, 'settings.')
            || str_starts_with($routeName, 'app-settings.')
            || str_starts_with($routeName, 'mail-settings.')
            || str_starts_with($routeName, 'feature-flags.')) {
            $modules[] = 'settings';
        }

        if (str_starts_with($routeName, 'users.')) {
            $modules[] = 'users';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'roles.')) {
            $modules[] = 'roles';
            $modules[] = 'users';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'profile.')) {
            $modules[] = 'profile';
        }

        if ($routeName === 'dashboard') {
            $modules[] = 'dashboard';
        }

        if ($routeName === 'home') {
            $modules[] = 'welcome';
        }

        if (str_starts_with($routeName, 'password.')
            || str_starts_with($routeName, 'verification.')
            || str_starts_with($routeName, 'two-factor.')
            || in_array($routeName, ['login', 'register'], true)) {
            $modules[] = 'auth';
        }

        if ($routeName === 'maintenance') {
            $modules[] = 'maintenance';
        }

        return array_values(array_unique($modules));
    }
}
