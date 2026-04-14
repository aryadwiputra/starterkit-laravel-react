<?php

use App\Models\NotificationPreference;
use App\Models\User;
use App\Notifications\ImportantSecurityNotification;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

test('notification preferences can disable mail and slack channels', function () {
    Mail::fake();
    Http::fake();

    config(['services.slack.notifications.webhook_url' => 'https://hooks.slack.com/services/test']);

    $user = User::factory()->create();

    NotificationPreference::query()->create([
        'user_id' => $user->id,
        'type_key' => 'security.important',
        'channels' => [
            'database' => true,
            'mail' => false,
            'slack' => false,
        ],
    ]);

    $user->notify(new ImportantSecurityNotification(
        title: 'Security alert',
        body: 'Your password was updated.',
        url: '/profile#security',
    ));

    expect($user->notifications()->count())->toBe(1);

    Mail::assertNothingSent();
    Http::assertNothingSent();
});
