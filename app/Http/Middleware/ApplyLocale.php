<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class ApplyLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $availableLocales = config('app.available_locales', []);
        $locale = null;

        if ($request->user() && is_string($request->user()->locale) && $request->user()->locale !== '') {
            $locale = $request->user()->locale;
        } elseif ($request->session()->has('locale')) {
            $locale = $request->session()->get('locale');
        } else {
            $locale = settings('app.locale', config('app.locale'));
        }

        if (! is_string($locale) || $locale === '') {
            $locale = config('app.locale');
        }

        if (is_array($availableLocales) && $availableLocales !== [] && ! in_array($locale, $availableLocales, true)) {
            $locale = config('app.locale');
        }

        if (is_string($locale) && $locale !== '') {
            config(['app.locale' => $locale]);
            App::setLocale($locale);
        }

        return $next($request);
    }
}
