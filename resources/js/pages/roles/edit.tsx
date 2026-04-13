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

    function togglePermission(permission: string, checked: boolean) {
        setSelectedPermissions((prev) =>
            checked ? [...new Set([...prev, permission])] : prev.filter((p) => p !== permission),
        );
    }

    return (
        <>
            <Head title={`Edit ${role.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title={`Edit Role: ${role.name}`}
                    description="Update role name and assigned permissions."
                />

                <Form
                    {...RoleController.update.form({ role: role.id })}
                    className="max-w-3xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Role details</CardTitle>
                                    <CardDescription>
                                        Update the role name.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
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
                                    <CardTitle>Permissions</CardTitle>
                                    <CardDescription>
                                        Adjust the capabilities available to this role.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {permission_groups.map((group) => (
                                        <div key={group.group} className="space-y-3">
                                            <p className="text-sm font-medium capitalize">
                                                {group.group}
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
                                <Button disabled={processing}>Update Role</Button>
                                <Link href={rolesIndex()}>
                                    <Button type="button" variant="outline">
                                        Cancel
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
        { title: 'Roles', href: rolesIndex() },
        { title: 'Edit Role', href: '#' },
    ],
};
