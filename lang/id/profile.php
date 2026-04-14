<?php

return [
    'title' => 'Profil',
    'description' => 'Kelola detail pribadi dan keamanan akun Anda.',
    'fields' => [
        'avatar' => 'Avatar',
        'avatar_help' => 'Klik avatar untuk mengunggah foto baru.',
        'avatar_help_2' => 'JPG, PNG, atau WebP. Maks 2MB.',
        'name_placeholder' => 'Nama lengkap',
        'email_placeholder' => 'Alamat email',
        'current_password' => 'Kata sandi saat ini',
        'new_password' => 'Kata sandi baru',
        'confirm_password' => 'Konfirmasi kata sandi',
    ],
    'email_unverified' => 'Alamat email Anda belum diverifikasi.',
    'resend_verification' => 'Klik di sini untuk mengirim ulang email verifikasi.',
    'verification_sent' => 'Tautan verifikasi baru telah dikirim ke email Anda.',
    'sections' => [
        'personal' => [
            'title' => 'Detail pribadi',
            'description' => 'Perbarui nama, email, dan avatar Anda.',
        ],
        'security' => [
            'title' => 'Keamanan',
            'description' => 'Perkuat akun dengan kata sandi kuat dan 2FA.',
        ],
        'password' => [
            'title' => 'Perbarui kata sandi',
            'description' => 'Gunakan kata sandi yang panjang dan unik.',
        ],
        'two_factor' => [
            'title' => 'Autentikasi dua faktor',
            'description' => 'Tambahkan lapisan keamanan kedua pada akun Anda.',
            'enabled_help' => 'Anda akan diminta PIN aman saat login dari aplikasi autentikator.',
            'disabled_help' => 'Saat 2FA aktif, Anda akan diminta PIN aman saat login.',
        ],
    ],
    'actions' => [
        'save_password' => 'Simpan kata sandi',
        'enable_2fa' => 'Aktifkan 2FA',
        'disable_2fa' => 'Nonaktifkan 2FA',
        'continue_setup' => 'Lanjutkan pengaturan',
    ],
    'delete' => [
        'title' => 'Hapus akun',
        'description' => 'Hapus akun dan semua sumber dayanya',
        'warning_title' => 'Peringatan',
        'warning_description' => 'Harap berhati-hati, tindakan ini tidak bisa dibatalkan.',
        'action' => 'Hapus akun',
        'confirm_title' => 'Yakin ingin menghapus akun Anda?',
        'confirm_description' => 'Setelah dihapus, semua data akan terhapus permanen. Masukkan kata sandi untuk konfirmasi.',
    ],
    'two_factor' => [
        'manual_code' => 'atau masukkan kode secara manual',
        'enabled_title' => 'Autentikasi dua faktor aktif',
        'enabled_description' => '2FA aktif. Pindai QR code atau masukkan kunci di aplikasi autentikator.',
        'verify_title' => 'Verifikasi kode autentikasi',
        'verify_description' => 'Masukkan kode 6 digit dari aplikasi autentikator.',
        'enable_title' => 'Aktifkan autentikasi dua faktor',
        'enable_description' => 'Untuk menyelesaikan, pindai QR code atau masukkan kunci di aplikasi autentikator.',
        'recovery_title' => 'Kode pemulihan 2FA',
        'recovery_description' => 'Kode pemulihan membantu masuk jika kehilangan perangkat 2FA.',
        'hide_recovery' => 'Sembunyikan kode',
        'view_recovery' => 'Lihat kode',
        'regenerate' => 'Buat ulang kode',
        'loading' => 'Memuat kode pemulihan',
        'recovery_help' => 'Setiap kode hanya bisa digunakan sekali dan akan dihapus setelah digunakan. Klik Buat ulang kode jika perlu.',
    ],
    'toast' => [
        'updated' => 'Profil diperbarui.',
        'password_updated' => 'Kata sandi diperbarui.',
    ],
];
