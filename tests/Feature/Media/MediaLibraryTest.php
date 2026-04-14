<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('guests cannot access media library', function () {
    $this->get('/media')->assertRedirect('/login');
});

test('users without permission cannot access media library', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($user)->get('/media')->assertForbidden();
});

test('admin can view media library', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/media')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('media/index')
            ->has('assets.data')
        );
});

test('admin can upload and delete media', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $file = UploadedFile::fake()->create('document.txt', 10, 'text/plain');

    $this->actingAs($admin)
        ->post('/media', [
            'title' => 'Doc',
            'file' => $file,
        ])
        ->assertRedirect();

    $media = Media::query()->firstOrFail();
    expect($media->disk)->toBe('public');

    Storage::disk('public')->assertExists($media->getPathRelativeToRoot());

    $this->actingAs($admin)
        ->get("/media/{$media->model_id}/download")
        ->assertOk()
        ->assertHeader('content-disposition');

    $this->actingAs($admin)
        ->delete("/media/{$media->model_id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('media_assets', ['id' => $media->model_id]);
});

test('admin can upload via chunked upload', function () {
    Storage::fake('local');
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $init = $this->actingAs($admin)->postJson('/media/uploads', [
        'title' => 'Large',
        'original_name' => 'big.txt',
        'mime_type' => 'text/plain',
        'size' => 12 * 1024 * 1024,
    ])->assertOk()->json();

    expect($init)->toHaveKeys(['upload_id', 'chunk_size', 'total_chunks']);
    expect($init['total_chunks'])->toBeGreaterThan(1);

    for ($i = 0; $i < $init['total_chunks']; $i++) {
        $chunk = UploadedFile::fake()->create("chunk-{$i}.bin", 10, 'application/octet-stream');

        $this->actingAs($admin)
            ->post("/media/uploads/{$init['upload_id']}/chunk", [
                'index' => $i,
                'chunk' => $chunk,
            ])
            ->assertOk();
    }

    $this->actingAs($admin)
        ->postJson("/media/uploads/{$init['upload_id']}/complete", [
            'title' => 'Large',
        ])
        ->assertOk();

    $media = Media::query()->firstOrFail();
    Storage::disk('public')->assertExists($media->getPathRelativeToRoot());

    Storage::disk('local')->assertMissing("tmp/media-uploads/{$init['upload_id']}");
});

