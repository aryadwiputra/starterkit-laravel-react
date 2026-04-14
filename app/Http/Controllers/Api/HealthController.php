<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class HealthController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $checks = [];
        $degraded = false;

        $checks['database'] = $this->checkDatabase();
        $degraded = $degraded || ! $checks['database']['ok'];

        $checks['cache_default'] = $this->checkCache(config('cache.default'));
        $degraded = $degraded || ! $checks['cache_default']['ok'];

        $checks['cache_redis'] = $this->checkRedisCache();
        if ($checks['cache_redis']['ok'] !== null) {
            $degraded = $degraded || ! $checks['cache_redis']['ok'];
        }

        $checks['queue'] = $this->checkQueue();
        $degraded = $degraded || ! $checks['queue']['ok'];

        $checks['storage_default'] = $this->checkStorage(config('filesystems.default'));
        $degraded = $degraded || ! $checks['storage_default']['ok'];

        $checks['storage_media'] = $this->checkStorage(config('media-library.disk_name', 'public'));
        $degraded = $degraded || ! $checks['storage_media']['ok'];

        $payload = [
            'status' => $degraded ? 'degraded' : 'ok',
            'checks' => $checks,
            'timestamp' => now()->toISOString(),
            'app_env' => app()->environment(),
        ];

        return response()->json($payload, $degraded ? 503 : 200);
    }

    /**
     * @return array{ok: bool, latency_ms: int, error?: string}
     */
    private function checkDatabase(): array
    {
        $start = hrtime(true);

        try {
            DB::select('select 1');

            return [
                'ok' => true,
                'latency_ms' => (int) ((hrtime(true) - $start) / 1_000_000),
            ];
        } catch (\Throwable $e) {
            return [
                'ok' => false,
                'latency_ms' => (int) ((hrtime(true) - $start) / 1_000_000),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * @return array{ok: bool, store: string, latency_ms: int, error?: string}
     */
    private function checkCache(string $store): array
    {
        $start = hrtime(true);
        $key = 'healthcheck:cache:'.Str::uuid();

        try {
            $cache = Cache::store($store);
            $cache->put($key, 'ok', 10);

            $value = $cache->get($key);
            $cache->forget($key);

            return [
                'ok' => $value === 'ok',
                'store' => $store,
                'latency_ms' => (int) ((hrtime(true) - $start) / 1_000_000),
            ];
        } catch (\Throwable $e) {
            return [
                'ok' => false,
                'store' => $store,
                'latency_ms' => (int) ((hrtime(true) - $start) / 1_000_000),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * @return array{ok: bool|null, store: string, latency_ms: int|null, error?: string}
     */
    private function checkRedisCache(): array
    {
        $store = 'redis';
        $start = hrtime(true);

        try {
            $cache = Cache::store($store);
        } catch (\Throwable $e) {
            return [
                'ok' => null,
                'store' => $store,
                'latency_ms' => null,
                'error' => $e->getMessage(),
            ];
        }

        $key = 'healthcheck:cache:redis:'.Str::uuid();

        try {
            $cache->put($key, 'ok', 10);

            $value = $cache->get($key);
            $cache->forget($key);

            return [
                'ok' => $value === 'ok',
                'store' => $store,
                'latency_ms' => (int) ((hrtime(true) - $start) / 1_000_000),
            ];
        } catch (\Throwable $e) {
            return [
                'ok' => false,
                'store' => $store,
                'latency_ms' => (int) ((hrtime(true) - $start) / 1_000_000),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * @return array{ok: bool, driver: string, details?: mixed, error?: string}
     */
    private function checkQueue(): array
    {
        $driver = (string) config('queue.default', 'sync');

        try {
            return match ($driver) {
                'sync' => ['ok' => true, 'driver' => $driver],
                'database' => $this->checkDatabaseQueue(),
                'redis' => $this->checkRedisQueue(),
                default => ['ok' => false, 'driver' => $driver, 'error' => "Unsupported queue driver [{$driver}]."],
            };
        } catch (\Throwable $e) {
            return [
                'ok' => false,
                'driver' => $driver,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * @return array{ok: bool, driver: string, details?: mixed, error?: string}
     */
    private function checkDatabaseQueue(): array
    {
        $driver = 'database';
        $connection = config('queue.connections.database.connection') ?: config('database.default');
        $table = (string) config('queue.connections.database.table', 'jobs');

        try {
            $hasTable = Schema::connection($connection)->hasTable($table);
            if (! $hasTable) {
                return [
                    'ok' => false,
                    'driver' => $driver,
                    'details' => ['connection' => $connection, 'table' => $table],
                    'error' => "Missing queue table [{$table}].",
                ];
            }

            DB::connection($connection)->table($table)->limit(1)->get();

            return [
                'ok' => true,
                'driver' => $driver,
                'details' => ['connection' => $connection, 'table' => $table],
            ];
        } catch (\Throwable $e) {
            return [
                'ok' => false,
                'driver' => $driver,
                'details' => ['connection' => $connection, 'table' => $table],
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * @return array{ok: bool, driver: string, details?: mixed, error?: string}
     */
    private function checkRedisQueue(): array
    {
        $driver = 'redis';
        $connection = (string) config('queue.connections.redis.connection', 'default');

        try {
            $result = Redis::connection($connection)->ping();

            return [
                'ok' => is_string($result) ? str_contains(strtolower($result), 'pong') : true,
                'driver' => $driver,
                'details' => ['connection' => $connection],
            ];
        } catch (\Throwable $e) {
            return [
                'ok' => false,
                'driver' => $driver,
                'details' => ['connection' => $connection],
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * @return array{ok: bool, disk: string, error?: string}
     */
    private function checkStorage(string $disk): array
    {
        $path = 'healthchecks/'.Str::uuid().'.txt';
        $content = 'ok';

        try {
            $storage = Storage::disk($disk);

            $storage->put($path, $content);
            $read = $storage->get($path);
            $storage->delete($path);

            return [
                'ok' => $read === $content,
                'disk' => $disk,
            ];
        } catch (\Throwable $e) {
            return [
                'ok' => false,
                'disk' => $disk,
                'error' => $e->getMessage(),
            ];
        }
    }
}

