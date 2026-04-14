<?php

use App\Services\ModuleScaffolder;
use Illuminate\Filesystem\Filesystem;

it('scaffolds a module idempotently', function () {
    $files = new Filesystem;
    $basePath = storage_path('app/testing/module-scaffolder');

    $files->deleteDirectory($basePath);

    $files->ensureDirectoryExists("{$basePath}/app/Providers");
    $files->ensureDirectoryExists("{$basePath}/database/migrations");
    $files->ensureDirectoryExists("{$basePath}/routes");

    $files->put("{$basePath}/routes/web.php", <<<'PHP'
<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', fn () => 'ok')->name('dashboard');
});
PHP);

    $files->put("{$basePath}/app/Providers/AppServiceProvider.php", <<<'PHP'
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    protected function configureAuthorization(): void
    {
        Gate::before(function ($user, $ability) {
            return null;
        });
    }
}
PHP);

    $scaffolder = app(ModuleScaffolder::class);

    $scaffolder->scaffold('Post', $basePath);

    expect($files->exists("{$basePath}/app/Models/Post.php"))->toBeTrue();
    expect($files->exists("{$basePath}/app/Http/Controllers/PostController.php"))->toBeTrue();
    expect(count($files->glob("{$basePath}/database/migrations/*_create_posts_table.php")))->toBe(1);

    $webRoutes = $files->get("{$basePath}/routes/web.php");
    expect(substr_count($webRoutes, "Route::resource('posts'"))->toBe(1);
    expect($webRoutes)->toContain('use App\\Http\\Controllers\\PostController;');

    $provider = $files->get("{$basePath}/app/Providers/AppServiceProvider.php");
    expect($provider)->toContain('use App\\Models\\Post;');
    expect($provider)->toContain('use App\\Policies\\PostPolicy;');
    expect($provider)->toContain('Gate::policy(Post::class, PostPolicy::class);');

    $scaffolder->scaffold('Post', $basePath);

    $webRoutesAgain = $files->get("{$basePath}/routes/web.php");
    expect(substr_count($webRoutesAgain, "Route::resource('posts'"))->toBe(1);
    expect(count($files->glob("{$basePath}/database/migrations/*_create_posts_table.php")))->toBe(1);
});
