<?php

use App\Http\Controllers\MediaAssetController;
use App\Http\Controllers\MediaUploadController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('media', [MediaAssetController::class, 'index'])->name('media.index');
    Route::post('media', [MediaAssetController::class, 'store'])->name('media.store');
    Route::delete('media/{mediaAsset}', [MediaAssetController::class, 'destroy'])->name('media.destroy');
    Route::get('media/{mediaAsset}/download', [MediaAssetController::class, 'download'])->name('media.download');

    Route::post('media/uploads', [MediaUploadController::class, 'store'])->name('media-uploads.store');
    Route::post('media/uploads/{upload}/chunk', [MediaUploadController::class, 'chunk'])->name('media-uploads.chunk');
    Route::post('media/uploads/{upload}/complete', [MediaUploadController::class, 'complete'])->name('media-uploads.complete');
    Route::delete('media/uploads/{upload}', [MediaUploadController::class, 'destroy'])->name('media-uploads.destroy');
});
