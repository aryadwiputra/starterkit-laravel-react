<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response;

class NotificationsController extends Controller
{
    public function index(Request $request): Response
    {
        $request->validate([
            'filter' => ['nullable', 'in:unread,read,all'],
        ]);

        $filter = $request->string('filter')->toString() ?: 'unread';
        $user = $request->user();

        $query = $user->notifications()->latest();

        if ($filter === 'unread') {
            $query->whereNull('read_at');
        }

        if ($filter === 'read') {
            $query->whereNotNull('read_at');
        }

        $notifications = $query->paginate(20)->through(function (DatabaseNotification $notification) {
            $data = is_array($notification->data) ? $notification->data : [];

            return [
                'id' => $notification->id,
                'read_at' => $notification->read_at?->toISOString(),
                'created_at' => $notification->created_at?->toISOString(),
                'title' => $data['title'] ?? null,
                'body' => $data['body'] ?? null,
                'url' => $data['url'] ?? null,
                'type' => class_basename($notification->type),
                'data' => $data,
            ];
        });

        return Inertia::render('notifications/index', [
            'filter' => $filter,
            'notifications' => $notifications,
        ]);
    }

    public function read(Request $request, string $notification): RedirectResponse
    {
        $model = $request->user()
            ->notifications()
            ->whereKey($notification)
            ->firstOrFail();

        if ($model->read_at === null) {
            $model->markAsRead();
        }

        return back();
    }

    public function readAll(Request $request): RedirectResponse
    {
        $request->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return back();
    }

    public function poll(Request $request): JsonResponse
    {
        $user = $request->user();

        $latest = $user->notifications()
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (DatabaseNotification $notification) {
                $data = is_array($notification->data) ? $notification->data : [];

                return [
                    'id' => $notification->id,
                    'read_at' => $notification->read_at?->toISOString(),
                    'created_at' => $notification->created_at?->toISOString(),
                    'title' => $data['title'] ?? null,
                    'body' => $data['body'] ?? null,
                    'url' => $data['url'] ?? null,
                    'type' => class_basename($notification->type),
                ];
            })
            ->all();

        return response()->json([
            'unread_count' => $user->unreadNotifications()->count(),
            'latest' => $latest,
        ]);
    }
}
