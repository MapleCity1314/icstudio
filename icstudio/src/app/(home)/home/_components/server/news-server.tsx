// 模拟新闻数据类型
export interface NewsItem {
  id: string
  title: string
  date: string
  month: string
  day: string
  slug: string
  excerpt?: string
}

// 模拟数据
export const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    title: "HV MTL Forge Renderer",
    date: "MAR 28",
    month: "MAR",
    day: "28",
    slug: "hv-mtl-forge-renderer",
    excerpt: "使用Metal API开发的高性能渲染引擎，为创意项目提供卓越的视觉效果",
  },
  {
    id: "2",
    title: "The making of InsideKristallnacht",
    date: "NOV 16",
    month: "NOV",
    day: "16",
    slug: "the-making-of-insidekristallnacht",
    excerpt: "深入探讨我们最新沉浸式历史体验项目的开发过程和技术挑战",
  },
  {
    id: "3",
    title: "The making of Allô Papa Noël",
    date: "DEC 10",
    month: "DEC",
    day: "10",
    slug: "the-making-of-allo-papa-noel",
    excerpt: "圣诞节互动体验项目背后的创意与技术实现",
  },
  {
    id: "4",
    title: "WebGPU: 下一代网页图形技术",
    date: "JAN 15",
    month: "JAN",
    day: "15",
    slug: "webgpu-next-gen-web-graphics",
    excerpt: "探索WebGPU如何改变网页3D图形和计算的未来",
  },
]

// 使用Promise模拟服务器获取数据的延迟
export async function getNewsData(): Promise<NewsItem[]> {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => resolve(NEWS_DATA), 500);
  });
}
