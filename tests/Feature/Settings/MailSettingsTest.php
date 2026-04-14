<?php

use App\Mail\SettingsTestMail;
use App\Models\User;
use App\Services\MailSettingsApplier;
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

test('mail settings update does not require secrets when present in env config', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    config([
        'services.mailgun.domain' => 'mg.example.com',
        'services.mailgun.secret' => 'env-secret',
    ]);

    $this->actingAs($admin)
        ->patch(route('mail-settings.update'), [
            'default' => 'mailgun',
            'from_address' => 'noreply@example.com',
            'from_name' => 'My App',
            // Intentionally omit mailgun_secret/domain to ensure env fallback works.
        ])
        ->assertRedirect();
});

test('mail settings applier allows mixed db and env credentials', function () {
    config([
        'services.mailgun.domain' => 'env-domain',
        'services.mailgun.secret' => 'env-secret',
    ]);

    settings()->set('mail.mailgun.domain', 'db-domain', 'string');

    app(MailSettingsApplier::class)->apply();

    expect(config('mail.mailers.mailgun.transport'))->toBe('mailgun');
    expect(config('services.mailgun.domain'))->toBe('db-domain');
    expect(config('services.mailgun.secret'))->toBe('env-secret');
});
