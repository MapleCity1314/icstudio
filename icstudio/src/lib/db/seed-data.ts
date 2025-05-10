import { NewsItem } from "@/types/news";
import { dbFactory } from "./db-factory";

/**
 * 新闻测试数据
 */
const newsSeedData: Omit<NewsItem, 'id'>[] = [
  {
    title: "人工智能突破：新模型在多任务处理上超越人类",
    date: "2023-12-15",
    month: "12月",
    day: "15",
    slug: "ai-breakthrough-new-model",
    excerpt: "最新研究表明，新一代AI模型在同时处理多个复杂任务时表现优于人类专家。",
    category: "技术",
    readTime: "4分钟阅读",
    image: "https://images.unsplash.com/photo-1677442135968-6ac6e1bbccc4",
    content: "人工智能领域迎来重大突破，研究人员开发的新型神经网络在多任务并行处理能力上首次超越人类专家。该模型采用创新的注意力机制，能够同时处理语言理解、视觉识别和策略规划等多种任务，并在各领域基准测试中取得领先成绩。专家认为，这标志着AI向通用人工智能迈出了重要一步。"
  },
  {
    title: "我公司与国际能源巨头达成战略合作",
    date: "2023-11-28",
    month: "11月",
    day: "28",
    slug: "strategic-partnership-energy",
    excerpt: "我司与全球知名能源公司签署战略合作协议，共同推进绿色能源解决方案。",
    category: "公司",
    readTime: "3分钟阅读",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
    content: "本月，我公司与国际能源巨头EnergyGlobal正式签署战略合作协议。双方将在绿色能源技术研发、智能电网建设和可再生能源项目开发等方面展开深度合作。此次合作预计将带动相关产业投资超过10亿美元，创造数千个就业岗位，并有望在未来五年内将我国可再生能源使用率提升15%。"
  },
  {
    title: "区块链技术在供应链管理中的创新应用",
    date: "2023-10-10",
    month: "10月",
    day: "10",
    slug: "blockchain-supply-chain",
    excerpt: "新研究展示了区块链如何彻底改变供应链管理，提高透明度和效率。",
    category: "技术",
    readTime: "5分钟阅读",
    image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28",
    content: "区块链技术正在彻底改变全球供应链管理方式。最新行业报告显示，采用区块链解决方案的企业平均可将供应链成本降低23%，同时将产品追踪时间缩短78%。这项技术通过创建不可篡改的分布式账本，实现了从原材料采购到最终产品交付的全程透明化，有效解决了传统供应链中的信息孤岛问题。"
  },
  {
    title: "量子计算研究取得关键进展",
    date: "2023-09-22",
    month: "9月",
    day: "22",
    slug: "quantum-computing-breakthrough",
    excerpt: "科学家们成功研发出温度稳定的量子比特，为实用量子计算机铺平道路。",
    category: "技术",
    readTime: "6分钟阅读",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    content: "量子计算领域迎来重大突破，研究人员宣布成功开发出能在接近室温环境下稳定运行的量子比特。这一成果解决了量子计算长期面临的退相干问题，大幅降低了量子计算机的制造和运行成本。专家预测，这项技术将使商业化量子计算机提前5-10年问世，并在密码学、药物发现和材料科学等领域带来革命性进展。"
  },
  {
    title: "我公司推出革命性智能办公平台",
    date: "2023-08-18",
    month: "8月",
    day: "18",
    slug: "revolutionary-smart-office-platform",
    excerpt: "集成AI助手、智能文档管理和团队协作的下一代办公解决方案正式发布。",
    category: "公司",
    readTime: "3分钟阅读",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174",
    content: "今日我公司正式发布了革命性智能办公平台SmartOffice Pro。该平台集成了先进的AI助手,智能文档管理系统和实时团队协作工具，旨在提升企业工作效率和创新能力。内部测试显示，使用该平台可使日常文档处理效率提升35%，团队协作效率提升42%。该平台采用订阅模式，已吸引超过100家企业签约。"
  },
  {
    title: "可持续发展：行业领袖共议绿色转型",
    date: "2023-07-05",
    month: "7月",
    day: "5",
    slug: "sustainable-development-green-transformation",
    excerpt: "全球行业领袖齐聚年度峰会，探讨企业如何引领可持续发展与绿色转型。",
    category: "行业",
    readTime: "4分钟阅读",
    image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8",
    content: "本周，来自全球各地的行业领袖齐聚2023可持续发展峰会，共同探讨企业如何加速绿色转型。与会专家一致认为，气候变化已成为企业必须应对的核心挑战，而先行者将在未来市场竞争中占据优势。多家领先企业在会上公布了碳中和时间表和具体行动计划，涵盖能源使用、供应链管理和产品设计等多个方面。"
  }
];

/**
 * 填充测试数据到数据库
 */
export async function seedDatabase(): Promise<void> {
  try {
    console.log('正在填充测试数据...');
    
    // 获取新闻服务
    const newsService = dbFactory.getService<NewsItem>('News');
    
    // 清空现有数据
    await newsService.deleteMany({});
    
    // 插入测试数据
    await newsService.createMany(newsSeedData);
    
    console.log(`成功填充 ${newsSeedData.length} 条新闻数据`);
  } catch (error) {
    console.error('填充测试数据失败:', error);
    throw error;
  }
} 