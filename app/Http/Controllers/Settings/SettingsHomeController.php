<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsHomeController extends Controller
{
    /**
     * Show the admin settings landing page.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user || ! $user->canAny([
            'settings.app.manage',
            'settings.mail.manage',
            'settings.flags.manage',
        ])) {
            return redirect()->route('profile.edit');
        }

        return Inertia::render('settings/index');
    }
}
