'use client';

import { LayoutDashboard, User, Settings, LogOut } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const links = [
    {
      label: "仪表盘",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "个人资料",
      href: "/admin/profile",
      icon: <User className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "设置",
      href: "/admin/settings", 
      icon: <Settings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "退出",
      href: "/admin/logout",
      icon: <LogOut className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar>
        <SidebarBody>
          <div className="mb-6 h-full">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">管理后台</h2>
          </div>
          <div className="space-y-2">
            {links.map((link) => (
              <SidebarLink key={link.href} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>

      {/* 主内容区 */}
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
