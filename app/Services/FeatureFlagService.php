<?php

namespace App\Services;

use App\Models\FeatureFlag;
use App\Models\User;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Support\Facades\Cache;
use Throwable;

class FeatureFlagService
{
    private const CACHE_KEY = 'feature-flags:all';

    private const CACHE_TTL_SECONDS = 3600;

    public function enabled(string $key, ?User $user = null): bool
    {
        $flags = $this->allFlags();

        if (! array_key_exists($key, $flags)) {
            return false;
        }

        $flag = $flags[$key];

        if (! $flag['enabled']) {
            return false;
        }

        $environments = $flag['environments'];
        if (is_array($environments) && ! empty($environments) && ! in_array(app()->environment(), $environments, true)) {
            return false;
        }

        $allowedRoleNames = $flag['roles'];
        $allowedUserIds = $flag['users'];

        $hasTargeting = ! empty($allowedRoleNames) || ! empty($allowedUserIds);

        if (! $hasTargeting) {
            return true;
        }

        if (! $user) {
            return false;
        }

        if (! empty($allowedUserIds) && in_array($user->id, $allowedUserIds, true)) {
            return true;
        }

        if (! empty($allowedRoleNames) && $user->roles()->whereIn('name', $allowedRoleNames)->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Get enabled feature keys for the given user.
     *
     * @return list<string>
     */
    public function enabledKeysForUser(?User $user): array
    {
        $flags = $this->allFlags();

        $enabled = [];

        foreach (array_keys($flags) as $key) {
            if ($this->enabled($key, $user)) {
                $enabled[] = $key;
            }
        }

        return $enabled;
    }

    public function forgetCache(): void
    {
        try {
            $this->cache()->forget(self::CACHE_KEY);
        } catch (Throwable) {
            //
        }
    }

    /**
     * @return array<string, array{enabled: bool, environments: list<string>|null, roles: list<string>, users: list<int>}>
     */
    private function allFlags(): array
    {
        try {
            return $this->cache()->remember(self::CACHE_KEY, self::CACHE_TTL_SECONDS, function (): array {
                return $this->loadFromDatabase();
            });
        } catch (Throwable) {
            return $this->loadFromDatabase();
        }
    }

    /**
     * @return array<string, array{enabled: bool, environments: list<string>|null, roles: list<string>, users: list<int>}>
     */
    private function loadFromDatabase(): array
    {
        return FeatureFlag::query()
            ->with([
                'roles:id,name',
                'users:id',
            ])
            ->get(['id', 'key', 'enabled', 'environments'])
            ->mapWithKeys(function (FeatureFlag $flag): array {
                /** @var list<string>|null $environments */
                $environments = $flag->environments;

                return [
                    $flag->key => [
                        'enabled' => (bool) $flag->enabled,
                        'environments' => $environments,
                        'roles' => $flag->roles->pluck('name')->values()->all(),
                        'users' => $flag->users->pluck('id')->values()->all(),
                    ],
                ];
            })
            ->all();
    }

    private function cache(): CacheRepository
    {
        return Cache::store('redis');
    }
}
