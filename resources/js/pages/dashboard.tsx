import { Head, usePage } from '@inertiajs/react';
import { Users, LayoutGrid, MessageSquare, Briefcase } from 'lucide-react';
import { RecentActivity  } from '@/components/dashboard/recent-activity';
import type {ActivityItem} from '@/components/dashboard/recent-activity';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const userName = auth?.user?.name || 'Admin';

    const mockActivities: ActivityItem[] = [
        { id: 1, user: 'Sarah Jenkins', action: 'created a new template', target: 'Welcome Message', time: '10 minutes ago' },
        { id: 2, user: 'Michael Chen', action: 'updated department', target: 'Engineering', time: '1 hour ago' },
        { id: 3, user: 'Alex Rivera', action: 'logged in', time: '2 hours ago' },
        { id: 4, user: 'Emily Davis', action: 'deleted template', target: 'Holiday Promo', time: 'Yesterday' },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 md:p-8 p-4 max-w-[1280px] mx-auto w-full">
                
                {/* Welcome Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border rounded-xl p-8 transition-all hover:border-black/20 dark:hover:border-white/20">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                            Welcome back, {userName}
                        </h1>
                        <p className="text-muted-foreground max-w-2xl text-lg relative z-10">
                            Here's what's happening in your workspace today. You have several pending tasks and recent activities to review.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">View Reports</Button>
                        <Button>Create Template</Button>
                    </div>
                </div>

                {/* Metric Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="Total Users" 
                        value="1,248" 
                        icon={<Users className="size-5" />} 
                        trend={{ value: 12, isPositive: true }} 
                    />
                    <StatCard 
                        title="Active Teams" 
                        value="24" 
                        icon={<Briefcase className="size-5" />} 
                        trend={{ value: 2, isPositive: true }} 
                    />
                    <StatCard 
                        title="Messages Sent" 
                        value="8,590" 
                        icon={<MessageSquare className="size-5" />} 
                        trend={{ value: 5.4, isPositive: true }} 
                    />
                    <StatCard 
                        title="System Uptime" 
                        value="99.9%" 
                        icon={<LayoutGrid className="size-5" />} 
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                        <RecentActivity items={mockActivities} />
                    </div>
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        <div className="bg-card border border-border rounded-xl p-6 transition-all hover:border-black/20 dark:hover:border-white/20">
                            <h3 className="text-xl font-medium text-foreground mb-4">Quick Actions</h3>
                            <div className="flex flex-col gap-3">
                                <Button variant="outline" className="justify-start">Manage Users</Button>
                                <Button variant="outline" className="justify-start">Message Templates</Button>
                                <Button variant="outline" className="justify-start">Department Settings</Button>
                                <Button variant="outline" className="justify-start">System Logs</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
