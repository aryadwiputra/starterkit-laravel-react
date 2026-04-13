<?php

use App\Models\Setting;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    config(['cache.stores.redis.driver' => 'array']);
    $this->seed(RolePermissionSeeder::class);
});

test('non-admin cannot access app settings', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($user)
        ->get(route('app-settings.edit'))
        ->assertForbidden();
});

test('admin can update app settings', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->patch(route('app-settings.update'), [
            'name' => 'My App',
            'timezone' => 'UTC',
            'locale' => 'en',
            'maintenance_enabled' => false,
            'maintenance_message' => null,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('settings', [
        'key' => 'app.name',
    ]);

    $this->assertDatabaseHas('settings', [
        'key' => 'app.timezone',
    ]);

    config(['app.timezone' => 'Asia/Bangkok']);

    $this->actingAs($admin)->get(route('profile.edit'))->assertOk();
    expect(config('app.timezone'))->toBe('UTC');
});

test('app name is exposed via app-name meta tag', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    Setting::query()->updateOrCreate(
        ['key' => 'app.name'],
        ['value' => 'Meta App', 'type' => 'string', 'is_encrypted' => false],
    );

    $this->actingAs($admin)
        ->get('/dashboard')
        ->assertOk()
        ->assertSee('meta name="app-name"', false)
        ->assertSee('content="Meta App"', false);
});
