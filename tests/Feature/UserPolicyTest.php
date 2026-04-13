<?php

use App\Models\User;
use App\Policies\UserPolicy;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
    $this->policy = new UserPolicy;
});

test('user with user.view permission can view any', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    expect($this->policy->viewAny($admin))->toBeTrue();
});

test('user without permission cannot view any', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    expect($this->policy->viewAny($user))->toBeFalse();
});

test('user with user.create permission can create', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    expect($this->policy->create($admin))->toBeTrue();
});

test('non-super-admin cannot update super-admin', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    expect($this->policy->update($admin, $superAdmin))->toBeFalse();
});

test('super-admin can update anyone', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    // Super admin gets bypass via Gate::before, but the policy itself should also return true
    expect($this->policy->update($superAdmin, $admin))->toBeTrue();
});

test('user cannot delete themselves', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    expect($this->policy->delete($admin, $admin))->toBeFalse();
});

test('non-super-admin cannot delete super-admin', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    expect($this->policy->delete($admin, $superAdmin))->toBeFalse();
});

test('cannot impersonate self', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    expect($this->policy->impersonate($superAdmin, $superAdmin))->toBeFalse();
});

test('cannot impersonate super-admin', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');

    $target = User::factory()->create();
    $target->assignRole('super-admin');

    expect($this->policy->impersonate($admin, $target))->toBeFalse();
});
