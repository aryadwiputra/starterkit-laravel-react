<?php

namespace App\Console\Commands;

use App\Inertia\SharedProps;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class InertiaTypesCommand extends Command
{
    protected $signature = 'inertia:types
        {--path= : Output path (default: resources/js/types/global.d.ts)}';

    protected $description = 'Generate TypeScript types for Inertia shared props';

    public function handle(SharedProps $sharedProps, Filesystem $files): int
    {
        $path = is_string($this->option('path')) && $this->option('path') !== ''
            ? (string) $this->option('path')
            : base_path('resources/js/types/global.d.ts');

        $files->ensureDirectoryExists(dirname($path));
        $files->put($path, $sharedProps->typescriptDefinition()."\n");

        $this->info("Generated: {$path}");

        return self::SUCCESS;
    }
}
