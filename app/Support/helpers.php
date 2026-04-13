<?php

use App\Services\SettingsService;

if (! function_exists('settings')) {
    /**
     * Get a setting value from the database-backed settings store.
     */
    function settings(?string $key = null, mixed $default = null): mixed
    {
        $service = app(SettingsService::class);

        if ($key === null) {
            return $service;
        }

        return $service->get($key, $default);
    }
}
