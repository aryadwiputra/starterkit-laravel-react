<?php

return [
    'title' => 'Notifikasi',
    'description' => 'Tetap terhubung dengan hal-hal yang penting untuk Anda.',
    'bell' => [
        'title' => 'Notifikasi',
        'empty' => 'Belum ada notifikasi.',
    ],
    'actions' => [
        'mark_all_read' => 'Tandai semua sudah dibaca',
        'mark_read' => 'Tandai sudah dibaca',
        'view_all' => 'Semua notifikasi',
        'open' => 'Buka',
    ],
    'filters' => [
        'unread' => 'Belum dibaca',
        'read' => 'Sudah dibaca',
        'all' => 'Semua',
    ],
    'list' => [
        'title' => 'Semua notifikasi',
        'description' => 'Tinjau aktivitas dan pembaruan terbaru.',
        'empty' => 'Tidak ada notifikasi untuk filter ini.',
    ],
    'pagination' => [
        'page' => 'Halaman',
    ],
    'preferences' => [
        'title' => 'Preferensi notifikasi',
        'description' => 'Pilih channel yang ingin Anda terima untuk setiap tipe notifikasi.',
        'actions' => [
            'save' => 'Simpan preferensi',
        ],
    ],
    'channels' => [
        'database' => 'In-app',
        'mail' => 'Email',
        'slack' => 'Slack',
    ],
    'types' => [
        'security_important' => [
            'title' => 'Peringatan keamanan penting',
            'description' => 'Peristiwa keamanan prioritas tinggi yang mungkin butuh perhatian Anda.',
        ],
        'marketing_announcement' => [
            'title' => 'Pengumuman produk',
            'description' => 'Pembaruan sesekali tentang fitur dan peningkatan baru.',
        ],
        'system_general' => [
            'title' => 'Pembaruan umum',
            'description' => 'Pembaruan sistem rutin dan aktivitas akun.',
        ],
    ],
    'toast' => [
        'preferences_saved' => 'Preferensi notifikasi diperbarui.',
    ],
];
