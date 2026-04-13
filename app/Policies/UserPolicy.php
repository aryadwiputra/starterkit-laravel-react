<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('user.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return $user->can('user.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('user.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        if (! $user->can('user.edit')) {
            return false;
        }

        // Non-super-admin cannot edit super-admin
        if ($model->hasRole('super-admin') && ! $user->hasRole('super-admin')) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        if (! $user->can('user.delete')) {
            return false;
        }

        // Cannot delete self
        if ($user->id === $model->id) {
            return false;
        }

        // Cannot delete super-admin unless you are super-admin
        if ($model->hasRole('super-admin') && ! $user->hasRole('super-admin')) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can impersonate the model.
     */
    public function impersonate(User $user, User $model): bool
    {
        if (! $user->can('user.impersonate')) {
            return false;
        }

        // Cannot impersonate self
        if ($user->id === $model->id) {
            return false;
        }

        // Cannot impersonate super-admin
        if ($model->hasRole('super-admin')) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can do bulk actions.
     */
    public function bulkAction(User $user): bool
    {
        return $user->can('user.edit') || $user->can('user.delete');
    }

    /**
     * Determine whether the user can export users.
     */
    public function export(User $user): bool
    {
        return $user->can('user.view');
    }
}
