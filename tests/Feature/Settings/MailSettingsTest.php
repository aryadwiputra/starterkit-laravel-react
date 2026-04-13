<?php

use App\Mail\SettingsTestMail;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    config(['cache.stores.redis.driver' => 'array']);
    $this->seed(RolePermissionSeeder::class);
});

test('admin can update mail settings and send test email', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->patch(route('mail-settings.update'), [
            'default' => 'log',
            'from_address' => 'noreply@example.com',
            'from_name' => 'My App',
        ])
        ->assertRedirect();

    Mail::fake();

    $this->actingAs($admin)
        ->post(route('mail-settings.test'), [
            'to' => 'test@example.com',
        ])
        ->assertRedirect();

    Mail::assertSent(SettingsTestMail::class, function (SettingsTestMail $mail) {
        return $mail->hasTo('test@example.com');
    });
});

test('mail settings page does not expose secret values', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    settings()->set('mail.postmark.key', 'super-secret', 'string', encrypted: true);

    $this->actingAs($admin)
        ->get(route('mail-settings.edit'))
        ->assertOk()
        ->assertDontSee('super-secret');
});
