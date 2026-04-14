<?php

return [
    'title' => 'Notifications',
    'description' => 'Stay up to date with what matters to you.',
    'bell' => [
        'title' => 'Notifications',
        'empty' => 'No notifications yet.',
    ],
    'actions' => [
        'mark_all_read' => 'Mark all as read',
        'mark_read' => 'Mark as read',
        'view_all' => 'All notifications',
        'open' => 'Open',
    ],
    'filters' => [
        'unread' => 'Unread',
        'read' => 'Read',
        'all' => 'All',
    ],
    'list' => [
        'title' => 'All notifications',
        'description' => 'Review your recent activity and updates.',
        'empty' => 'You have no notifications for this filter.',
    ],
    'pagination' => [
        'page' => 'Page',
    ],
    'preferences' => [
        'title' => 'Notification preferences',
        'description' => 'Choose which channels you want to receive for each notification type.',
        'actions' => [
            'save' => 'Save preferences',
        ],
    ],
    'channels' => [
        'database' => 'In-app',
        'mail' => 'Email',
        'slack' => 'Slack',
    ],
    'types' => [
        'security_important' => [
            'title' => 'Important security alerts',
            'description' => 'High priority security events that may require your attention.',
        ],
        'marketing_announcement' => [
            'title' => 'Product announcements',
            'description' => 'Occasional updates about new features and improvements.',
        ],
        'system_general' => [
            'title' => 'General updates',
            'description' => 'Routine system updates and account activity.',
        ],
    ],
    'toast' => [
        'preferences_saved' => 'Notification preferences updated.',
    ],
];
