import type { NewsItem } from "@/types/news"

// 扩展模拟数据
const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "HV MTL Forge Renderer",
    date: "MAR 28",
    month: "MAR",
    day: "28",
    slug: "hv-mtl-forge-renderer",
    excerpt: "使用Metal API开发的高性能渲染引擎，为创意项目提供卓越的视觉效果",
    category: "technology",
    readTime: "5分钟阅读",
    image: "/news/futuristic-city-render.png",
    content:
      "使用Metal API开发的高性能渲染引擎，为创意项目提供卓越的视觉效果。本文详细介绍了该渲染引擎的技术架构和性能优势。",
  },
  {
    id: "2",
    title: "The making of InsideKristallnacht",
    date: "NOV 16",
    month: "NOV",
    day: "16",
    slug: "the-making-of-insidekristallnacht",
    excerpt: "深入探讨我们最新沉浸式历史体验项目的开发过程和技术挑战",
    category: "projects",
    readTime: "8分钟阅读",
    image: "/news/ancient-marketplace-immersion.png",
    content:
      "深入探讨我们最新沉浸式历史体验项目的开发过程和技术挑战。本文分享了团队如何克服技术难题，创造出引人入胜的历史体验。",
  },
  {
    id: "3",
    title: "The making of Allô Papa Noël",
    date: "DEC 10",
    month: "DEC",
    day: "10",
    slug: "the-making-of-allo-papa-noel",
    excerpt: "圣诞节互动体验项目背后的创意与技术实现",
    category: "projects",
    readTime: "6分钟阅读",
    image: "/news/festive-market-fun.png",
    content: "圣诞节互动体验项目背后的创意与技术实现。本文揭示了如何将节日氛围与先进技术相结合，打造难忘的用户体验。",
  },
  {
    id: "4",
    title: "WebGPU: 下一代网页图形技术",
    date: "JAN 15",
    month: "JAN",
    day: "15",
    slug: "webgpu-next-gen-web-graphics",
    excerpt: "探索WebGPU如何改变网页3D图形和计算的未来",
    category: "technology",
    readTime: "7分钟阅读",
    image: "/news/abstract-webgpu-circuitry.png",
    content: "探索WebGPU如何改变网页3D图形和计算的未来。本文深入分析了WebGPU的技术优势及其对网页应用开发的影响。",
  },
  {
    id: "5",
    title: "IC Studio宣布新一轮融资",
    date: "FEB 20",
    month: "FEB",
    day: "20",
    slug: "ic-studio-announces-new-funding",
    excerpt: "IC Studio完成A轮融资，将加速创新技术研发和市场扩张",
    category: "company",
    readTime: "4分钟阅读",
    image: "/news/business-growth-funding.png",
    content: "IC Studio完成A轮融资，将加速创新技术研发和市场扩张。本轮融资将用于扩大研发团队和开拓新的市场机会。",
  },
  {
    id: "6",
    title: "元宇宙技术发展趋势分析",
    date: "MAR 05",
    month: "MAR",
    day: "05",
    slug: "metaverse-technology-trends",
    excerpt: "深度解析元宇宙技术的最新发展趋势及其对数字内容创作的影响",
    category: "industry",
    readTime: "10分钟阅读",
    image: "/news/placeholder.svg?height=400&width=600&query=元宇宙技术",
    content:
      "深度解析元宇宙技术的最新发展趋势及其对数字内容创作的影响。本文探讨了元宇宙如何重塑数字体验和内容创作的未来。",
  },
  {
    id: "7",
    title: "AI驱动的创意设计工具发布",
    date: "APR 12",
    month: "APR",
    day: "12",
    slug: "ai-powered-creative-design-tools",
    excerpt: "我们最新发布的AI设计助手如何提升创意工作效率",
    category: "technology",
    readTime: "6分钟阅读",
    image: "/news/placeholder.svg?height=400&width=600&query=AI设计工具",
    content: "我们最新发布的AI设计助手如何提升创意工作效率。本文介绍了这款工具的核心功能和实际应用案例。",
  },
  {
    id: "8",
    title: "IC Studio与顶尖高校建立研究合作",
    date: "MAY 18",
    month: "MAY",
    day: "18",
    slug: "ic-studio-academic-partnerships",
    excerpt: "我们与多所知名高校建立研究合作关系，共同推动技术创新",
    category: "company",
    readTime: "5分钟阅读",
    image: "/news/placeholder.svg?height=400&width=600&query=学术合作",
    content: "我们与多所知名高校建立研究合作关系，共同推动技术创新。这些合作将促进前沿技术的研发和人才培养。",
  },
  {
    id: "9",
    title: "虚拟现实在教育领域的应用",
    date: "JUN 22",
    month: "JUN",
    day: "22",
    slug: "vr-applications-in-education",
    excerpt: "探索虚拟现实技术如何革新教育体验和学习方式",
    category: "industry",
    readTime: "7分钟阅读",
    image: "/news/placeholder.svg?height=400&width=600&query=VR教育应用",
    content: "探索虚拟现实技术如何革新教育体验和学习方式。本文分析了VR在教育领域的创新应用和未来发展方向。",
  },
  {
    id: "10",
    title: "3D音频技术的突破与应用",
    date: "JUL 08",
    month: "JUL",
    day: "08",
    slug: "3d-audio-technology-breakthroughs",
    excerpt: "我们在3D音频领域的最新技术突破及其在沉浸式体验中的应用",
    category: "technology",
    readTime: "8分钟阅读",
    image: "/news/placeholder.svg?height=400&width=600&query=3D音频技术",
    content: "我们在3D音频领域的最新技术突破及其在沉浸式体验中的应用。本文详细介绍了空间音频如何提升用户体验的沉浸感。",
  },
  {
    id: "11",
    title: "IC Studio参与国际数字艺术展",
    date: "AUG 15",
    month: "AUG",
    day: "15",
    slug: "ic-studio-international-digital-art-exhibition",
    excerpt: "我们的创意团队在国际数字艺术展上展示最新互动装置作品",
    category: "company",
    readTime: "5分钟阅读",
    image: "/news/placeholder.svg?height=400&width=600&query=数字艺术展",
    content: "我们的创意团队在国际数字艺术展上展示最新互动装置作品。本文分享了展览亮点和观众反馈。",
  },
  {
    id: "12",
    title: "数字孪生技术在城市规划中的应用",
    date: "SEP 30",
    month: "SEP",
    day: "30",
    slug: "digital-twin-technology-urban-planning",
    excerpt: "探讨数字孪生技术如何帮助城市规划者模拟和优化城市发展",
    category: "industry",
    readTime: "9分钟阅读",
    image: "/news/placeholder.svg?height=400&width=600&query=数字孪生城市",
    content: "探讨数字孪生技术如何帮助城市规划者模拟和优化城市发展。本文分析了数字孪生在智慧城市建设中的关键作用。",
  },
]

