<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Models\FeatureFlag;
use App\Models\MediaAsset;
use App\Models\Setting;
use App\Models\User;
use App\Services\DataTableService;
use Illuminate\Database\Eloquent\Model as EloquentModel;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(DataTableRequest $request, DataTableService $dataTable): Response
    {
        abort_unless($request->user()?->can('activity.view'), 403);

        $query = Activity::query()
            ->with([
                'causer',
                'subject',
            ])
            ->when($request->query('subject_type'), function ($query, $subjectType) {
                $query->where('subject_type', $subjectType);
            })
            ->when($request->query('subject_id'), function ($query, $subjectId) {
                $query->where('subject_id', $subjectId);
            })
            ->when($request->query('causer_id'), function ($query, $causerId) {
                $query->where('causer_id', $causerId);
            });

        $activities = $dataTable->apply(
            query: $query,
            request: $request,
            searchableColumns: ['description'],
            filterableColumns: ['event', 'log_name'],
        )->through(fn (Activity $activity): array => $this->activityToArray($activity));

        $logNames = Activity::query()
            ->select('log_name')
            ->whereNotNull('log_name')
            ->distinct()
            ->orderBy('log_name')
            ->pluck('log_name')
            ->values()
            ->all();

        return Inertia::render('activity/index', [
            'activities' => $activities,
            'log_names' => $logNames,
            'events' => ['created', 'updated', 'deleted'],
        ]);
    }

    /**
     * @return array{
     *   id: int,
     *   log_name: string|null,
     *   event: string|null,
     *   description: string,
     *   subject: array{type:string|null,id:int|null,label:string|null},
     *   causer: array{id:int|null,label:string|null},
     *   properties: array<string, mixed>,
     *   created_at: string
     * }
     */
    private function activityToArray(Activity $activity): array
    {
        $subject = $activity->subject instanceof EloquentModel ? $activity->subject : null;
        $causer = $activity->causer instanceof EloquentModel ? $activity->causer : null;

        return [
            'id' => $activity->id,
            'log_name' => $activity->log_name,
            'event' => $activity->event,
            'description' => $activity->description,
            'subject' => [
                'type' => $activity->subject_type,
                'id' => $activity->subject_id,
                'label' => $subject ? $this->subjectLabel($subject) : null,
            ],
            'causer' => [
                'id' => $activity->causer_id,
                'label' => $causer ? $this->causerLabel($causer) : null,
            ],
            'properties' => $activity->properties?->toArray() ?? [],
            'created_at' => $activity->created_at?->toISOString() ?? now()->toISOString(),
        ];
    }

    private function subjectLabel(EloquentModel $model): string
    {
        if ($model instanceof User) {
            return $model->name;
        }

        if ($model instanceof Setting) {
            return $model->key;
        }

        if ($model instanceof FeatureFlag) {
            return $model->key;
        }

        if ($model instanceof MediaAsset) {
            return $model->title ?: 'Media #'.$model->id;
        }

        return class_basename($model).' #'.$model->getKey();
    }

    private function causerLabel(EloquentModel $model): string
    {
        if ($model instanceof User) {
            return $model->name;
        }

        return class_basename($model).' #'.$model->getKey();
    }
}
