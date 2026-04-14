<?php

use App\Models\User;
use App\Notifications\ImportantSecurityNotification;

test('in-app notifications index filters unread and read', function () {
    $user = User::factory()->create();

    $user->notify(new ImportantSecurityNotification(
        title: 'One',
        body: 'First',
        url: null,
    ));
    $user->notify(new ImportantSecurityNotification(
        title: 'Two',
        body: 'Second',
        url: null,
    ));

    $first = $user->notifications()->firstOrFail();
    $first->markAsRead();

    $this->actingAs($user)
        ->get('/notifications?filter=unread')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('notifications/index')
            ->where('filter', 'unread')
            ->has('notifications.data', 1)
        );

    $this->actingAs($user)
        ->get('/notifications?filter=read')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('notifications/index')
            ->where('filter', 'read')
            ->has('notifications.data', 1)
        );
});

test('mark as read endpoints work', function () {
    $user = User::factory()->create();

    $user->notify(new ImportantSecurityNotification(
        title: 'One',
        body: 'First',
        url: null,
    ));
    $user->notify(new ImportantSecurityNotification(
        title: 'Two',
        body: 'Second',
        url: null,
    ));

    $notification = $user->unreadNotifications()->firstOrFail();

    $this->actingAs($user)
        ->post("/notifications/{$notification->id}/read")
        ->assertRedirect();

    expect($user->fresh()->unreadNotifications()->count())->toBe(1);

    $this->actingAs($user)
        ->post('/notifications/read-all')
        ->assertRedirect();

    expect($user->fresh()->unreadNotifications()->count())->toBe(0);
});

test('poll endpoint returns unread count and latest', function () {
    $user = User::factory()->create();

    $user->notify(new ImportantSecurityNotification(
        title: 'One',
        body: 'First',
        url: null,
    ));

    $this->actingAs($user)
        ->getJson('/notifications/poll')
        ->assertOk()
        ->assertJsonStructure(['unread_count', 'latest'])
        ->assertJson([
            'unread_count' => 1,
        ]);
});
