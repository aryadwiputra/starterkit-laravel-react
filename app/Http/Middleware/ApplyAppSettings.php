<?php

namespace App\Http\Middleware;

use App\Services\MailSettingsApplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class ApplyAppSettings
{
    public function __construct(
        private readonly MailSettingsApplier $mailSettingsApplier,
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, \Closure $next): Response
    {
        $name = settings('app.name');
        if (is_string($name) && $name !== '') {
            config(['app.name' => $name]);
        }

        $timezone = settings('app.timezone');
        if (is_string($timezone) && $timezone !== '') {
            config(['app.timezone' => $timezone]);
            date_default_timezone_set($timezone);
        }

        $locale = settings('app.locale');
        if (is_string($locale) && $locale !== '') {
            config(['app.locale' => $locale]);
            App::setLocale($locale);
        }

        $fallbackLocale = settings('app.fallback_locale');
        if (is_string($fallbackLocale) && $fallbackLocale !== '') {
            config(['app.fallback_locale' => $fallbackLocale]);
        }

        $this->mailSettingsApplier->apply();

        return $next($request);
    }
}
