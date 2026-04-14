<?php

use App\Models\Setting;
use App\Services\SettingsService;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    config(['cache.stores.redis.driver' => 'array']);
});

test('settings helper reads from db and caches in redis store', function () {
    /** @var SettingsService $service */
    $service = app(SettingsService::class);

    $service->set('app.name', 'My App', 'string');

    expect(Cache::store('redis')->has('settings:all'))->toBeFalse();
    expect(settings('app.name'))->toBe('My App');
    expect(Cache::store('redis')->has('settings:all'))->toBeTrue();

    $service->set('app.name', 'My App 2', 'string');
    expect(Cache::store('redis')->has('settings:all'))->toBeFalse();
    expect(settings('app.name'))->toBe('My App 2');
});

test('encrypted settings are stored encrypted and returned decrypted', function () {
    /** @var SettingsService $service */
    $service = app(SettingsService::class);

    $service->set('mail.smtp.password', 'secret', 'string', encrypted: true);

    $setting = Setting::query()->where('key', 'mail.smtp.password')->firstOrFail();
    expect($setting->is_encrypted)->toBeTrue();
    expect($setting->value)->not->toBe('secret');

    expect(settings('mail.smtp.password'))->toBe('secret');
});

test('empty strings unset values and fall back to default', function () {
    /** @var SettingsService $service */
    $service = app(SettingsService::class);

    $service->set('app.name', 'My App', 'string');
    expect(settings('app.name', 'Default App'))->toBe('My App');

    $service->set('app.name', '   ', 'string');

    expect(settings('app.name', 'Default App'))->toBe('Default App');
    expect(Setting::query()->where('key', 'app.name')->exists())->toBeFalse();
});
