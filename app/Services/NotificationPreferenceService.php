<?php

namespace App\Services;

use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Support\Arr;

class NotificationPreferenceService
{
    /**
     * @param  array{database?: bool, mail?: bool, slack?: bool}  $defaults
     * @return array{database: bool, mail: bool, slack: bool}
     */
    public function channelsFor(User $user, string $typeKey, array $defaults): array
    {
        $preference = NotificationPreference::query()
            ->where('user_id', $user->id)
            ->where('type_key', $typeKey)
            ->first();

        $channels = array_merge(
            ['database' => true, 'mail' => false, 'slack' => false],
            $defaults,
            is_array($preference?->channels) ? $preference->channels : [],
        );

        return [
            'database' => (bool) Arr::get($channels, 'database', true),
            'mail' => (bool) Arr::get($channels, 'mail', false),
            'slack' => (bool) Arr::get($channels, 'slack', false),
        ];
    }

    /**
     * @param  array<int, array{type_key: string, channels: array{database?: bool, mail?: bool, slack?: bool}}>  $payload
     */
    public function save(User $user, array $payload): void
    {
        foreach ($payload as $item) {
            NotificationPreference::query()->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'type_key' => $item['type_key'],
                ],
                [
                    'channels' => [
                        'database' => (bool) ($item['channels']['database'] ?? true),
                        'mail' => (bool) ($item['channels']['mail'] ?? false),
                        'slack' => (bool) ($item['channels']['slack'] ?? false),
                    ],
                ],
            );
        }
    }

    public function typeKeyForNotification(object $notification): ?string
    {
        $notificationClass = $notification::class;
        $registry = config('notification_types', []);

        foreach ($registry as $entry) {
            if (! is_array($entry)) {
                continue;
            }

            if (($entry['class'] ?? null) === $notificationClass) {
                return $entry['key'] ?? null;
            }
        }

        return null;
    }
}
