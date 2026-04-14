<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataTableRequest;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     *
     * @return list<Middleware>
     */
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('verified'),
        ];
    }

    /**
     * Display a listing of roles.
     */
    public function index(DataTableRequest $request, DataTableService $dataTable): Response
    {
        $this->authorize('viewAny', Role::class);

        $query = Role::query()->withCount(['users', 'permissions']);

        $roles = $dataTable->apply(
            query: $query,
            request: $request,
            searchableColumns: ['name'],
        );

        return Inertia::render('roles/index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create(): Response
    {
        $this->authorize('create', Role::class);

        return Inertia::render('roles/create', [
            'permission_groups' => $this->permissionGroups(),
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = Role::create([
            'name' => $request->validated('name'),
        ]);

        $role->syncPermissions($request->validated('permissions', []));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('roles.toast.created')]);

        return to_route('roles.index');
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role): Response
    {
        if ($role->name === 'super-admin') {
            abort(403);
        }

        $this->authorize('update', $role);

        return Inertia::render('roles/edit', [
            'role' => $role->load('permissions:id,name'),
            'permission_groups' => $this->permissionGroups(),
        ]);
    }

    /**
     * Update the specified role.
     */
    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        if ($role->name === 'super-admin') {
            abort(403);
        }

        $this->authorize('update', $role);

        $role->update([
            'name' => $request->validated('name'),
        ]);

        $role->syncPermissions($request->validated('permissions', []));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('roles.toast.updated')]);

        return to_route('roles.index');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Request $request, Role $role): RedirectResponse
    {
        if ($role->name === 'super-admin') {
            abort(403);
        }

        $this->authorize('delete', $role);

        $role->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('roles.toast.deleted')]);

        return to_route('roles.index');
    }

    /**
     * Build grouped permissions for selection.
     *
     * @return array<int, array{group: string, permissions: array<int, array{name: string, label: string}>}>
     */
    private function permissionGroups(): array
    {
        return Permission::query()
            ->orderBy('name')
            ->get(['name'])
            ->groupBy(function (Permission $permission): string {
                $parts = explode('.', $permission->name, 2);

                return $parts[0] ?? 'other';
            })
            ->map(function ($permissions, string $group) {
                return [
                    'group' => $group,
                    'permissions' => $permissions->map(function (Permission $permission) {
                        $parts = explode('.', $permission->name, 2);

                        return [
                            'name' => $permission->name,
                            'label' => $parts[1] ?? $permission->name,
                        ];
                    })->values()->all(),
                ];
            })
            ->values()
            ->all();
    }
}
