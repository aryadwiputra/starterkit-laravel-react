<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;

class Setting extends Model
{
    use LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'key',
        'value',
        'type',
        'is_encrypted',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_encrypted' => 'boolean',
        ];
    }

    /**
     * Get the activity log options for this model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('settings')
            ->logOnly(['key', 'type', 'is_encrypted', 'value'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "{$eventName} setting";
    }

    public function tapActivity(Activity $activity, string $eventName): void
    {
        if (! $this->is_encrypted) {
            return;
        }

        $properties = $activity->properties ?? collect();

        $activity->properties = $properties
            ->put('old', collect($properties->get('old', []))->put('value', '[encrypted]')->all())
            ->put('attributes', collect($properties->get('attributes', []))->put('value', '[encrypted]')->all());
    }
}
