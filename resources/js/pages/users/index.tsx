import { Head, router } from '@inertiajs/react';
import { CircleCheck, CircleX, Eye, Pencil, Plus, Shield, Trash2, UserCog, Users } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { Can } from '@/components/can';
import { DataTable } from '@/components/data-table/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-permission';
import { useTranslation } from '@/hooks/use-translation';
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
    const { t } = useTranslation();

    const columns: DataTableColumn<UserRow>[] = [
        {
            key: 'name',
            label: t('common.name'),
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
            label: t('common.email'),
            sortable: true,
        },
        {
            key: 'roles',
            label: t('common.role'),
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
            label: t('common.status'),
            sortable: true,
            render: (user) => (
                <Badge variant={user.is_active ? 'default' : 'destructive'} className="gap-1">
                    {user.is_active ? (
                        <>
                            <CircleCheck className="h-3 w-3" /> {t('common.active')}
                        </>
                    ) : (
                        <>
                            <CircleX className="h-3 w-3" /> {t('common.inactive')}
                        </>
                    )}
                </Badge>
            ),
        },
        {
            key: 'created_at',
            label: t('common.created'),
            sortable: true,
            render: (user) => <span className="text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</span>,
        },
    ];

    const tableFilters: DataTableFilter[] = [
        {
            key: 'role',
            label: t('common.roles'),
            options: roles.map((role) => ({ label: role, value: role })),
        },
        {
            key: 'is_active',
            label: t('common.status'),
            options: [
                { label: t('common.active'), value: '1' },
                { label: t('common.inactive'), value: '0' },
            ],
        },
    ];

    const rowActions: RowAction<UserRow>[] = [
        {
            key: 'view',
            label: t('users.actions.view'),
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (user) => router.visit(UserController.show.url({ user: user.id })),
        },
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (user) => router.visit(UserController.edit.url({ user: user.id })),
            visible: () => canEdit,
        },
        {
            key: 'impersonate',
            label: t('users.actions.impersonate'),
            icon: <UserCog className="mr-2 h-4 w-4" />,
            onClick: (user) =>
                router.post(impersonateStart.url(user.id), {}, {}),
            visible: (user) => canImpersonate && !user.roles.some((r) => r.name === 'super-admin'),
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (user) => {
                if (confirm(t('users.actions.delete_confirm', { name: user.name }))) {
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
                      label: t('users.actions.activate'),
                      icon: <CircleCheck className="mr-1 h-4 w-4" />,
                  },
                  {
                      key: 'deactivate',
                      label: t('users.actions.deactivate'),
                      icon: <CircleX className="mr-1 h-4 w-4" />,
                  },
              ]
            : []),
        ...(canDelete
            ? [
                  {
                      key: 'delete',
                      label: t('common.delete'),
                      icon: <Trash2 className="mr-1 h-4 w-4" />,
                      variant: 'destructive' as const,
                      requireConfirm: true,
                      confirmMessage: t('users.actions.bulk_delete_confirm'),
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
            <Head title={t('users.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">{t('users.title')}</h1>
                            <p className="text-sm text-muted-foreground">{t('users.description')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Can permission="role.view">
                            <Button
                                variant="outline"
                                onClick={() => router.visit(rolesIndex())}
                            >
                                <Shield className="mr-1 h-4 w-4" />
                                {t('users.actions.manage_roles')}
                            </Button>
                        </Can>
                        <Can permission="user.create">
                            <Button onClick={() => router.visit(UserController.create.url())}>
                                <Plus className="mr-1 h-4 w-4" />
                                {t('users.actions.new')}
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
            title: 'users.title',
            href: usersIndex(),
        },
    ],
};
