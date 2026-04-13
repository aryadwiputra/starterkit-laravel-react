<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('guests cannot access roles index', function () {
    $this->get('/roles')->assertRedirect('/login');
});

test('users without permission cannot access roles', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($user)->get('/roles')->assertForbidden();
});

test('admin can view roles index', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/roles')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('roles/index')
            ->has('roles.data')
        );
});

test('admin can create a role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $permissions = Permission::query()->take(2)->pluck('name')->all();

    $this->actingAs($admin)
        ->get('/roles/create')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('roles/create')
            ->has('permission_groups')
        );

    $this->actingAs($admin)
        ->post('/roles', [
            'name' => 'manager',
            'permissions' => $permissions,
        ])
        ->assertRedirect('/roles');

    $role = Role::findByName('manager');
    expect($role->permissions->pluck('name')->all())->toMatchArray($permissions);
});

test('admin can update a role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $role = Role::create(['name' => 'staff']);
    $permission = Permission::query()->firstOrFail();

    $this->actingAs($admin)
        ->put("/roles/{$role->id}", [
            'name' => 'staff-updated',
            'permissions' => [$permission->name],
        ])
        ->assertRedirect('/roles');

    $role->refresh();
    expect($role->name)->toBe('staff-updated');
    expect($role->permissions->pluck('name')->all())->toMatchArray([$permission->name]);
});

test('admin can delete a role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $role = Role::create(['name' => 'temporary']);

    $this->actingAs($admin)
        ->delete("/roles/{$role->id}")
        ->assertRedirect('/roles');

    $this->assertDatabaseMissing('roles', ['id' => $role->id]);
});

test('non-admin cannot create or update roles', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $role = Role::create(['name' => 'contributor']);

    $this->actingAs($user)
        ->get('/roles/create')
        ->assertForbidden();

    $this->actingAs($user)
        ->post('/roles', [
            'name' => 'new-role',
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->get("/roles/{$role->id}/edit")
        ->assertForbidden();

    $this->actingAs($user)
        ->put("/roles/{$role->id}", [
            'name' => 'updated',
        ])
        ->assertForbidden();
});

test('super-admin role is read-only', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $superAdminRole = Role::findByName('super-admin');

    $this->actingAs($admin)
        ->get("/roles/{$superAdminRole->id}/edit")
        ->assertForbidden();

    $this->actingAs($admin)
        ->put("/roles/{$superAdminRole->id}", [
            'name' => 'super-admin',
        ])
        ->assertForbidden();

    $this->actingAs($admin)
        ->delete("/roles/{$superAdminRole->id}")
        ->assertForbidden();
});

test('role name must be unique and permissions valid', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    Role::create(['name' => 'unique-role']);

    $this->actingAs($admin)
        ->post('/roles', [
            'name' => 'unique-role',
            'permissions' => ['invalid.permission'],
        ])
        ->assertSessionHasErrors(['name', 'permissions.0']);
});
