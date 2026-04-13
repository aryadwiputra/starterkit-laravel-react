import { Form, Head, Link } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as usersIndex } from '@/routes/users';

type Props = {
    roles: string[];
};

export default function CreateUser({ roles }: Props) {
    return (
        <>
            <Head title="Create User" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading variant="small" title="Create New User" description="Add a new user to the system" />

                <Form
                    {...UserController.store.form()}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" required autoComplete="name" placeholder="Full name" />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" name="email" required autoComplete="email" placeholder="Email address" />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" name="password" required autoComplete="new-password" placeholder="Password" />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select name="role" defaultValue="user">
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

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Create User</Button>
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

CreateUser.layout = {
    breadcrumbs: [
        { title: 'User Management', href: usersIndex() },
        { title: 'Create User', href: UserController.create.url() },
    ],
};
