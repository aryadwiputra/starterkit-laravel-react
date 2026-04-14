<?php

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

test('api v1 can issue and revoke a personal access token', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
    ]);

    $response = $this->postJson('/api/v1/auth/tokens', [
        'email' => 'john@example.com',
        'password' => 'password',
        'device_name' => 'tests',
    ]);

    $response
        ->assertStatus(201)
        ->assertJsonPath('data.token_type', 'Bearer')
        ->assertJsonStructure(['data' => ['token']]);

    $token = $response->json('data.token');
    $tokenId = (int) explode('|', $token, 2)[0];

    expect(PersonalAccessToken::find($tokenId))->not->toBeNull();

    $this->getJson('/api/v1/me')->assertUnauthorized();

    $this->withToken($token)
        ->getJson('/api/v1/me')
        ->assertOk()
        ->assertJsonPath('data.id', $user->id)
        ->assertJsonPath('data.email', 'john@example.com');

    $this->withToken($token)
        ->deleteJson('/api/v1/auth/tokens/current')
        ->assertNoContent();

    expect(PersonalAccessToken::find($tokenId))->toBeNull();

    app('auth')->forgetGuards();

    $this->withToken($token)->getJson('/api/v1/me')->assertUnauthorized();
});

test('api v1 token creation fails with invalid credentials', function () {
    User::factory()->create([
        'email' => 'john@example.com',
    ]);

    $this->postJson('/api/v1/auth/tokens', [
        'email' => 'john@example.com',
        'password' => 'wrong-password',
        'device_name' => 'tests',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});
