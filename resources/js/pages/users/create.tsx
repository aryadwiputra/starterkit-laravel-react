import { Form, Head, Link } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { index as usersIndex } from '@/routes/users';

type Props = {
    roles: string[];
};

export default function CreateUser({ roles }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('users.create.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title={t('users.create.title')}
                    description={t('users.create.description')}
                />

                <Form
                    {...UserController.store.form()}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('common.name')}</Label>
                                <Input id="name" name="name" required autoComplete="name" placeholder={t('users.create.name_placeholder')} />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('common.email')}</Label>
                                <Input id="email" type="email" name="email" required autoComplete="email" placeholder={t('users.create.email_placeholder')} />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{t('common.password')}</Label>
                                <Input id="password" type="password" name="password" required autoComplete="new-password" placeholder={t('users.create.password_placeholder')} />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{t('common.confirm_password')}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    placeholder={t('users.create.confirm_password_placeholder')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">{t('common.role')}</Label>
                                <Select name="role" defaultValue="user">
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder={t('users.create.role_placeholder')} />
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
                                <Button disabled={processing}>{t('users.create.submit')}</Button>
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

CreateUser.layout = {
    breadcrumbs: [
        { title: 'users.title', href: usersIndex() },
        { title: 'users.create.title', href: UserController.create.url() },
    ],
};
