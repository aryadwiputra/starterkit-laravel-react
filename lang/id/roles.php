<?php

return [
    'title' => 'Peran',
    'description' => 'Buat dan kelola peran serta izin.',
    'columns' => [
        'users' => 'Pengguna',
        'permissions' => 'Izin',
    ],
    'actions' => [
        'new' => 'Tambah Peran',
        'delete_confirm' => 'Hapus peran :name?',
    ],
    'create' => [
        'title' => 'Buat Peran',
        'description' => 'Definisikan peran baru dan tetapkan izin.',
        'sections' => [
            'details' => [
                'title' => 'Detail peran',
                'description' => 'Berikan nama yang jelas dan unik.',
            ],
            'permissions' => [
                'title' => 'Izin',
                'description' => 'Pilih kemampuan yang dapat diakses peran ini.',
            ],
        ],
        'name_placeholder' => 'manager',
        'submit' => 'Buat Peran',
    ],
    'edit' => [
        'title' => 'Edit Peran: :name',
        'description' => 'Perbarui nama peran dan izin yang ditetapkan.',
        'sections' => [
            'details' => [
                'title' => 'Detail peran',
                'description' => 'Perbarui nama peran.',
            ],
            'permissions' => [
                'title' => 'Izin',
                'description' => 'Sesuaikan kemampuan yang tersedia untuk peran ini.',
            ],
        ],
        'submit' => 'Perbarui Peran',
        'breadcrumb' => 'Edit Peran',
    ],
    'permissions' => [
        'user' => 'Pengguna',
        'role' => 'Peran',
        'settings' => 'Pengaturan',
    ],
    'toast' => [
        'created' => 'Peran berhasil dibuat.',
        'updated' => 'Peran berhasil diperbarui.',
        'deleted' => 'Peran berhasil dihapus.',
    ],
];
