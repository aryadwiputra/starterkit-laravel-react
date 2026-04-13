import { Head } from '@inertiajs/react';
import { Activity, CalendarDays, Mail, Shield, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { index as usersIndex } from '@/routes/users';
import type { User } from '@/types';

type ActivityItem = {
    id: number;
    description: string;
    event: string | null;
    subject_type: string | null;
    causer_type: string | null;
    properties: Record<string, unknown>;
    created_at: string;
};

type Props = {
    user: User;
    activities: ActivityItem[];
};

export default function ShowUser({ user, activities }: Props) {
    return (
        <>
            <Head title={user.name} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="text-center">
                            <Avatar className="mx-auto h-20 w-20">
                                {user.avatar_path && <AvatarImage src={`/storage/${user.avatar_path}`} alt={user.name} />}
                                <AvatarFallback className="text-xl">
                                    {user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="mt-4">{user.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <div className="flex gap-1">
                                    {user.roles?.map((role) => (
                                        <Badge key={role.id} variant={role.name === 'super-admin' ? 'default' : 'secondary'}>
                                            {role.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <UserCog className="h-4 w-4 text-muted-foreground" />
                                <Badge variant={user.is_active ? 'default' : 'destructive'}>{user.is_active ? 'Active' : 'Inactive'}</Badge>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Log */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Activity Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activities.length === 0 ? (
                                <p className="py-8 text-center text-muted-foreground">No activity recorded yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {activities.map((activity) => (
                                        <div key={activity.id}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{activity.description}</p>
                                                    {activity.properties && Object.keys(activity.properties).length > 0 && (
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {JSON.stringify(activity.properties)}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="shrink-0 text-xs text-muted-foreground">
                                                    {new Date(activity.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <Separator className="mt-3" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

ShowUser.layout = {
    breadcrumbs: [
        { title: 'User Management', href: usersIndex() },
        { title: 'User Details', href: '#' },
    ],
};
