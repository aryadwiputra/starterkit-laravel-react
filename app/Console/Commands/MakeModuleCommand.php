<?php

namespace App\Console\Commands;

use App\Services\ModuleScaffolder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

class MakeModuleCommand extends Command
{
    protected $signature = 'make:module
        {name : Nama module (singular), mis. Post}
        {--base-path= : Override base path (untuk testing)}
        {--no-wayfinder : Jangan regenerate Wayfinder outputs}';

    protected $description = 'Scaffold module end-to-end (Laravel + Inertia React)';

    public function handle(ModuleScaffolder $scaffolder): int
    {
        $name = Str::studly((string) $this->argument('name'));
        $basePath = is_string($this->option('base-path')) && $this->option('base-path') !== ''
            ? (string) $this->option('base-path')
            : base_path();

        $result = $scaffolder->scaffold($name, $basePath);

        $this->info("Module {$name} generated.");
        $this->line('');

        foreach ($result->createdFiles as $path) {
            $this->line("<fg=green>CREATED</> {$path}");
        }

        foreach ($result->updatedFiles as $path) {
            $this->line("<fg=yellow>UPDATED</> {$path}");
        }

        foreach ($result->skippedFiles as $path) {
            $this->line("<fg=gray>SKIPPED</> {$path}");
        }

        if ($basePath === base_path() && ! $this->option('no-wayfinder')) {
            $this->line('');
            $this->line('Regenerating Wayfinder outputs...');

            Artisan::call('wayfinder:generate', [
                '--with-form' => true,
                '--no-interaction' => true,
            ]);

            $this->output->write(Artisan::output());
        }

        return self::SUCCESS;
    }
}
