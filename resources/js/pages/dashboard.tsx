import { Head, usePage } from '@inertiajs/react';
import { Users, LayoutGrid, MessageSquare, Briefcase } from 'lucide-react';
import { RecentActivity  } from '@/components/dashboard/recent-activity';
import type {ActivityItem} from '@/components/dashboard/recent-activity';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const { t } = useTranslation();
    const userName = auth?.user?.name || t('dashboard.user_fallback');

    const mockActivities: ActivityItem[] = [
        { id: 1, user: 'Sarah Jenkins', action: t('dashboard.activity.created_template'), target: t('dashboard.activity.welcome_message'), time: t('dashboard.activity.time_10m') },
        { id: 2, user: 'Michael Chen', action: t('dashboard.activity.updated_department'), target: t('dashboard.activity.engineering'), time: t('dashboard.activity.time_1h') },
        { id: 3, user: 'Alex Rivera', action: t('dashboard.activity.logged_in'), time: t('dashboard.activity.time_2h') },
        { id: 4, user: 'Emily Davis', action: t('dashboard.activity.deleted_template'), target: t('dashboard.activity.holiday_promo'), time: t('dashboard.activity.time_yesterday') },
    ];

    return (
        <>
            <Head title={t('dashboard.title')} />
            <div className="flex h-full flex-1 flex-col gap-8 md:p-8 p-4 max-w-[1280px] mx-auto w-full">
                
                {/* Welcome Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border rounded-xl p-8 transition-all hover:border-black/20 dark:hover:border-white/20">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                            {t('dashboard.welcome_back', { name: userName })}
                        </h1>
                        <p className="text-muted-foreground max-w-2xl text-lg relative z-10">
                            {t('dashboard.welcome_description')}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">{t('dashboard.actions.view_reports')}</Button>
                        <Button>{t('dashboard.actions.create_template')}</Button>
                    </div>
                </div>

                {/* Metric Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title={t('dashboard.stats.total_users')}
                        value="1,248" 
                        icon={<Users className="size-5" />} 
                        trend={{ value: 12, isPositive: true }} 
                    />
                    <StatCard 
                        title={t('dashboard.stats.active_teams')}
                        value="24" 
                        icon={<Briefcase className="size-5" />} 
                        trend={{ value: 2, isPositive: true }} 
                    />
                    <StatCard 
                        title={t('dashboard.stats.messages_sent')}
                        value="8,590" 
                        icon={<MessageSquare className="size-5" />} 
                        trend={{ value: 5.4, isPositive: true }} 
                    />
                    <StatCard 
                        title={t('dashboard.stats.system_uptime')}
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
                            <h3 className="text-xl font-medium text-foreground mb-4">{t('dashboard.quick_actions')}</h3>
                            <div className="flex flex-col gap-3">
                                <Button variant="outline" className="justify-start">{t('dashboard.actions.manage_users')}</Button>
                                <Button variant="outline" className="justify-start">{t('dashboard.actions.message_templates')}</Button>
                                <Button variant="outline" className="justify-start">{t('dashboard.actions.department_settings')}</Button>
                                <Button variant="outline" className="justify-start">{t('dashboard.actions.system_logs')}</Button>
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
            title: 'dashboard.title',
            href: dashboard(),
        },
    ],
};
