<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaUpload extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'user_id',
        'title',
        'original_name',
        'mime_type',
        'size',
        'chunk_size',
        'total_chunks',
        'expires_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
