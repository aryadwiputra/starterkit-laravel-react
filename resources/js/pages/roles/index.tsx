import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Shield, Trash2 } from 'lucide-react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import { Can } from '@/components/can';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-permission';
import { index as rolesIndex } from '@/routes/roles';
import { index as usersIndex } from '@/routes/users';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type RoleRow = {
    id: number;
    name: string;
    users_count: number;
    permissions_count: number;
    created_at: string;
};

type Props = {
    roles: PaginatedData<RoleRow>;
};

export default function RolesIndex({ roles }: Props) {
    const canEdit = useCan('role.edit');
    const canDelete = useCan('role.delete');

    const columns: DataTableColumn<RoleRow>[] = [
        {
            key: 'name',
            label: 'Role',
            sortable: true,
            render: (role) => (
                <div className="flex items-center gap-2">
                    <Badge variant={role.name === 'super-admin' ? 'default' : 'secondary'}>
                        {role.name}
                    </Badge>
                </div>
            ),
        },
        {
            key: 'users_count',
            label: 'Users',
            sortable: true,
        },
        {
            key: 'permissions_count',
            label: 'Permissions',
            sortable: true,
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
            render: (role) => (
                <span className="text-muted-foreground">
                    {new Date(role.created_at).toLocaleDateString()}
                </span>
            ),
        },
    ];

    const rowActions: RowAction<RoleRow>[] = [
        {
            key: 'edit',
            label: 'Edit',
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (role) => router.visit(RoleController.edit.url({ role: role.id })),
            visible: (role) => canEdit && role.name !== 'super-admin',
        },
        {
            key: 'delete',
            label: 'Delete',
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (role) => {
                if (confirm(`Delete role ${role.name}?`)) {
                    router.delete(RoleController.destroy.url({ role: role.id }));
                }
            },
            visible: (role) => canDelete && role.name !== 'super-admin',
        },
    ];

    return (
        <>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">Role Management</h1>
                            <p className="text-sm text-muted-foreground">
                                Create and manage roles and permissions.
                            </p>
                        </div>
                    </div>

                    <Can permission="role.create">
                        <Button onClick={() => router.visit(RoleController.create.url())}>
                            <Plus className="mr-1 h-4 w-4" />
                            Add Role
                        </Button>
                    </Can>
                </div>

                <DataTable
                    tableId="roles"
                    data={roles}
                    columns={columns}
                    rowActions={rowActions}
                    routePrefix={rolesIndex()}
                />
            </div>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        { title: 'User Management', href: usersIndex() },
        { title: 'Roles', href: rolesIndex() },
    ],
};
