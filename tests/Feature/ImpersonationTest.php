<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Spatie\Activitylog\Models\Activity;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('super-admin can impersonate a regular user', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($superAdmin)
        ->post("/impersonate/{$user->id}")
        ->assertRedirect('/dashboard');

    // Check session has impersonation data
    $this->assertAuthenticated();
});

test('impersonation logs activity', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($superAdmin)
        ->post("/impersonate/{$user->id}");

    $activity = Activity::where('description', 'Started impersonating user')->first();
    expect($activity)->not->toBeNull();
    expect($activity->causer_id)->toBe($superAdmin->id);
    expect($activity->subject_id)->toBe($user->id);
});

test('cannot impersonate super-admin', function () {
    $superAdmin1 = User::factory()->create();
    $superAdmin1->assignRole('super-admin');

    $superAdmin2 = User::factory()->create();
    $superAdmin2->assignRole('super-admin');

    $this->actingAs($superAdmin1)
        ->post("/impersonate/{$superAdmin2->id}")
        ->assertForbidden();
});

test('regular user cannot impersonate', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $target = User::factory()->create();
    $target->assignRole('user');

    $this->actingAs($user)
        ->post("/impersonate/{$target->id}")
        ->assertForbidden();
});

test('stop impersonation returns to original user', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    $user = User::factory()->create();
    $user->assignRole('user');

    // Start impersonation
    $this->actingAs($superAdmin)
        ->post("/impersonate/{$user->id}");

    // Stop impersonation
    $this->post('/impersonate-stop')
        ->assertRedirect('/dashboard');

    // Should be logged back in as super-admin
    $this->assertAuthenticatedAs($superAdmin);
});

test('stop impersonation logs activity', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($superAdmin)
        ->post("/impersonate/{$user->id}");

    $this->post('/impersonate-stop');

    $activity = Activity::where('description', 'Stopped impersonating user')->first();
    expect($activity)->not->toBeNull();
});
