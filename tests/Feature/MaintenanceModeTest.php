<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    config(['cache.stores.redis.driver' => 'array']);
    $this->seed(RolePermissionSeeder::class);

    settings()->set('app.maintenance.enabled', true, 'bool');
    settings()->set('app.maintenance.message', 'Maintenance now', 'string');
});

test('guests see maintenance page when maintenance is enabled', function () {
    $this->get('/')
        ->assertStatus(503)
        ->assertInertia(fn ($page) => $page
            ->component('maintenance')
            ->where('message', 'Maintenance now')
        );
});

test('admin bypasses maintenance mode', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/dashboard')
        ->assertOk();
});
