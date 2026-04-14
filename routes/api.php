<?php

use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\V1\AuthTokenController;
use App\Http\Controllers\Api\V1\MeController;
use Illuminate\Support\Facades\Route;

Route::get('health', HealthController::class)->name('api.health');

Route::prefix('v1')
    ->name('api.v1.')
    ->group(function () {
        Route::middleware('throttle:api-auth')->group(function () {
            Route::post('auth/tokens', [AuthTokenController::class, 'store'])->name('auth.tokens.store');
            Route::delete('auth/tokens/current', [AuthTokenController::class, 'destroy'])
                ->middleware('auth:sanctum')
                ->name('auth.tokens.destroy-current');
        });

        Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
            Route::get('me', MeController::class)->name('me');
        });
    });
