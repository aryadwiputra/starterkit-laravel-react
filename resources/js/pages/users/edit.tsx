import { Form, Head, Link } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { index as usersIndex } from '@/routes/users';
import type { User } from '@/types';

type Props = {
    user: User;
    roles: string[];
};

export default function EditUser({ user, roles }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('users.edit.title', { name: user.name })} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title={t('users.edit.title', { name: user.name })}
                    description={t('users.edit.description')}
                />

                <Form
                    {...UserController.update.form({ user: user.id })}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('common.name')}</Label>
                                <Input id="name" name="name" defaultValue={user.name} required autoComplete="name" placeholder={t('users.edit.name_placeholder')} />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('common.email')}</Label>
                                <Input id="email" type="email" name="email" defaultValue={user.email} required autoComplete="email" placeholder={t('users.edit.email_placeholder')} />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{t('users.edit.password')}</Label>
                                <Input id="password" type="password" name="password" autoComplete="new-password" placeholder={t('users.edit.password_placeholder')} />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{t('common.confirm_password')}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    placeholder={t('users.edit.confirm_password_placeholder')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">{t('common.role')}</Label>
                                <Select name="role" defaultValue={user.roles?.[0]?.name || 'user'}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder={t('users.edit.role_placeholder')} />
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
                                <Label htmlFor="is_active">{t('common.active')}</Label>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('users.edit.submit')}</Button>
                                <Link href={usersIndex()}>
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

EditUser.layout = {
    breadcrumbs: [
        { title: 'users.title', href: usersIndex() },
        { title: 'users.edit.breadcrumb', href: '#' },
    ],
};
