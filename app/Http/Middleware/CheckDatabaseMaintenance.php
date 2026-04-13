<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckDatabaseMaintenance
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, \Closure $next): Response
    {
        if (! settings('app.maintenance.enabled', false)) {
            return $next($request);
        }

        if ($this->shouldBypass($request)) {
            return $next($request);
        }

        $message = settings('app.maintenance.message') ?: 'We are performing maintenance. Please try again soon.';

        return Inertia::render('maintenance', [
            'message' => $message,
        ])->toResponse($request)->setStatusCode(503);
    }

    private function shouldBypass(Request $request): bool
    {
        if ($request->is('build/*', 'storage/*', 'favicon*', 'up')) {
            return true;
        }

        if ($request->routeIs('login', 'logout', 'register', 'password.*', 'verification.*')) {
            return true;
        }

        $user = $request->user();
        if (! $user) {
            return false;
        }

        return $user->can('settings.app.manage');
    }
}
