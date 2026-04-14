<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'type_key',
        'channels',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'channels' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
