export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    title: "产品",
    href: "/products",
    children: [
      {
        title: "产品一",
        href: "/products/product-1",
      },
      {
        title: "产品二",
        href: "/products/product-2",
      },
    ],
  },
  {
    title: "服务",
    href: "/services",
    children: [
      {
        title: "服务一",
        href: "/services/service-1",
      },
      {
        title: "服务二",
        href: "/services/service-2",
      },
    ],
  },
  {
    title: "发展历程",
    href: "/history",
  },
  {
    title: "联系我们",
    href: "/contact",
  },
]; 