<?php

use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('notifications', [NotificationsController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notification}/read', [NotificationsController::class, 'read'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationsController::class, 'readAll'])->name('notifications.read-all');
    Route::get('notifications/poll', [NotificationsController::class, 'poll'])->name('notifications.poll');

    Route::patch('profile/notification-preferences', [ProfileController::class, 'updateNotificationPreferences'])
        ->name('profile.notification-preferences.update');
});
