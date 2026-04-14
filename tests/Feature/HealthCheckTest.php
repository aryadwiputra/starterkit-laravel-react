<?php

use Illuminate\Support\Facades\Storage;

test('health endpoint returns ok when dependencies are healthy', function () {
    config([
        'app.debug' => false,
        'cache.default' => 'array',
        'cache.stores.redis' => null,
        'queue.default' => 'sync',
        'filesystems.default' => 'local',
        'media-library.disk_name' => 'public',
    ]);

    Storage::fake('local');
    Storage::fake('public');

    $this->get('/api/health')
        ->assertOk()
        ->assertJsonPath('status', 'ok')
        ->assertJsonPath('checks.database.ok', true)
        ->assertJsonPath('checks.cache_default.ok', true)
        ->assertJsonPath('checks.queue.ok', true)
        ->assertJsonPath('checks.storage_default.ok', true)
        ->assertJsonPath('checks.storage_media.ok', true);
});

test('health endpoint returns 503 when a dependency is degraded', function () {
    config([
        'app.debug' => false,
        'cache.default' => 'array',
        'cache.stores.redis' => null,
        'queue.default' => 'unsupported',
        'filesystems.default' => 'local',
        'media-library.disk_name' => 'public',
    ]);

    Storage::fake('local');
    Storage::fake('public');

    $this->get('/api/health')
        ->assertStatus(503)
        ->assertJsonPath('status', 'degraded')
        ->assertJsonPath('checks.queue.ok', false);
});