// 获取所有新闻
export async function fetchAllNews(): Promise<NewsItem[]> {
  // 在实际应用中，这里会调用API获取数据
  // const response = await fetch('/api/news')
  // const data = await response.json()
  // return data

  // 模拟API延迟
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_NEWS), 800)
  })
}

// 获取单个新闻详情
export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  // 在实际应用中，这里会调用API获取数据
  // const response = await fetch(`/api/news/${id}`)
  // const data = await response.json()
  // return data

  // 模拟API延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      const news = MOCK_NEWS.find((item) => item.id === id)
      resolve(news || null)
    }, 500)
  })
}

// 获取单个新闻详情（通过slug）
export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  // 在实际应用中，这里会调用API获取数据
  // const response = await fetch(`/api/news/slug/${slug}`)
  // const data = await response.json()
  // return data

  // 模拟API延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      const news = MOCK_NEWS.find((item) => item.slug === slug)
      resolve(news || null)
    }, 500)
  })
}

// 获取相关新闻
export async function fetchRelatedNews(id: string, limit = 3): Promise<NewsItem[]> {
  // 在实际应用中，这里会调用API获取数据
  // const response = await fetch(`/api/news/related/${id}?limit=${limit}`)
  // const data = await response.json()
  // return data

  // 模拟API延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentNews = MOCK_NEWS.find((item) => item.id === id)
      let relatedNews: NewsItem[] = []

      if (currentNews) {
        // 获取同类别的新闻
        relatedNews = MOCK_NEWS.filter((item) => item.id !== id && item.category === currentNews.category).slice(
          0,
          limit,
        )

        // 如果同类别的新闻不足，添加其他类别的新闻
        if (relatedNews.length < limit) {
          const otherNews = MOCK_NEWS.filter((item) => item.id !== id && item.category !== currentNews.category).slice(
            0,
            limit - relatedNews.length,
          )

          relatedNews = [...relatedNews, ...otherNews]
        }
      } else {
        // 如果找不到当前新闻，返回随机新闻
        relatedNews = MOCK_NEWS.sort(() => 0.5 - Math.random()).slice(0, limit)
      }

      resolve(relatedNews)
    }, 500)
  })
}
