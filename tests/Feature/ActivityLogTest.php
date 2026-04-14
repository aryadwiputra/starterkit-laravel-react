<?php

use App\Models\FeatureFlag;
use App\Models\Setting;
use App\Models\User;
use App\Services\SettingsService;
use Database\Seeders\RolePermissionSeeder;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('admin can access global audit log page', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/settings/activity')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('activity/index')
            ->has('activities.data')
        );
});

test('non-admin cannot access global audit log page', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($user)
        ->get('/settings/activity')
        ->assertForbidden();
});

test('settings changes are logged and encrypted values are masked', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin);

    $settings = app(SettingsService::class);

    $settings->set('mail.smtp.password', 'secret-1', 'string', encrypted: true);
    $settings->set('mail.smtp.password', 'secret-2', 'string', encrypted: true);

    $activity = Activity::query()
        ->where('subject_type', Setting::class)
        ->where('event', 'updated')
        ->latest()
        ->firstOrFail();

    $properties = $activity->properties->toArray();

    expect(data_get($properties, 'old.value'))->toBe('[encrypted]');
    expect(data_get($properties, 'attributes.value'))->toBe('[encrypted]');
});

test('feature flag targeting changes are logged', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $targetRole = Role::create(['name' => 'qa']);
    $targetUser = User::factory()->create();

    $this->actingAs($admin)
        ->post('/settings/features', [
            'key' => 'test.flag',
            'description' => 'Test',
            'enabled' => true,
            'environments' => ['local'],
            'roles' => [],
            'users' => [],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $flag = FeatureFlag::where('key', 'test.flag')->firstOrFail();

    $this->actingAs($admin)
        ->put("/settings/features/{$flag->id}", [
            'key' => 'test.flag',
            'description' => 'Test updated',
            'enabled' => true,
            'environments' => ['local'],
            'roles' => [$targetRole->name],
            'users' => [$targetUser->id],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $flag->refresh();
    expect($flag->roles->pluck('name')->all())->toContain($targetRole->name);

    $activity = Activity::query()
        ->where('log_name', 'feature-flags')
        ->where('description', 'Updated feature flag targeting')
        ->orderByDesc('id')
        ->firstOrFail();

    $properties = $activity->properties->toArray();

    expect(data_get($properties, 'roles_old'))->toBeArray();
    expect(array_values(data_get($properties, 'roles_new', [])))->toContain($targetRole->name);
    expect(data_get($properties, 'users_old'))->toBeArray();
    expect(array_values(data_get($properties, 'users_new', [])))->toContain($targetUser->id);
});
