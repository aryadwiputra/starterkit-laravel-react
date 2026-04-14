import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { index as rolesIndex } from '@/routes/roles';

type PermissionGroup = {
    group: string;
    permissions: { name: string; label: string }[];
};

type Role = {
    id: number;
    name: string;
    permissions: { id: number; name: string }[];
};

type Props = {
    role: Role;
    permission_groups: PermissionGroup[];
};

export default function EditRole({ role, permission_groups }: Props) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        role.permissions.map((permission) => permission.name),
    );
    const { t } = useTranslation();

    function togglePermission(permission: string, checked: boolean) {
        setSelectedPermissions((prev) =>
            checked ? [...new Set([...prev, permission])] : prev.filter((p) => p !== permission),
        );
    }

    return (
        <>
            <Head title={t('roles.edit.title', { name: role.name })} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title={t('roles.edit.title', { name: role.name })}
                    description={t('roles.edit.description')}
                />

                <Form
                    {...RoleController.update.form({ role: role.id })}
                    className="max-w-3xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('roles.edit.sections.details.title')}</CardTitle>
                                    <CardDescription>
                                        {t('roles.edit.sections.details.description')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">{t('common.name')}</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            defaultValue={role.name}
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('roles.edit.sections.permissions.title')}</CardTitle>
                                    <CardDescription>
                                        {t('roles.edit.sections.permissions.description')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {permission_groups.map((group) => (
                                        <div key={group.group} className="space-y-3">
                                            <p className="text-sm font-medium capitalize">
                                                {t(`roles.permissions.${group.group}`)}
                                            </p>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {group.permissions.map((permission) => (
                                                    <label
                                                        key={permission.name}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <Checkbox
                                                            checked={selectedPermissions.includes(permission.name)}
                                                            onCheckedChange={(checked) =>
                                                                togglePermission(permission.name, checked === true)
                                                            }
                                                        />
                                                        <span className="capitalize">
                                                            {permission.label.replaceAll('_', ' ')}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {selectedPermissions.map((permission) => (
                                        <input
                                            key={permission}
                                            type="hidden"
                                            name="permissions[]"
                                            value={permission}
                                        />
                                    ))}
                                    <InputError message={errors.permissions} />
                                </CardContent>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('roles.edit.submit')}</Button>
                                <Link href={rolesIndex()}>
                                    <Button type="button" variant="outline">
                                        {t('common.cancel')}
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EditRole.layout = {
    breadcrumbs: [
        { title: 'roles.title', href: rolesIndex() },
        { title: 'roles.edit.breadcrumb', href: '#' },
    ],
};
