<?php

namespace App\Listeners;

use App\Models\User;
use App\Notifications\Channels\SlackWebhookChannel;
use App\Services\NotificationPreferenceService;
use Illuminate\Notifications\Events\NotificationSending;

class ApplyNotificationPreferences
{
    public function __construct(
        private readonly NotificationPreferenceService $preferences,
    ) {}

    public function handle(NotificationSending $event): bool
    {
        if (! $event->notifiable instanceof User) {
            return true;
        }

        $typeKey = $this->preferences->typeKeyForNotification($event->notification);

        if (! is_string($typeKey) || $typeKey === '') {
            return true;
        }

        $defaults = $this->defaultsForType($typeKey);
        $channels = $this->preferences->channelsFor($event->notifiable, $typeKey, $defaults);

        $channelKey = $this->channelKey($event->channel);

        if ($channelKey === null) {
            return true;
        }

        return (bool) ($channels[$channelKey] ?? true);
    }

    /**
     * @return array{database?: bool, mail?: bool, slack?: bool}
     */
    private function defaultsForType(string $typeKey): array
    {
        $registry = config('notification_types', []);

        foreach ($registry as $entry) {
            if (! is_array($entry)) {
                continue;
            }

            if (($entry['key'] ?? null) !== $typeKey) {
                continue;
            }

            $defaults = $entry['default_channels'] ?? [];

            return is_array($defaults) ? $defaults : [];
        }

        return [];
    }

    private function channelKey(string $channel): ?string
    {
        return match ($channel) {
            'database' => 'database',
            'mail' => 'mail',
            SlackWebhookChannel::class => 'slack',
            default => null,
        };
    }
}
