<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreFeatureFlagRequest;
use App\Http\Requests\Settings\UpdateFeatureFlagRequest;
use App\Models\FeatureFlag;
use App\Models\User;
use App\Services\FeatureFlagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class FeatureFlagsController extends Controller
{
    /**
     * Show the feature flags settings page.
     */
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('settings.flags.manage'), 403);

        $flags = FeatureFlag::query()
            ->with([
                'roles:id,name',
                'users:id,name,email',
            ])
            ->orderBy('key')
            ->get()
            ->map(function (FeatureFlag $flag): array {
                return [
                    'id' => $flag->id,
                    'key' => $flag->key,
                    'description' => $flag->description,
                    'enabled' => (bool) $flag->enabled,
                    'environments' => $flag->environments,
                    'roles' => $flag->roles->pluck('name')->values()->all(),
                    'users' => $flag->users->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email])->values()->all(),
                ];
            });

        return Inertia::render('settings/features', [
            'flags' => $flags,
            'roles' => Role::query()->orderBy('name')->pluck('name'),
        ]);
    }

    /**
     * Store a new feature flag.
     */
    public function store(StoreFeatureFlagRequest $request, FeatureFlagService $featureFlags): RedirectResponse
    {
        $flag = FeatureFlag::query()->create([
            'key' => $request->validated('key'),
            'description' => $request->validated('description'),
            'enabled' => (bool) $request->validated('enabled', false),
            'environments' => $request->validated('environments'),
        ]);

        $flag->roles()->sync(Role::query()->whereIn('name', $request->validated('roles', []))->pluck('id'));
        $flag->users()->sync($request->validated('users', []));

        $featureFlags->forgetCache();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('settings.toast.feature_created')]);

        return back();
    }

    /**
     * Update a feature flag.
     */
    public function update(UpdateFeatureFlagRequest $request, FeatureFlag $featureFlag, FeatureFlagService $featureFlags): RedirectResponse
    {
        $featureFlag->update([
            'key' => $request->validated('key'),
            'description' => $request->validated('description'),
            'enabled' => (bool) $request->validated('enabled', false),
            'environments' => $request->validated('environments'),
        ]);

        $featureFlag->roles()->sync(Role::query()->whereIn('name', $request->validated('roles', []))->pluck('id'));
        $featureFlag->users()->sync($request->validated('users', []));

        $featureFlags->forgetCache();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('settings.toast.feature_updated')]);

        return back();
    }

    /**
     * Delete a feature flag.
     */
    public function destroy(Request $request, FeatureFlag $featureFlag, FeatureFlagService $featureFlags): RedirectResponse
    {
        abort_unless($request->user()?->can('settings.flags.manage'), 403);

        $featureFlag->delete();
        $featureFlags->forgetCache();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('settings.toast.feature_deleted')]);

        return back();
    }

    /**
     * Search users for feature flag targeting.
     */
    public function users(Request $request): JsonResponse
    {
        abort_unless($request->user()?->can('settings.flags.manage'), 403);

        $search = (string) $request->query('search', '');

        $users = User::query()
            ->select(['id', 'name', 'email'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->limit(20)
            ->get();

        return response()->json($users);
    }
}
