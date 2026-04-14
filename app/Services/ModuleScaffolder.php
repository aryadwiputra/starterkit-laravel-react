<?php

namespace App\Services;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;

class ModuleScaffolder
{
    public function __construct(
        private readonly Filesystem $files,
        private readonly PhpSourceEditor $php,
    ) {
        //
    }

    public function scaffold(string $name, string $basePath): ModuleScaffoldResult
    {
        $stubRoot = base_path('stubs/module');

        $model = Str::studly($name);
        $plural = Str::kebab(Str::pluralStudly($model));
        $singular = Str::kebab($model);
        $table = Str::snake(Str::pluralStudly($model));

        $controllerClass = "{$model}Controller";
        $storeRequestClass = "Store{$model}Request";
        $updateRequestClass = "Update{$model}Request";
        $policyClass = "{$model}Policy";
        $resourceClass = "{$model}Resource";
        $serviceClass = "{$model}Service";

        /** @var array<string, string> $replacements */
        $replacements = [
            '{{ model }}' => $model,
            '{{ model_singular }}' => $singular,
            '{{ model_plural }}' => $plural,
            '{{ table }}' => $table,
            '{{ controller }}' => $controllerClass,
            '{{ store_request }}' => $storeRequestClass,
            '{{ update_request }}' => $updateRequestClass,
            '{{ policy }}' => $policyClass,
            '{{ resource }}' => $resourceClass,
            '{{ service }}' => $serviceClass,
        ];

        $created = [];
        $updated = [];
        $skipped = [];

        $this->ensureDirectory("{$basePath}/app/Models");
        $this->ensureDirectory("{$basePath}/app/Http/Controllers");
        $this->ensureDirectory("{$basePath}/app/Http/Requests");
        $this->ensureDirectory("{$basePath}/app/Policies");
        $this->ensureDirectory("{$basePath}/app/Http/Resources");
        $this->ensureDirectory("{$basePath}/app/Services");

        $this->ensureDirectory("{$basePath}/resources/js/pages/{$plural}");
        $this->ensureDirectory("{$basePath}/resources/js/types");

        $this->createFromStubIfMissing("{$stubRoot}/model.stub", "{$basePath}/app/Models/{$model}.php", $replacements, $basePath, $created, $skipped);
        $this->createMigrationIfMissing($basePath, $table, $replacements, $created, $skipped);
        $this->createFromStubIfMissing("{$stubRoot}/controller.stub", "{$basePath}/app/Http/Controllers/{$controllerClass}.php", $replacements, $basePath, $created, $skipped);
        $this->createFromStubIfMissing("{$stubRoot}/store-request.stub", "{$basePath}/app/Http/Requests/{$storeRequestClass}.php", $replacements, $basePath, $created, $skipped);
        $this->createFromStubIfMissing("{$stubRoot}/update-request.stub", "{$basePath}/app/Http/Requests/{$updateRequestClass}.php", $replacements, $basePath, $created, $skipped);
        $this->createFromStubIfMissing("{$stubRoot}/policy.stub", "{$basePath}/app/Policies/{$policyClass}.php", $replacements, $basePath, $created, $skipped);
        $this->createFromStubIfMissing("{$stubRoot}/resource.stub", "{$basePath}/app/Http/Resources/{$resourceClass}.php", $replacements, $basePath, $created, $skipped);
        $this->createFromStubIfMissing("{$stubRoot}/service.stub", "{$basePath}/app/Services/{$serviceClass}.php", $replacements, $basePath, $created, $skipped);

        $this->createFromStubIfMissing("{$stubRoot}/ts-type.stub", "{$basePath}/resources/js/types/{$singular}.ts", $replacements, $basePath, $created, $skipped);
        $this->createFromStubIfMissing("{$stubRoot}/page-index.stub", "{$basePath}/resources/js/pages/{$plural}/index.tsx", $replacements, $basePath, $created, $skipped);
        $this->createFromStubIfMissing("{$stubRoot}/page-create.stub", "{$basePath}/resources/js/pages/{$plural}/create.tsx", $replacements, $basePath, $created, $skipped);
        $this->createFromStubIfMissing("{$stubRoot}/page-edit.stub", "{$basePath}/resources/js/pages/{$plural}/edit.tsx", $replacements, $basePath, $created, $skipped);

        $updated = array_merge($updated, $this->ensureRouteRegistration($basePath, $plural, $controllerClass));
        $updated = array_merge($updated, $this->ensurePolicyRegistration($basePath, $model, $policyClass));

        return new ModuleScaffoldResult(
            createdFiles: array_values(array_unique($created)),
            updatedFiles: array_values(array_unique($updated)),
            skippedFiles: array_values(array_unique($skipped)),
        );
    }

