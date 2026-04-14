<?php

return [
    'title' => 'Audit log',
    'description' => 'Review who changed what and when.',

    'columns' => [
        'description' => 'Description',
        'event' => 'Event',
        'log' => 'Log',
        'subject' => 'Subject',
        'causer' => 'Actor',
        'created_at' => 'Time',
    ],

    'filters' => [
        'event' => 'Event',
        'log' => 'Log',
        'all' => 'All',
    ],

    'events' => [
        'created' => 'Created',
        'updated' => 'Updated',
        'deleted' => 'Deleted',
    ],

    'actions' => [
        'details' => 'View details',
        'copy_json' => 'Copy JSON',
    ],

    'details' => [
        'title' => 'Activity details',
        'meta' => 'Details',
        'diff' => 'Changes',
        'key' => 'Field',
        'old' => 'Before',
        'new' => 'After',
        'none' => 'No changes recorded.',
    ],
];
