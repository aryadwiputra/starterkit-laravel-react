import { Form, Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import FeatureFlagsController from '@/actions/App/Http/Controllers/Settings/FeatureFlagsController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index as featureFlagsIndex } from '@/routes/feature-flags';

type Flag = {
    id: number;
    key: string;
    description: string | null;
    enabled: boolean;
    environments: string[] | null;
    roles: string[];
    users: { id: number; name: string; email: string }[];
};

type Props = {
    flags: Flag[];
    roles: string[];
};

const environmentOptions = ['local', 'staging', 'production'];

export default function FeatureFlags({ flags, roles }: Props) {
    const [editingFlagId, setEditingFlagId] = useState<number | null>(null);

    const editingFlag = useMemo(
        () => flags.find((f) => f.id === editingFlagId) ?? null,
        [flags, editingFlagId],
    );

    const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>(
        [],
    );
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<
        { id: number; name: string; email: string }[]
    >([]);

    const [userSearch, setUserSearch] = useState('');
    const [userResults, setUserResults] = useState<
        { id: number; name: string; email: string }[]
    >([]);

    useEffect(() => {
        if (!editingFlag) {
            setSelectedEnvironments([]);
            setSelectedRoles([]);
            setSelectedUsers([]);

            return;
        }

        setSelectedEnvironments(editingFlag.environments ?? []);
        setSelectedRoles(editingFlag.roles ?? []);
        setSelectedUsers(editingFlag.users ?? []);
    }, [editingFlag]);

    useEffect(() => {
        const controller = new AbortController();

        const timeout = setTimeout(async () => {
            if (userSearch.trim().length < 2) {
                setUserResults([]);

                return;
            }

            try {
                const url = FeatureFlagsController.users.url({
                    query: { search: userSearch.trim() },
                });
                const response = await fetch(url, { signal: controller.signal });

                if (!response.ok) {
                    return;
                }

                const json = (await response.json()) as {
                    id: number;
                    name: string;
                    email: string;
                }[];

                setUserResults(json);
            } catch {
                //
            }
        }, 250);

        return () => {
            controller.abort();
            clearTimeout(timeout);
        };
    }, [userSearch]);

    function toggleEnv(env: string, checked: boolean) {
        setSelectedEnvironments((prev) =>
            checked ? [...new Set([...prev, env])] : prev.filter((e) => e !== env),
        );
    }

    function toggleRole(role: string, checked: boolean) {
        setSelectedRoles((prev) =>
            checked ? [...new Set([...prev, role])] : prev.filter((r) => r !== role),
        );
    }

    function addUser(user: { id: number; name: string; email: string }) {
        setSelectedUsers((prev) =>
            prev.some((u) => u.id === user.id) ? prev : [...prev, user],
        );
    }

    function removeUser(id: number) {
        setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
    }

    function startCreate() {
        setEditingFlagId(null);
        setSelectedEnvironments([]);
        setSelectedRoles([]);
        setSelectedUsers([]);
        setUserSearch('');
        setUserResults([]);
    }

    return (
        <>
            <Head title="Feature flags" />

            <h1 className="sr-only">Feature flags</h1>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title="Feature flags"
                        description="Control feature rollout by environment or audience."
                    />
                    <Button variant="outline" onClick={startCreate}>
                        New flag
                    </Button>
                </div>

                <Form
                    {...(editingFlag
                        ? FeatureFlagsController.update.form({
                              featureFlag: editingFlag.id,
                          })
                        : FeatureFlagsController.store.form())}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {editingFlag ? 'Edit feature flag' : 'Create feature flag'}
                                </CardTitle>
                                <CardDescription>
                                    Define the flag and choose who can access it.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="key">Key</Label>
                                    <Input
                                        id="key"
                                        name="key"
                                        defaultValue={editingFlag?.key || ''}
                                        placeholder="new_feature"
                                        required
                                    />
                                    <InputError message={errors.key} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        defaultValue={editingFlag?.description || ''}
                                        placeholder="Optional"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="enabled"
                                        name="enabled"
                                        value="1"
                                        defaultChecked={editingFlag?.enabled || false}
                                    />
                                    <Label htmlFor="enabled">Enabled</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label>Environments (optional)</Label>
                                    <div className="flex flex-wrap gap-4">
                                        {environmentOptions.map((env) => (
                                            <label
                                                key={env}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <Checkbox
                                                    checked={selectedEnvironments.includes(env)}
                                                    onCheckedChange={(checked) =>
                                                        toggleEnv(env, checked === true)
                                                    }
                                                />
                                                <span>{env}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {selectedEnvironments.map((env) => (
                                        <input key={env} type="hidden" name="environments[]" value={env} />
                                    ))}
                                    <InputError message={errors.environments} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Roles (optional)</Label>
                                    <div className="flex flex-wrap gap-4">
                                        {roles.map((role) => (
                                            <label
                                                key={role}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <Checkbox
                                                    checked={selectedRoles.includes(role)}
                                                    onCheckedChange={(checked) =>
                                                        toggleRole(role, checked === true)
                                                    }
                                                />
                                                <span>{role}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {selectedRoles.map((role) => (
                                        <input key={role} type="hidden" name="roles[]" value={role} />
                                    ))}
                                    <InputError message={errors.roles} />
                                </div>

                                <div className="space-y-3">
                                    <Label>Users (optional)</Label>

                                    <Input
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        placeholder="Search users by name or email..."
                                    />

                                    {userResults.length > 0 && (
                                        <div className="max-h-48 overflow-auto rounded-md border">
                                            {userResults.map((u) => (
                                                <button
                                                    type="button"
                                                    key={u.id}
                                                    className="flex w-full items-start justify-between gap-4 px-3 py-2 text-left text-sm hover:bg-muted"
                                                    onClick={() => addUser(u)}
                                                >
                                                    <span>
                                                        <span className="font-medium">{u.name}</span>
                                                        <span className="block text-xs text-muted-foreground">
                                                            {u.email}
                                                        </span>
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Add
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {selectedUsers.length > 0 && (
                                        <div className="space-y-2">
                                            {selectedUsers.map((u) => (
                                                <div
                                                    key={u.id}
                                                    className="flex items-center justify-between gap-4 rounded-md border px-3 py-2 text-sm"
                                                >
                                                    <span>
                                                        <span className="font-medium">{u.name}</span>{' '}
                                                        <span className="text-muted-foreground">
                                                            ({u.email})
                                                        </span>
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => removeUser(u.id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                    <input type="hidden" name="users[]" value={u.id} />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <InputError message={errors.users} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button disabled={processing}>
                                        {editingFlag ? 'Update flag' : 'Create flag'}
                                    </Button>
                                    {editingFlag && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={startCreate}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </Form>

                <Card>
                    <CardHeader>
                        <CardTitle>Existing flags</CardTitle>
                        <CardDescription>
                            Review and maintain current feature toggles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {flags.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No feature flags yet.
                            </p>
                        ) : (
                            flags.map((flag) => (
                                <div
                                    key={flag.id}
                                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <span className="truncate font-medium">
                                                {flag.key}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {flag.enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                        {flag.description && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {flag.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingFlagId(flag.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                                if (confirm('Delete this feature flag?')) {
                                                    router.delete(
                                                        FeatureFlagsController.destroy.url({
                                                            featureFlag: flag.id,
                                                        }),
                                                        { preserveScroll: true },
                                                    );
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

FeatureFlags.layout = {
    breadcrumbs: [
        {
            title: 'Feature flags',
            href: featureFlagsIndex(),
        },
    ],
};
