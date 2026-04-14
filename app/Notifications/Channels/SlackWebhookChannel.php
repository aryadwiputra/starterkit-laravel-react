<?php

namespace App\Notifications\Channels;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;

class SlackWebhookChannel
{
    public function send(Authenticatable $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toSlackWebhook')) {
            return;
        }

        $url = settings('notifications.slack.webhook_url')
            ?? config('services.slack.notifications.webhook_url')
            ?? env('SLACK_WEBHOOK_URL');

        if (! is_string($url) || $url === '') {
            return;
        }

        $payload = $notification->toSlackWebhook($notifiable);

        if (! is_array($payload)) {
            return;
        }

        Http::retry(1, 250)->post($url, $payload);
    }
}
