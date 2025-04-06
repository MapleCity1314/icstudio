import { DocumentIcon } from "@heroicons/react/24/outline";
import { Home, LayoutDashboard, Mail, User } from "lucide-react";

export const teamMenuItems = [
      {
            title: "仪表盘",
            href: "/team",
            icon: LayoutDashboard,
      },
      {
            title: "消息中心",
            href: "/team/message",
            icon: Mail,
      },
      {
            title: "文档管理",
            href: "/team/document",
            icon: DocumentIcon,
      },
      {
            title: "AI平台",
            href: "/team/ai",
            icon: User,
      },
      {
            title: "返回首页",
            href: "/home",
            icon: Home,
      },
];
