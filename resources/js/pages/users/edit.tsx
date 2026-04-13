import { Form, Head, Link } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as usersIndex } from '@/routes/users';
import type { User } from '@/types';

type Props = {
    user: User;
    roles: string[];
};

export default function EditUser({ user, roles }: Props) {
    return (
        <>
            <Head title={`Edit ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading variant="small" title={`Edit User: ${user.name}`} description="Update user information and role" />

                <Form
                    {...UserController.update.form({ user: user.id })}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={user.name} required autoComplete="name" placeholder="Full name" />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" name="email" defaultValue={user.email} required autoComplete="email" placeholder="Email" />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password (leave blank to keep current)</Label>
                                <Input id="password" type="password" name="password" autoComplete="new-password" placeholder="New password" />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select name="role" defaultValue={user.roles?.[0]?.name || 'user'}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox id="is_active" name="is_active" defaultChecked={user.is_active} value="1" />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Update User</Button>
                                <Link href={usersIndex()}>
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

EditUser.layout = {
    breadcrumbs: [
        { title: 'User Management', href: usersIndex() },
        { title: 'Edit User', href: '#' },
    ],
};
