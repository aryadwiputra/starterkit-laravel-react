<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * The permissions to create.
     *
     * @var array<string, list<string>>
     */
    private const PERMISSIONS = [
        'user' => ['view', 'create', 'edit', 'delete', 'impersonate'],
        'role' => ['view', 'create', 'edit', 'delete'],
    ];

    /**
     * The role-permission mapping.
     *
     * @var array<string, list<string>>
     */
    private const ROLE_PERMISSIONS = [
        'admin' => [
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',
            'role.view',
        ],
        'user' => [],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->createPermissions();
        $this->createRoles();
    }

    /**
     * Create all permissions.
     */
    private function createPermissions(): void
    {
        foreach (self::PERMISSIONS as $group => $actions) {
            foreach ($actions as $action) {
                Permission::findOrCreate("{$group}.{$action}");
            }
        }
    }

    /**
     * Create roles and assign permissions.
     */
    private function createRoles(): void
    {
        // Super admin gets all permissions via Gate::before
        Role::findOrCreate('super-admin');

        foreach (self::ROLE_PERMISSIONS as $roleName => $permissions) {
            $role = Role::findOrCreate($roleName);
            $role->syncPermissions($permissions);
        }
    }
}
