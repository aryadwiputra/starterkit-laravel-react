<?php

return [
    'rate_limits' => [
        'api' => [
            'guest_per_minute' => 60,
            'user_per_minute' => 120,
        ],

        'auth' => [
            'guest_per_minute' => 10,
            'user_per_minute' => 20,
        ],
    ],
];
