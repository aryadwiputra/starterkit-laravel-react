<?php

return [
    'actions' => [
        'back' => 'Go back',
        'dashboard' => 'Go to dashboard',
        'home' => 'Go to home',
        'reload' => 'Reload',
        'try_again' => 'Try again later',
    ],

    '403' => [
        'title' => 'Access denied',
        'description' => "You don't have permission to access this page.",
    ],
    '404' => [
        'title' => 'Page not found',
        'description' => "We couldn't find the page you were looking for.",
    ],
    '500' => [
        'title' => 'Something went wrong',
        'description' => 'An unexpected error occurred. Please try again.',
    ],
    '503' => [
        'title' => 'Service unavailable',
        'description' => 'The service is temporarily unavailable. Please try again later.',
    ],
];
