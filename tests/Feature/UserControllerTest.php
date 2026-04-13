<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    // Seed roles and permissions
    $this->seed(RolePermissionSeeder::class);
});

test('guests cannot access users index', function () {
    $this->get('/users')->assertRedirect('/login');
});

test('users without permission cannot access users index', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($user)->get('/users')->assertForbidden();
});

test('admin can view users index', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    User::factory(3)->create();

    $this->actingAs($admin)
        ->get('/users')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('users/index')
            ->has('users.data')
            ->has('roles')
        );
});

test('super-admin can view users index', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    $this->actingAs($superAdmin)
        ->get('/users')
        ->assertOk();
});

test('admin can create a user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/users/create')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('users/create')
            ->has('roles')
        );
});

test('admin can store a user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->post('/users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'user',
        ])
        ->assertRedirect('/users');

    $this->assertDatabaseHas('users', [
        'name' => 'New User',
        'email' => 'newuser@example.com',
    ]);

    $newUser = User::where('email', 'newuser@example.com')->first();
    expect($newUser->hasRole('user'))->toBeTrue();
});

test('admin can update a user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($admin)
        ->put("/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => $user->email,
            'role' => 'admin',
        ])
        ->assertRedirect('/users');

    $user->refresh();
    expect($user->name)->toBe('Updated Name');
    expect($user->hasRole('admin'))->toBeTrue();
});

test('admin can soft delete a user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($admin)
        ->delete("/users/{$user->id}")
        ->assertRedirect('/users');

    $this->assertSoftDeleted('users', ['id' => $user->id]);
});

test('admin cannot delete themselves', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->delete("/users/{$admin->id}")
        ->assertForbidden();
});

test('admin can perform bulk activate', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $users = User::factory(3)->create(['is_active' => false]);
    $users->each(fn ($u) => $u->assignRole('user'));

    $this->actingAs($admin)
        ->post('/users/bulk-action', [
            'action' => 'activate',
            'user_ids' => $users->pluck('id')->toArray(),
        ])
        ->assertRedirect('/users');

    $users->each(fn ($u) => expect($u->fresh()->is_active)->toBeTrue());
});

test('admin can perform bulk deactivate', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $users = User::factory(3)->create(['is_active' => true]);
    $users->each(fn ($u) => $u->assignRole('user'));

    $this->actingAs($admin)
        ->post('/users/bulk-action', [
            'action' => 'deactivate',
            'user_ids' => $users->pluck('id')->toArray(),
        ])
        ->assertRedirect('/users');

    $users->each(fn ($u) => expect($u->fresh()->is_active)->toBeFalse());
});

test('search filters users by name', function () {
    $admin = User::factory()->create(['name' => 'Admin']);
    $admin->assignRole('admin');

    User::factory()->create(['name' => 'John Doe']);
    User::factory()->create(['name' => 'Jane Smith']);

    $this->actingAs($admin)
        ->get('/users?search=John')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 1)
        );
});

test('export users as csv', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    User::factory(3)->create();

    $this->actingAs($admin)
        ->get('/users-export?format=csv')
        ->assertOk()
        ->assertDownload('users.csv');
});
