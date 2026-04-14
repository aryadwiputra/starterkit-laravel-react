<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateAppSettingsRequest;
use App\Services\SettingsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AppSettingsController extends Controller
{
    /**
     * Show the app settings page.
     */
    public function edit(Request $request): Response
    {
        abort_unless($request->user()?->can('settings.app.manage'), 403);

        $logoPath = settings('app.logo_path');
        $logoUrl = is_string($logoPath) && $logoPath !== '' ? Storage::disk('public')->url($logoPath) : null;

        return Inertia::render('settings/app', [
            'settings' => [
                'name' => settings('app.name', config('app.name')),
                'logo_url' => $logoUrl,
                'timezone' => settings('app.timezone', config('app.timezone')),
                'locale' => settings('app.locale', config('app.locale')),
                'fallback_locale' => settings('app.fallback_locale', config('app.fallback_locale')),
                'maintenance_enabled' => (bool) settings('app.maintenance.enabled', false),
                'maintenance_message' => settings('app.maintenance.message'),
            ],
        ]);
    }

    /**
     * Update the app settings.
     */
    public function update(UpdateAppSettingsRequest $request, SettingsService $settings): RedirectResponse
    {
        $settings->set('app.name', $request->validated('name'), 'string');
        $settings->set('app.timezone', $request->validated('timezone'), 'string');
        $settings->set('app.locale', $request->validated('locale'), 'string');
        $settings->set('app.fallback_locale', $request->validated('fallback_locale'), 'string');
        $settings->set('app.maintenance.enabled', (bool) $request->validated('maintenance_enabled', false), 'bool');
        $settings->set('app.maintenance.message', $request->validated('maintenance_message'), 'string');

        if ($request->hasFile('logo')) {
            $previous = settings('app.logo_path');
            if (is_string($previous) && $previous !== '') {
                Storage::disk('public')->delete($previous);
            }

            $path = $request->file('logo')->store('logos', 'public');
            $settings->set('app.logo_path', $path, 'string');
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('settings.toast.app_updated')]);

        return back();
    }
}
