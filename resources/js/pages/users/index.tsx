import { Head, router } from '@inertiajs/react';
import { CircleCheck, CircleX, Eye, Pencil, Plus, Shield, Trash2, UserCog, Users } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { Can } from '@/components/can';
import { DataTable } from '@/components/data-table/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-permission';
import { start as impersonateStart } from '@/routes/impersonate';
import { index as rolesIndex } from '@/routes/roles';
import { index as usersIndex } from '@/routes/users';
import { bulkAction as usersBulkAction, exportMethod as usersExport } from '@/routes/users';
import type { DataTableColumn, DataTableFilter, PaginatedData, RowAction } from '@/types/datatable';

type UserRow = {
    id: number;
    name: string;
    email: string;
    avatar_path: string | null;
    is_active: boolean;
    created_at: string;
    roles: { id: number; name: string }[];
};

type Props = {
    users: PaginatedData<UserRow>;
    roles: string[];
};

export default function UsersIndex({ users, roles }: Props) {
    const canEdit = useCan('user.edit');
    const canDelete = useCan('user.delete');
    const canImpersonate = useCan('user.impersonate');

    const columns: DataTableColumn<UserRow>[] = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (user) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        {user.avatar_path && <AvatarImage src={`/storage/${user.avatar_path}`} alt={user.name} />}
                        <AvatarFallback className="text-xs">
                            {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.name}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
        },
        {
            key: 'roles',
            label: 'Role',
            sortable: false,
            render: (user) => (
                <div className="flex gap-1">
                    {user.roles.map((role) => (
                        <Badge key={role.id} variant={role.name === 'super-admin' ? 'default' : role.name === 'admin' ? 'secondary' : 'outline'}>
                            {role.name}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (user) => (
                <Badge variant={user.is_active ? 'default' : 'destructive'} className="gap-1">
                    {user.is_active ? (
                        <>
                            <CircleCheck className="h-3 w-3" /> Active
                        </>
                    ) : (
                        <>
                            <CircleX className="h-3 w-3" /> Inactive
                        </>
                    )}
                </Badge>
            ),
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
            render: (user) => <span className="text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</span>,
        },
    ];

    const tableFilters: DataTableFilter[] = [
        {
            key: 'role',
            label: 'Roles',
            options: roles.map((role) => ({ label: role, value: role })),
        },
        {
            key: 'is_active',
            label: 'Status',
            options: [
                { label: 'Active', value: '1' },
                { label: 'Inactive', value: '0' },
            ],
        },
    ];

    const rowActions: RowAction<UserRow>[] = [
        {
            key: 'view',
            label: 'View Details',
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (user) => router.visit(UserController.show.url({ user: user.id })),
        },
        {
            key: 'edit',
            label: 'Edit',
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (user) => router.visit(UserController.edit.url({ user: user.id })),
            visible: () => canEdit,
        },
        {
            key: 'impersonate',
            label: 'Impersonate',
            icon: <UserCog className="mr-2 h-4 w-4" />,
            onClick: (user) =>
                router.post(impersonateStart.url(user.id), {}, {}),
            visible: (user) => canImpersonate && !user.roles.some((r) => r.name === 'super-admin'),
        },
        {
            key: 'delete',
            label: 'Delete',
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (user) => {
                if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                    router.delete(UserController.destroy.url({ user: user.id }));
                }
            },
            visible: () => canDelete,
        },
    ];

    const bulkActions = [
        ...(canEdit
            ? [
                  {
                      key: 'activate',
                      label: 'Activate',
                      icon: <CircleCheck className="mr-1 h-4 w-4" />,
                  },
                  {
                      key: 'deactivate',
                      label: 'Deactivate',
                      icon: <CircleX className="mr-1 h-4 w-4" />,
                  },
              ]
            : []),
        ...(canDelete
            ? [
                  {
                      key: 'delete',
                      label: 'Delete',
                      icon: <Trash2 className="mr-1 h-4 w-4" />,
                      variant: 'destructive' as const,
                      requireConfirm: true,
                      confirmMessage: 'Are you sure you want to delete these users? This action uses soft delete.',
                  },
              ]
            : []),
    ];

    function handleBulkAction(action: string, ids: number[]) {
        router.post(
            usersBulkAction().url,
            { action, user_ids: ids },
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="User Management" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">User Management</h1>
                            <p className="text-sm text-muted-foreground">Manage user accounts, roles, and permissions</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Can permission="role.view">
                            <Button
                                variant="outline"
                                onClick={() => router.visit(rolesIndex())}
                            >
                                <Shield className="mr-1 h-4 w-4" />
                                Manage Roles
                            </Button>
                        </Can>
                        <Can permission="user.create">
                            <Button onClick={() => router.visit(UserController.create.url())}>
                                <Plus className="mr-1 h-4 w-4" />
                                Add User
                            </Button>
                        </Can>
                    </div>
                </div>

                <DataTable
                    tableId="users"
                    data={users}
                    columns={columns}
                    filters={tableFilters}
                    bulkActions={bulkActions}
                    rowActions={rowActions}
                    searchable
                    exportable
                    exportUrl={usersExport().url}
                    routePrefix={usersIndex().url}
                    onBulkAction={handleBulkAction}
                />
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'User Management',
            href: usersIndex(),
        },
    ],
};
