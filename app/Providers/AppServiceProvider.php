<?php

namespace App\Providers;

use App\Listeners\ApplyNotificationPreferences;
use App\Models\MediaAsset;
use App\Policies\MediaAssetPolicy;
use App\Policies\RolePolicy;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Notifications\Events\NotificationSending;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureAuthorization();
        $this->configureNotifications();
        $this->configureRateLimiting();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Model::preventLazyLoading(! app()->isProduction());

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Configure authorization gates.
     */
    protected function configureAuthorization(): void
    {
        Gate::policy(MediaAsset::class, MediaAssetPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);

        Gate::define('viewApiDocs', function ($user): bool {
            return $user->hasRole('admin');
        });

        Gate::before(function ($user, $ability) {
            return $user->hasRole('super-admin') ? true : null;
        });
    }

    protected function configureNotifications(): void
    {
        Event::listen(NotificationSending::class, ApplyNotificationPreferences::class);
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            $isAuthenticated = $request->user() !== null;

            $maxAttempts = $isAuthenticated
                ? (int) config('api.rate_limits.api.user_per_minute', 120)
                : (int) config('api.rate_limits.api.guest_per_minute', 60);

            $key = $request->user()?->getAuthIdentifier() ?? $request->ip();

            return Limit::perMinute($maxAttempts)->by($key);
        });

        RateLimiter::for('api-auth', function (Request $request) {
            $isAuthenticated = $request->user() !== null;

            $maxAttempts = $isAuthenticated
                ? (int) config('api.rate_limits.auth.user_per_minute', 20)
                : (int) config('api.rate_limits.auth.guest_per_minute', 10);

            $key = $request->user()?->getAuthIdentifier() ?? $request->ip();

            return Limit::perMinute($maxAttempts)->by($key);
        });
    }
}
