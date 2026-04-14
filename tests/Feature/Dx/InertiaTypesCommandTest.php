<?php

use Illuminate\Filesystem\Filesystem;

it('generates TypeScript shared props definition', function () {
    $path = storage_path('app/testing/inertia-global.d.ts');
    $files = new Filesystem;

    $files->ensureDirectoryExists(dirname($path));
    $files->delete($path);

    $this->artisan('inertia:types', ['--path' => $path])
        ->assertExitCode(0);

    expect($files->exists($path))->toBeTrue();
    expect($files->get($path))->toContain('sharedPageProps');
});
