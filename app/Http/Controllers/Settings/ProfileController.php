<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use App\Http\Requests\UpdateNotificationPreferencesRequest;
use App\Models\NotificationPreference;
use App\Services\NotificationPreferenceService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(TwoFactorAuthenticationRequest $request): Response
    {
        $user = $request->user();

        $notificationTypes = collect(config('notification_types', []))
            ->filter(fn ($entry) => is_array($entry) && isset($entry['key']))
            ->values()
            ->all();

        $notificationPreferences = NotificationPreference::query()
            ->where('user_id', $user->id)
            ->get(['type_key', 'channels'])
            ->map(fn (NotificationPreference $preference) => [
                'type_key' => $preference->type_key,
                'channels' => $preference->channels,
            ])
            ->values()
            ->all();

        $props = [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'canManageTwoFactor' => Features::canManageTwoFactorAuthentication(),
            'notificationTypes' => $notificationTypes,
            'notificationPreferences' => $notificationPreferences,
        ];

        if (Features::canManageTwoFactorAuthentication()) {
            $request->ensureStateIsValid();

            $props['twoFactorEnabled'] = $request->user()->hasEnabledTwoFactorAuthentication();
            $props['requiresConfirmation'] = Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm');
        }

        return Inertia::render('profile', $props);
    }

    public function updateNotificationPreferences(
        UpdateNotificationPreferencesRequest $request,
        NotificationPreferenceService $preferences,
    ): RedirectResponse {
        $preferences->save(
            $request->user(),
            $request->validated('preferences'),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('notifications.toast.preferences_saved')]);

        return to_route('profile.edit');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->safe()->only(['name', 'email']));

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            $user->avatar_path = $request->file('avatar')->store('avatars', 'public');
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        activity()
            ->performedOn($user)
            ->causedBy($user)
            ->log('Updated own profile');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('profile.toast.updated')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        // Delete avatar file
        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