    /**
     * @return list<string>
     */
    private function ensureRouteRegistration(string $basePath, string $plural, string $controllerClass): array
    {
        $updated = [];
        $webRoutes = "{$basePath}/routes/web.php";

        $contents = $this->files->get($webRoutes);
        $useLine = "use App\\Http\\Controllers\\{$controllerClass};";

        if (! str_contains($contents, $useLine)) {
            $pos = strpos($contents, 'use Illuminate\\Support\\Facades\\Route;');
            if ($pos !== false) {
                $contents = substr_replace($contents, "{$useLine}\n", $pos, 0);
            }
        }

        $routeLine = "    Route::resource('{$plural}', {$controllerClass}::class)->except(['show']);";
        if (! str_contains($contents, $routeLine) && ! str_contains($contents, "Route::resource('{$plural}',")) {
            $groupPos = strpos($contents, "Route::middleware(['auth', 'verified'])->group(function () {");
            if ($groupPos !== false) {
                $insertPos = strpos($contents, "\n", $groupPos);
                if ($insertPos !== false) {
                    $insertPos += 1;
                    $contents = substr_replace($contents, "\n    // {$controllerClass}\n{$routeLine}\n", $insertPos, 0);
                }
            }
        }

        $this->files->put($webRoutes, $contents);
        $updated[] = 'routes/web.php';

        return $updated;
    }

    /**
     * @return list<string>
     */
    private function ensurePolicyRegistration(string $basePath, string $model, string $policyClass): array
    {
        $updated = [];

        $provider = "{$basePath}/app/Providers/AppServiceProvider.php";
        $modelFqcn = "App\\Models\\{$model}";
        $policyFqcn = "App\\Policies\\{$policyClass}";

        $updatedModelUse = $this->php->addUseStatementIfMissing($provider, $modelFqcn);
        $updatedPolicyUse = $this->php->addUseStatementIfMissing($provider, $policyFqcn);
        $updatedGatePolicy = $this->php->addGatePolicyIfMissing($provider, $modelFqcn, $policyFqcn);

        $didUpdate = $updatedModelUse || $updatedPolicyUse || $updatedGatePolicy;

        if ($didUpdate) {
            $updated[] = 'app/Providers/AppServiceProvider.php';
        }

        return $updated;
    }

    /**
     * @param  array<string, string>  $replacements
     * @param  list<string>  $created
     * @param  list<string>  $skipped
     */
    private function createMigrationIfMissing(string $basePath, string $table, array $replacements, array &$created, array &$skipped): void
    {
        $existing = $this->files->glob("{$basePath}/database/migrations/*_create_{$table}_table.php");

        if (count($existing) > 0) {
            $skipped[] = "database/migrations/*_create_{$table}_table.php";

            return;
        }

        $timestamp = now()->format('Y_m_d_His');
        $path = "{$basePath}/database/migrations/{$timestamp}_create_{$table}_table.php";

        $this->createFromStubIfMissing(base_path('stubs/module/migration.stub'), $path, $replacements, $basePath, $created, $skipped);
    }

    /**
     * @param  array<string, string>  $replacements
     * @param  list<string>  $created
     * @param  list<string>  $skipped
     */
    private function createFromStubIfMissing(string $stubPath, string $destinationPath, array $replacements, string $basePath, array &$created, array &$skipped): void
    {
        if ($this->files->exists($destinationPath)) {
            $skipped[] = $this->relativePath($destinationPath, $basePath);

            return;
        }

        $contents = $this->files->get($stubPath);
        $contents = str_replace(array_keys($replacements), array_values($replacements), $contents);

        $this->ensureDirectory(dirname($destinationPath));
        $this->files->put($destinationPath, $contents);
        $created[] = $this->relativePath($destinationPath, $basePath);
    }

    private function ensureDirectory(string $path): void
    {
        if (! $this->files->isDirectory($path)) {
            $this->files->makeDirectory($path, 0755, true);
        }
    }

    private function relativePath(string $path, string $basePath): string
    {
        if (Str::startsWith($path, $basePath)) {
            return ltrim(Str::after($path, $basePath), '/');
        }

        return $path;
    }
}
