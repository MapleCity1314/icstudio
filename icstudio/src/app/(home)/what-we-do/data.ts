import { Code, Smartphone, Globe, PenTool, BarChart, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Service {
  id: number
  title: string
  description: string
  icon: LucideIcon
}

export const services: Service[] = [
  {
    id: 1,
    title: "网站开发",
    description: "我们使用最新技术和最佳实践构建响应式、高性能的网站和Web应用程序。",
    icon: Code,
  },
  {
    id: 2,
    title: "移动应用程序",
    description: "原生和跨平台移动应用程序，在所有设备上提供卓越的用户体验。",
    icon: Smartphone,
  },
  {
    id: 3,
    title: "数字营销",
    description: "战略性数字营销解决方案，提高您的在线存在并推动有意义的参与。",
    icon: Globe,
  },
  {
    id: 4,
    title: "UI/UX 设计",
    description: "以用户为中心的设计，平衡美学与功能，创造直观且引人入胜的界面。",
    icon: PenTool,
  },
  {
    id: 5,
    title: "数据分析",
    description: "将您的数据转化为可行的见解，推动业务增长并为战略决策提供信息。",
    icon: BarChart,
  },
  {
    id: 6,
    title: "网络安全",
    description: "通过全面的安全解决方案保护您的数字资产，防范不断发展的威胁。",
    icon: ShieldCheck,
  },
]
