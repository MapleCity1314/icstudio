import { 
  LayoutDashboard, 
  Users, 
  Settings,
  FileText,
  Mail,
  UserPlus,
  Home
} from "lucide-react"

export const adminMenuItems = [
  {
    title: "仪表盘",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "用户管理",
    href: "/admin/users",
    icon: Users
  },
  {
    title: "内容管理",
    href: "/admin/content",
    icon: FileText
  },
  {
    title: "消息中心",
    href: "/admin/messages",
    icon: Mail
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings
  },
  {
    title: "团队邀请",
    href: "/admin/invite",
    icon: UserPlus,
    role: "admin"
  },
  {
    title: "返回首页",
    href: "/home",
    icon: Home
  }
] 