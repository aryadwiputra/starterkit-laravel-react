<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataTableRequest;
use App\Http\Requests\StoreMediaAssetRequest;
use App\Models\MediaAsset;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaAssetController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     *
     * @return list<Middleware>
     */
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('verified'),
        ];
    }

    public function index(DataTableRequest $request, DataTableService $dataTable): InertiaResponse
    {
        $this->authorize('viewAny', MediaAsset::class);

        $query = MediaAsset::query()
            ->with([
                'uploadedBy:id,name',
                'media',
            ])
            ->latest();

        $assets = $dataTable->apply(
            query: $query,
            request: $request,
            searchableColumns: ['title', 'uploadedBy.name', 'media.name'],
        )->through(fn (MediaAsset $asset): array => $this->assetToArray($asset));

        return Inertia::render('media/index', [
            'assets' => $assets,
        ]);
    }

    public function store(StoreMediaAssetRequest $request): RedirectResponse
    {
        $this->authorize('create', MediaAsset::class);

        $asset = MediaAsset::create([
            'title' => $request->validated('title'),
            'uploaded_by' => $request->user()?->id,
        ]);

        $asset
            ->addMediaFromRequest('file')
            ->toMediaCollection('file');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('media.toast.uploaded')]);

        return back();
    }

    public function destroy(Request $request, MediaAsset $mediaAsset): RedirectResponse
    {
        $this->authorize('delete', $mediaAsset);

        $mediaAsset->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('media.toast.deleted')]);

        return back();
    }

    public function download(Request $request, MediaAsset $mediaAsset): StreamedResponse
    {
        $this->authorize('download', $mediaAsset);

        /** @var Media|null $media */
        $media = $mediaAsset->getFirstMedia('file');

        abort_unless($media, 404);

        return Storage::disk($media->disk)->download(
            $media->getPathRelativeToRoot(),
            $media->file_name,
        );
    }

    /**
     * @return array{
     *   id: int,
     *   title: string|null,
     *   uploaded_by: array{id:int,name:string}|null,
     *   file: array{
     *     name: string,
     *     mime_type: string|null,
     *     size: int|null,
     *     url: string,
     *     thumb_url: string|null
     *   }|null,
     *   created_at: string
     * }
     */
    private function assetToArray(MediaAsset $asset): array
    {
        /** @var Media|null $media */
        $media = $asset->getFirstMedia('file');
        $isImage = $media && is_string($media->mime_type) && str_starts_with($media->mime_type, 'image/');

        return [
            'id' => $asset->id,
            'title' => $asset->title,
            'uploaded_by' => $asset->uploadedBy
                ? ['id' => $asset->uploadedBy->id, 'name' => $asset->uploadedBy->name]
                : null,
            'file' => $media
                ? [
                    'name' => $media->name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                    'url' => $media->getFullUrl(),
                    'thumb_url' => $isImage ? $media->getFullUrl('thumb') : null,
                ]
                : null,
            'created_at' => $asset->created_at?->toISOString() ?? now()->toISOString(),
        ];
    }
}
