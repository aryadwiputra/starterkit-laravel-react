<?php

use App\Http\Controllers\ColumnPreferenceController;
use App\Http\Controllers\ImpersonationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // User Management
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class)->except(['show']);
    Route::post('users/bulk-action', [UserController::class, 'bulkAction'])->name('users.bulk-action');
    Route::get('users-export', [UserController::class, 'export'])->name('users.export');

    // Impersonation
    Route::post('impersonate/{user}', [ImpersonationController::class, 'start'])->name('impersonate.start');
    Route::post('impersonate-stop', [ImpersonationController::class, 'stop'])->name('impersonate.stop');

    // Column Preferences
    Route::post('column-preferences', [ColumnPreferenceController::class, 'store'])->name('column-preferences.store');
});

require __DIR__.'/settings.php';
