<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompleteMediaUploadRequest;
use App\Http\Requests\StoreMediaUploadChunkRequest;
use App\Http\Requests\StoreMediaUploadRequest;
use App\Models\MediaAsset;
use App\Models\MediaUpload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MediaUploadController extends Controller implements HasMiddleware
{
    private const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

    private const TEMP_ROOT = 'tmp/media-uploads';

    /**
     * @var array<int, string>
     */
    private const ALLOWED_MIMES = [
        'jpg',
        'jpeg',
        'png',
        'webp',
        'gif',
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'csv',
        'txt',
        'zip',
    ];

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

    public function store(StoreMediaUploadRequest $request): JsonResponse
    {
        $uploadId = (string) Str::uuid();
        $size = (int) $request->validated('size');
        $totalChunks = (int) ceil($size / self::CHUNK_SIZE);

        MediaUpload::create([
            'id' => $uploadId,
            'user_id' => $request->user()->id,
            'title' => $request->validated('title'),
            'original_name' => $request->validated('original_name'),
            'mime_type' => $request->validated('mime_type'),
            'size' => $size,
            'chunk_size' => self::CHUNK_SIZE,
            'total_chunks' => $totalChunks,
            'expires_at' => now()->addHours(6),
        ]);

        return response()->json([
            'upload_id' => $uploadId,
            'chunk_size' => self::CHUNK_SIZE,
            'total_chunks' => $totalChunks,
        ]);
    }

    public function chunk(StoreMediaUploadChunkRequest $request, MediaUpload $upload): JsonResponse
    {
        $upload = $this->ownedUpload($request, $upload);

        $index = (int) $request->validated('index');
        if ($index < 0 || $index >= $upload->total_chunks) {
            return response()->json(['message' => 'Invalid chunk index.'], 422);
        }

        /** @var UploadedFile $file */
        $file = $request->file('chunk');

        Storage::disk('local')->putFileAs(
            $this->chunksDir($upload),
            $file,
            (string) $index,
        );

        return response()->json(['ok' => true]);
    }

    public function complete(CompleteMediaUploadRequest $request, MediaUpload $upload): JsonResponse
    {
        $upload = $this->ownedUpload($request, $upload);

        $assembledRelativePath = $this->assembledPath($upload);
        $this->assembleChunks($upload, $assembledRelativePath);

        $absolutePath = Storage::disk('local')->path($assembledRelativePath);
        $this->validateAssembledFile($absolutePath, $upload);

        $asset = MediaAsset::create([
            'title' => $request->validated('title') ?? $upload->title,
            'uploaded_by' => $request->user()->id,
        ]);

        $asset
            ->addMedia($absolutePath)
            ->usingName(pathinfo($upload->original_name, PATHINFO_FILENAME))
            ->usingFileName($this->safeFileName($upload->original_name))
            ->toMediaCollection('file');

        $this->cleanup($upload, $assembledRelativePath);
        $upload->delete();

        return response()->json([
            'asset_id' => $asset->id,
        ]);
    }

    public function destroy(Request $request, MediaUpload $upload): JsonResponse
    {
        $upload = $this->ownedUpload($request, $upload);

        $this->cleanup($upload, $this->assembledPath($upload));
        $upload->delete();

        return response()->json(['ok' => true]);
    }

    private function ownedUpload(Request $request, MediaUpload $upload): MediaUpload
    {
        if ($upload->expires_at && $upload->expires_at->isPast()) {
            abort(410);
        }

        abort_unless((int) $upload->user_id === (int) $request->user()?->id, 404);

        return $upload;
    }

    private function chunksDir(MediaUpload $upload): string
    {
        return self::TEMP_ROOT.'/'.$upload->id.'/chunks';
    }

    private function assembledPath(MediaUpload $upload): string
    {
        return self::TEMP_ROOT.'/'.$upload->id.'/assembled.bin';
    }

    private function assembleChunks(MediaUpload $upload, string $assembledRelativePath): void
    {
        $disk = Storage::disk('local');
        $chunksDir = $this->chunksDir($upload);

        for ($i = 0; $i < $upload->total_chunks; $i++) {
            if (! $disk->exists($chunksDir.'/'.$i)) {
                abort(422, 'Missing chunks.');
            }
        }

        $assembledAbsolutePath = $disk->path($assembledRelativePath);
        $dir = dirname($assembledAbsolutePath);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $out = fopen($assembledAbsolutePath, 'wb');
        abort_unless(is_resource($out), 500);

        try {
            for ($i = 0; $i < $upload->total_chunks; $i++) {
                $chunkStream = $disk->readStream($chunksDir.'/'.$i);
                abort_unless(is_resource($chunkStream), 500);

                stream_copy_to_stream($chunkStream, $out);
                fclose($chunkStream);
            }
        } finally {
            fclose($out);
        }
    }

    private function validateAssembledFile(string $absolutePath, MediaUpload $upload): void
    {
        $maxBytes = (int) config('media-library.max_file_size', 0);
        $maxKilobytes = $maxBytes > 0 ? (int) ceil($maxBytes / 1024) : null;

        $uploadedFile = new UploadedFile(
            $absolutePath,
            $upload->original_name,
            $upload->mime_type ?: null,
            null,
            true,
        );

        $rules = [
            'file' => array_values(array_filter([
                'required',
                'file',
                $maxKilobytes ? 'max:'.$maxKilobytes : null,
                'mimes:'.implode(',', self::ALLOWED_MIMES),
            ])),
        ];

        Validator::make(['file' => $uploadedFile], $rules)->validate();
    }

    private function safeFileName(string $name): string
    {
        $base = pathinfo($name, PATHINFO_FILENAME);
        $ext = pathinfo($name, PATHINFO_EXTENSION);

        $base = Str::of($base)->replaceMatches('/[^A-Za-z0-9._-]+/', '-')->trim('-')->toString();
        $ext = Str::of($ext)->replaceMatches('/[^A-Za-z0-9]+/', '')->toString();

        if ($base === '') {
            $base = 'file';
        }

        return $ext !== '' ? "{$base}.{$ext}" : $base;
    }

    private function cleanup(MediaUpload $upload, string $assembledRelativePath): void
    {
        $disk = Storage::disk('local');

        $disk->deleteDirectory(self::TEMP_ROOT.'/'.$upload->id);
        $disk->delete($assembledRelativePath);
    }
}
