import Image from "next/image";
import { ReactNode } from "react";

// 定义TimelineItem类型
export interface TimelineItem {
  title: string;
  content: ReactNode;
}

export function fetchTimelineItems(): TimelineItem[] {
        
  return [
    {
      title: "2025",
      content: (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">团队扩展与品牌建设</h3>
          <p className="text-gray-700 dark:text-gray-300">
            2025年，我们的团队扩充到了三个人，完成了更多项目，并建立了自己的品牌标识。
            我们有了自己的LOGO和IP等内容，同时开展了视频账号等新媒体计划。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">判题鸭v1</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">新时代AI智能判题系统</p>
              <div className="mt-3 flex justify-center">
                <div className="relative h-30 w-full">
                  <Image 
                    src="/timeline/ai-grading-system-interface.png" 
                    alt="判题鸭系统界面" 
                    className="rounded-md object-cover" 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">AI API智能开放平台</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">API开放平台原理，正在研发MCP版</p>
              <div className="mt-3 flex justify-center">
                <div className="relative h-30 w-full">
                  <Image
                    src="/timeline/interconnected-api-network.png"
                    alt="API开放平台界面"
                    className="rounded-md object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg col-span-1 md:col-span-2">
              <h4 className="font-semibold text-lg mb-2">Loome</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">基于AI的智能在线视频编辑器</p>
              <div className="mt-3 flex justify-center">
                <div className="relative h-30 w-full">
                  <Image
                    src="/timeline/ai-video-editor-interface.png"
                    alt="Loome视频编辑器界面"
                    className="rounded-md object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1 rounded-full text-xs font-medium">
              团队扩展
            </div>
            <div className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-3 py-1 rounded-full text-xs font-medium">
              品牌建设
            </div>
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1 rounded-full text-xs font-medium">
              新媒体计划
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2024",
      content: (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">团队成立与初步规划</h3>
          <p className="text-gray-700 dark:text-gray-300">
            2024年，我们完成了小部分规划，并成立了一个两人的小团队。 我们完成了部分规划，并成功交付了第一个项目。
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-2">
            <h4 className="font-semibold text-lg mb-2">悟创物联</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">智能物联网监控平台</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Vue3</span>
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">SpringBoot3</span>
            </div>
            <div className="mt-3 flex justify-center">
              <div className="relative h-40 w-full">
                <Image 
                  src="/timeline/iot-monitoring-dashboard.png" 
                  alt="悟创物联平台界面" 
                  className="rounded-md object-cover" 
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-3 py-1 rounded-full text-xs font-medium">
              团队成立
            </div>
            <div className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 px-3 py-1 rounded-full text-xs font-medium">
              首个项目
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2023及更早",
      content: (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">创意萌芽</h3>
          <p className="text-gray-700 dark:text-gray-300">
            在2023年及更早以前，我们便萌生了开办工作室的想法。
            这一时期，我们进行了大量的市场调研和技术积累，为未来的发展奠定了基础。
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-2 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-2">创意构思</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">这一阶段，我们主要进行了：</p>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-600 dark:text-gray-400">
                <li>市场需求分析</li>
                <li>技术可行性研究</li>
                <li>团队能力评估</li>
                <li>初步商业模式构想</li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative h-36 w-36">
                <Image
                  src="/timeline/illuminated-ideas.png"
                  alt="创意构思概念图"
                  className="rounded-full object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1 rounded-full text-xs font-medium">
              创意萌芽
            </div>
            <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1 rounded-full text-xs font-medium">
              市场调研
            </div>
            <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 px-3 py-1 rounded-full text-xs font-medium">
              技术积累
            </div>
          </div>
        </div>
      ),
    },
  ]
}
