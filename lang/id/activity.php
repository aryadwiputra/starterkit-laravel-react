<?php

return [
    'title' => 'Audit log',
    'description' => 'Lihat siapa mengubah apa dan kapan.',

    'columns' => [
        'description' => 'Deskripsi',
        'event' => 'Event',
        'log' => 'Log',
        'subject' => 'Subjek',
        'causer' => 'Pelaku',
        'created_at' => 'Waktu',
    ],

    'filters' => [
        'event' => 'Event',
        'log' => 'Log',
        'all' => 'Semua',
    ],

    'events' => [
        'created' => 'Dibuat',
        'updated' => 'Diubah',
        'deleted' => 'Dihapus',
    ],

    'actions' => [
        'details' => 'Lihat detail',
        'copy_json' => 'Salin JSON',
    ],

    'details' => [
        'title' => 'Detail aktivitas',
        'meta' => 'Rincian',
        'diff' => 'Perubahan',
        'key' => 'Field',
        'old' => 'Sebelum',
        'new' => 'Sesudah',
        'none' => 'Tidak ada perubahan yang tercatat.',
    ],
];
