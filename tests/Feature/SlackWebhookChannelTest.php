<?php

use App\Models\NotificationPreference;
use App\Models\User;
use App\Notifications\ImportantSecurityNotification;
use Illuminate\Support\Facades\Http;

test('slack webhook channel posts when enabled', function () {
    Http::fake();

    config(['services.slack.notifications.webhook_url' => 'https://hooks.slack.com/services/test']);

    $user = User::factory()->create();

    NotificationPreference::query()->create([
        'user_id' => $user->id,
        'type_key' => 'security.important',
        'channels' => [
            'database' => false,
            'mail' => false,
            'slack' => true,
        ],
    ]);

    $user->notify(new ImportantSecurityNotification(
        title: 'Security alert',
        body: 'New login detected.',
        url: null,
    ));

    Http::assertSentCount(1);
});
