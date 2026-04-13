import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ChevronDown, FolderGit2, LayoutGrid, Settings, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import { edit as editAppSettings } from '@/routes/app-settings';
import { index as featureFlagsIndex } from '@/routes/feature-flags';
import { edit as editMailSettings } from '@/routes/mail-settings';
import { index as settingsIndex } from '@/routes/settings';
import { index as usersIndex } from '@/routes/users';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { permissions } = usePage().props;
    const userPermissions = permissions as string[];
    const { isCurrentOrParentUrl } = useCurrentUrl();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(userPermissions.includes('user.view')
            ? [
                  {
                      title: 'User Management',
                      href: usersIndex(),
                      icon: Users,
                  },
              ]
            : []),
    ];

    const canManageApp = userPermissions.includes('settings.app.manage');
    const canManageMail = userPermissions.includes('settings.mail.manage');
    const canManageFlags = userPermissions.includes('settings.flags.manage');

    const settingsItems: NavItem[] = [
        ...(canManageApp ? [{ title: 'App', href: editAppSettings(), icon: null }] : []),
        ...(canManageMail ? [{ title: 'Mail', href: editMailSettings(), icon: null }] : []),
        ...(canManageFlags ? [{ title: 'Feature flags', href: featureFlagsIndex(), icon: null }] : []),
    ];

    const settingsActive =
        isCurrentOrParentUrl(settingsIndex()) ||
        settingsItems.some((item) => isCurrentOrParentUrl(item.href));

    const showSettings = canManageApp || canManageMail || canManageFlags;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {showSettings && (
                    <SidebarGroup className="px-2 py-0">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Collapsible defaultOpen={settingsActive}>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            isActive={settingsActive}
                                            tooltip={{ children: 'Settings' }}
                                            className="group"
                                        >
                                            <Settings />
                                            <span>Settings</span>
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {settingsItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isCurrentOrParentUrl(item.href)}
                                                    >
                                                        <Link href={item.href} prefetch>
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
