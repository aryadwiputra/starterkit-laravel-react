<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ImpersonationController extends Controller
{
    /**
     * Start impersonating a user.
     */
    public function start(Request $request, User $user): RedirectResponse
    {
        // Cannot impersonate super-admin (explicit check since Gate::before bypasses policy for super-admins)
        abort_if($user->hasRole('super-admin'), 403, __('users.impersonation.super_admin'));
        abort_if($request->user()->id === $user->id, 403, __('users.impersonation.self'));

        $this->authorize('impersonate', $user);

        $originalUser = $request->user();

        // Store original user info in session
        $request->session()->put('impersonate.original_id', $originalUser->id);
        $request->session()->put('impersonate.original_name', $originalUser->name);

        // Log the impersonation start
        activity()
            ->performedOn($user)
            ->causedBy($originalUser)
            ->withProperties([
                'impersonator_id' => $originalUser->id,
                'impersonator_name' => $originalUser->name,
            ])
            ->log('Started impersonating user');

        Auth::login($user);

        Inertia::flash('toast', ['type' => 'info', 'message' => __('users.impersonation.started', ['name' => $user->name])]);

        return to_route('dashboard');
    }

    /**
     * Stop impersonating and return to original user.
     */
    public function stop(Request $request): RedirectResponse
    {
        $originalId = $request->session()->get('impersonate.original_id');

        if (! $originalId) {
            return to_route('dashboard');
        }

        $originalUser = User::findOrFail($originalId);
        $impersonatedUser = $request->user();

        // Log the impersonation end
        activity()
            ->performedOn($impersonatedUser)
            ->causedBy($originalUser)
            ->withProperties([
                'impersonator_id' => $originalUser->id,
                'impersonator_name' => $originalUser->name,
            ])
            ->log('Stopped impersonating user');

        // Clear impersonation session data
        $request->session()->forget('impersonate.original_id');
        $request->session()->forget('impersonate.original_name');

        Auth::login($originalUser);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('users.impersonation.stopped')]);

        return to_route('dashboard');
    }
}
