"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 检查权限
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // TODO: 验证token和获取用户信息
    // 临时模拟
    setUser({
      role: 'admin'
    });
  }, [router]);

  if (!user) {
    return null; // 或者显示加载状态
  }

  const menuItems = [
    {
      title: "仪表盘",
      icon: <LayoutDashboard className="w-4 h-4" />,
      href: "/admin",
      roles: ["admin", "team"],
    },
    {
      title: "用户管理",
      icon: <Users className="w-4 h-4" />,
      href: "/admin/users",
      roles: ["admin"],
    },
    {
      title: "系统设置",
      icon: <Settings className="w-4 h-4" />,
      href: "/admin/settings",
      roles: ["admin"],
    },
  ];

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-xl font-bold">管理系统</h1>
          </div>
          <ScrollArea className="flex-1">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) =>
                item.roles.includes(user.role) ? (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push(item.href)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Button>
                ) : null
              )}
            </nav>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}