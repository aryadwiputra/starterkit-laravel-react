<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\Request;

beforeEach(function () {
    config(['app.debug' => false]);
});

test('non-inertia 404 renders branded blade page', function () {
    $this->get('/__missing__')
        ->assertStatus(404)
        ->assertSeeText(__('errors.404.title'));
});

test('inertia 404 renders branded inertia page', function () {
    $version = app(HandleInertiaRequests::class)->version(Request::create('/'));

    $this->get('/__missing__', [
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $version,
    ])
        ->assertStatus(404)
        ->assertJsonPath('component', 'errors/404')
        ->assertJsonPath('props.status', 404);
});

test('inertia 403 renders branded inertia page', function () {
    $version = app(HandleInertiaRequests::class)->version(Request::create('/'));

    $this->seed(RolePermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($user)
        ->get('/settings/app', [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $version,
        ])
        ->assertStatus(403)
        ->assertJsonPath('component', 'errors/403')
        ->assertJsonPath('props.status', 403);
});
