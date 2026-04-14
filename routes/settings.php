<?php

use App\Http\Controllers\Settings\ActivityLogController;
use App\Http\Controllers\Settings\AppSettingsController;
use App\Http\Controllers\Settings\FeatureFlagsController;
use App\Http\Controllers\Settings\MailSettingsController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use App\Http\Controllers\Settings\SettingsHomeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::redirect('settings/profile', '/profile');
    Route::redirect('settings/security', '/profile#security')->name('security.edit');

    Route::get('settings', [SettingsHomeController::class, 'index'])->name('settings.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    // Admin settings
    Route::get('settings/activity', [ActivityLogController::class, 'index'])->name('activity.index');

    Route::get('settings/app', [AppSettingsController::class, 'edit'])->name('app-settings.edit');
    Route::patch('settings/app', [AppSettingsController::class, 'update'])->name('app-settings.update');

    Route::get('settings/mail', [MailSettingsController::class, 'edit'])->name('mail-settings.edit');
    Route::patch('settings/mail', [MailSettingsController::class, 'update'])->name('mail-settings.update');
    Route::post('settings/mail/test', [MailSettingsController::class, 'test'])->name('mail-settings.test');

    Route::get('settings/features', [FeatureFlagsController::class, 'index'])->name('feature-flags.index');
    Route::get('settings/features/users', [FeatureFlagsController::class, 'users'])->name('feature-flags.users');
    Route::post('settings/features', [FeatureFlagsController::class, 'store'])->name('feature-flags.store');
    Route::put('settings/features/{featureFlag}', [FeatureFlagsController::class, 'update'])->name('feature-flags.update');
    Route::delete('settings/features/{featureFlag}', [FeatureFlagsController::class, 'destroy'])->name('feature-flags.destroy');
});
