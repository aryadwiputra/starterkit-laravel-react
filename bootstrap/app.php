<?php

use App\Http\Middleware\ApplyAppSettings;
use App\Http\Middleware\ApplyLocale;
use App\Http\Middleware\CheckDatabaseMaintenance;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            ApplyAppSettings::class,
            ApplyLocale::class,
            CheckDatabaseMaintenance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            if (config('app.debug')) {
                return $response;
            }

            $status = $response->getStatusCode();

            if (! in_array($status, [403, 404, 500, 503], true)) {
                return $response;
            }

            if ($request->expectsJson()) {
                $message = match ($status) {
                    403 => 'Forbidden',
                    404 => 'Not Found',
                    503 => 'Service Unavailable',
                    default => 'Server Error',
                };

                return response()->json([
                    'message' => $message,
                    'status' => $status,
                ], $status);
            }

            $isAuthenticated = $request->user() !== null;
            $secondaryHref = $isAuthenticated ? route('dashboard') : url('/');
            $secondaryLabel = $isAuthenticated ? __('errors.actions.dashboard') : __('errors.actions.home');

            $props = [
                'status' => $status,
                'title' => __("errors.{$status}.title"),
                'description' => __("errors.{$status}.description"),
                'primary_action' => in_array($status, [500, 503], true) ? 'reload' : 'back',
                'primary_label' => match ($status) {
                    500 => __('errors.actions.reload'),
                    503 => __('errors.actions.try_again'),
                    default => __('errors.actions.back'),
                },
                'secondary_href' => $secondaryHref,
                'secondary_label' => $secondaryLabel,
            ];

            if ($request->header('X-Inertia')) {
                return Inertia::render("errors/{$status}", $props)
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            return response()->view("errors.{$status}", $props, $status);
        });
    })->create();
