<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

beforeEach(function () {
    try {
        Cache::store('redis')->forget('settings:all');
    } catch (Throwable) {
        // Ignore cache failures during tests.
    }
});

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * Seed roles/permissions once and act as the given role.
 */
function asRole(string $role, array $attributes = []): User
{
    Artisan::call('db:seed', ['--class' => RolePermissionSeeder::class]);

    $user = User::factory()->create($attributes);
    $user->assignRole($role);

    test()->actingAs($user);

    return $user;
}

function asAdmin(array $attributes = []): User
{
    return asRole('admin', $attributes);
}

function asSuperAdmin(array $attributes = []): User
{
    return asRole('super-admin', $attributes);
}

function asUser(array $attributes = []): User
{
    return asRole('user', $attributes);
}
