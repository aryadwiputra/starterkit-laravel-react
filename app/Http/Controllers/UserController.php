<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkUserActionRequest;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\DataTableService;
use App\Services\ExportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Role;

class UserController extends Controller implements HasMiddleware
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
     * Display a listing of users.
     */
    public function index(DataTableRequest $request, DataTableService $dataTable): Response
    {
        $this->authorize('viewAny', User::class);

        $query = User::with('roles');

        $users = $dataTable->apply(
            query: $query,
            request: $request,
            searchableColumns: ['name', 'email'],
            filterableColumns: ['is_active'],
        );

        // Handle role filter separately since it's a relationship
        if ($roleFilter = $request->filters()['role'] ?? null) {
            $query->role($roleFilter);
            $users = $dataTable->apply(
                query: $query,
                request: $request,
                searchableColumns: ['name', 'email'],
                filterableColumns: ['is_active'],
            );
        }

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => Role::pluck('name'),
            'filters' => $request->only(['search', 'sort_by', 'sort_direction', 'per_page', 'filters']),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('users/create', [
            'roles' => Role::pluck('name'),
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => $request->validated('password'),
            'is_active' => $request->validated('is_active', true),
        ]);

        $user->assignRole($request->validated('role'));

        activity()
            ->performedOn($user)
            ->causedBy($request->user())
            ->withProperties(['role' => $request->validated('role')])
            ->log('Created user');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User created successfully.')]);

        return to_route('users.index');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        $user->load('roles');

        $activities = Activity::where(function ($query) use ($user) {
            $query->where('subject_type', User::class)
                ->where('subject_id', $user->id);
        })->orWhere(function ($query) use ($user) {
            $query->where('causer_type', User::class)
                ->where('causer_id', $user->id);
        })
            ->latest()
            ->limit(50)
            ->get();

        return Inertia::render('users/show', [
            'user' => $user,
            'activities' => $activities,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        $user->load('roles');

        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => Role::pluck('name'),
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = [
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'is_active' => $request->validated('is_active', $user->is_active),
        ];

        if ($request->validated('password')) {
            $data['password'] = $request->validated('password');
        }

        // Track email change for re-verification
        $emailChanged = $user->email !== $request->validated('email');

        $user->update($data);

        if ($emailChanged) {
            $user->update(['email_verified_at' => null]);
        }

        $user->syncRoles([$request->validated('role')]);

        activity()
            ->performedOn($user)
            ->causedBy($request->user())
            ->withProperties(['role' => $request->validated('role')])
            ->log('Updated user');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User updated successfully.')]);

        return to_route('users.index');
    }

    /**
     * Remove the specified user (soft delete).
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        activity()
            ->performedOn($user)
            ->causedBy($request->user())
            ->log('Deleted user');

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User deleted successfully.')]);

        return to_route('users.index');
    }

    /**
     * Execute a bulk action on multiple users.
     */
    public function bulkAction(BulkUserActionRequest $request): RedirectResponse
    {
        $action = $request->validated('action');
        $userIds = $request->validated('user_ids');

        // Exclude current user from bulk actions
        $userIds = array_filter($userIds, fn ($id) => $id !== $request->user()->id);

        $users = User::whereIn('id', $userIds)->get();

        match ($action) {
            'activate' => $users->each(function (User $user) use ($request) {
                $user->update(['is_active' => true]);
                activity()->performedOn($user)->causedBy($request->user())->log('Activated user via bulk action');
            }),
            'deactivate' => $users->each(function (User $user) use ($request) {
                $user->update(['is_active' => false]);
                activity()->performedOn($user)->causedBy($request->user())->log('Deactivated user via bulk action');
            }),
            'delete' => $users->each(function (User $user) use ($request) {
                if ($request->user()->can('delete', $user)) {
                    activity()->performedOn($user)->causedBy($request->user())->log('Deleted user via bulk action');
                    $user->delete();
                }
            }),
        };

        $message = match ($action) {
            'activate' => __(':count users activated.', ['count' => $users->count()]),
            'deactivate' => __(':count users deactivated.', ['count' => $users->count()]),
            'delete' => __('Selected users deleted.'),
        };

        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);

        return to_route('users.index');
    }

    /**
     * Export users.
     */
    public function export(DataTableRequest $request, DataTableService $dataTable, ExportService $exportService): mixed
    {
        $this->authorize('export', User::class);

        $format = $request->input('format', 'csv');
        $query = User::with('roles');

        // Apply same filters as index
        $this->applyQueryFilters($query, $request, $dataTable);

        $columnMap = [
            'name' => 'Name',
            'email' => 'Email',
            'roles.0.name' => 'Role',
            'is_active' => 'Status',
            'created_at' => 'Created At',
        ];

        return match ($format) {
            'excel' => $exportService->excel($query, $columnMap, 'users'),
            'pdf' => $exportService->pdf($query, $columnMap, 'users'),
            default => $exportService->csv($query, $columnMap, 'users'),
        };
    }

    /**
     * Apply query filters from request.
     */
    private function applyQueryFilters(mixed $query, DataTableRequest $request, DataTableService $dataTable): void
    {
        if ($request->searchQuery()) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->searchQuery()}%")
                    ->orWhere('email', 'like', "%{$request->searchQuery()}%");
            });
        }

        if ($roleFilter = $request->filters()['role'] ?? null) {
            $query->role($roleFilter);
        }

        if (($statusFilter = $request->filters()['is_active'] ?? null) !== null && $statusFilter !== '') {
            $query->where('is_active', $statusFilter);
        }

        $query->orderBy($request->sortBy(), $request->sortDirection());
    }
}
