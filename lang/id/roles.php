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
    'permission_labels' => [
        'user.view' => 'Lihat pengguna',
        'user.create' => 'Buat pengguna',
        'user.edit' => 'Edit pengguna',
        'user.delete' => 'Hapus pengguna',
        'user.impersonate' => 'Impersonasi pengguna',
        'role.view' => 'Lihat peran',
        'role.create' => 'Buat peran',
        'role.edit' => 'Edit peran',
        'role.delete' => 'Hapus peran',
        'settings.app.manage' => 'Kelola pengaturan aplikasi',
        'settings.mail.manage' => 'Kelola pengaturan email',
        'settings.flags.manage' => 'Kelola feature flags',
    ],
    'toast' => [
        'created' => 'Peran berhasil dibuat.',
        'updated' => 'Peran berhasil diperbarui.',
        'deleted' => 'Peran berhasil dihapus.',
    ],
];
