<?php

namespace App\Policies;

use App\Models\MediaAsset;
use App\Models\User;

class MediaAssetPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('media.manage');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MediaAsset $mediaAsset): bool
    {
        return $user->can('media.manage');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('media.manage');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MediaAsset $mediaAsset): bool
    {
        return $user->can('media.manage');
    }

    /**
     * Determine whether the user can download the model's file.
     */
    public function download(User $user, MediaAsset $mediaAsset): bool
    {
        return $user->can('media.manage');
    }
}
