<?php

use App\Http\Controllers\MediaAssetController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('media', [MediaAssetController::class, 'index'])->name('media.index');
    Route::post('media', [MediaAssetController::class, 'store'])->name('media.store');
    Route::delete('media/{mediaAsset}', [MediaAssetController::class, 'destroy'])->name('media.destroy');
    Route::get('media/{mediaAsset}/download', [MediaAssetController::class, 'download'])->name('media.download');
});

