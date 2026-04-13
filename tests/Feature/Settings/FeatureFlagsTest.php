<?php

use App\Models\FeatureFlag;
use App\Models\User;
use App\Services\FeatureFlagService;
use Database\Seeders\RolePermissionSeeder;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    config(['cache.stores.redis.driver' => 'array']);
    $this->seed(RolePermissionSeeder::class);
});

test('feature flag evaluation uses environment and targeting allowlists', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();
    $user->assignRole('user');

    $roleAdmin = Role::findByName('admin');

    $flag = FeatureFlag::query()->create([
        'key' => 'new_ui',
        'enabled' => true,
        'environments' => ['testing'],
    ]);

    $flag->roles()->sync([$roleAdmin->id]);

    /** @var FeatureFlagService $service */
    $service = app(FeatureFlagService::class);

    expect($service->enabled('new_ui', $admin))->toBeTrue();
    expect($service->enabled('new_ui', $user))->toBeFalse();
    expect($service->enabled('new_ui', null))->toBeFalse();
});

test('non-admin cannot access feature flags settings page', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($user)
        ->get(route('feature-flags.index'))
        ->assertForbidden();
});

test('enabled features are shared to inertia props for authenticated users', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    FeatureFlag::query()->create([
        'key' => 'beta_reports',
        'enabled' => true,
        'environments' => ['testing'],
    ]);

    $this->actingAs($admin)
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('features')
            ->where('features', fn ($features) => in_array('beta_reports', collect($features)->all(), true))
        );
});
