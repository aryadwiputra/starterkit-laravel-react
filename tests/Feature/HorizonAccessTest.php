<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Schema;

test('admin can access horizon', function () {
    $this->seed(RolePermissionSeeder::class);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/horizon')
        ->assertOk();
});

test('non-admin cannot access horizon', function () {
    $this->seed(RolePermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($user)
        ->get('/horizon')
        ->assertForbidden();
});

test('job batching tables exist', function () {
    expect(Schema::hasTable('job_batches'))->toBeTrue();
    expect(Schema::hasTable('failed_jobs'))->toBeTrue();
    expect(Schema::hasTable('jobs'))->toBeTrue();
});
