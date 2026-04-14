<?php

return [
    'title' => 'Roles',
    'description' => 'Create and manage roles and permissions.',
    'columns' => [
        'users' => 'Users',
        'permissions' => 'Permissions',
    ],
    'actions' => [
        'new' => 'Add Role',
        'delete_confirm' => 'Delete role :name?',
    ],
    'create' => [
        'title' => 'Create Role',
        'description' => 'Define a new role and assign permissions.',
        'sections' => [
            'details' => [
                'title' => 'Role details',
                'description' => 'Give the role a clear, unique name.',
            ],
            'permissions' => [
                'title' => 'Permissions',
                'description' => 'Select the capabilities this role can access.',
            ],
        ],
        'name_placeholder' => 'manager',
        'submit' => 'Create Role',
    ],
    'edit' => [
        'title' => 'Edit Role: :name',
        'description' => 'Update role name and assigned permissions.',
        'sections' => [
            'details' => [
                'title' => 'Role details',
                'description' => 'Update the role name.',
            ],
            'permissions' => [
                'title' => 'Permissions',
                'description' => 'Adjust the capabilities available to this role.',
            ],
        ],
        'submit' => 'Update Role',
        'breadcrumb' => 'Edit Role',
    ],
    'permissions' => [
        'user' => 'User',
        'role' => 'Role',
        'settings' => 'Settings',
    ],
    'permission_labels' => [
        'user.view' => 'View users',
        'user.create' => 'Create users',
        'user.edit' => 'Edit users',
        'user.delete' => 'Delete users',
        'user.impersonate' => 'Impersonate users',
        'role.view' => 'View roles',
        'role.create' => 'Create roles',
        'role.edit' => 'Edit roles',
        'role.delete' => 'Delete roles',
        'settings.app.manage' => 'Manage app settings',
        'settings.mail.manage' => 'Manage mail settings',
        'settings.flags.manage' => 'Manage feature flags',
    ],
    'toast' => [
        'created' => 'Role created successfully.',
        'updated' => 'Role updated successfully.',
        'deleted' => 'Role deleted successfully.',
    ],
];
