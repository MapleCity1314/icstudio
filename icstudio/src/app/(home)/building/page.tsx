import type { Metadata } from "next"
import Link from "next/link"
import { ConstructionScene } from "./components/construction-scene"
import { CountdownTimer } from "./components/countdown-timer"
import { NewsletterForm } from "./components/newsletter-form"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "网站建设中 | 即将推出",
  description: "我们的网站正在建设中。敬请期待精彩内容！",
}

export default function UnderConstructionPage() {
  // Launch date - 30 days from now
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 30)

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-100 to-blue-100 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Floating elements */}
      <div className="absolute top-20 left-[10%] animate-bounce-slow">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-16 h-16 bg-purple-500 rounded-md flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🔨</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>我们正在努力完善细节！</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="absolute bottom-20 right-[15%] animate-float">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-14 h-14 bg-green-400 rounded-md flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🔧</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>正在调整我们的精彩功能！</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main content */}
      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-sm rounded-lg p-6 md:p-10 shadow-2xl border-4 border-yellow-300 z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-4 tracking-tight">资源站 建设中！</h1>
          <p className="text-xl md:text-2xl text-blue-700 mb-6">
            我们正在为您打造<span className="font-bold text-pink-500">精彩</span>内容！
          </p>

          <div className="my-8">
            <CountdownTimer targetDate={launchDate} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <ConstructionScene />
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <div className="bg-yellow-100 rounded-lg p-6 border-2 border-yellow-300">
              <h2 className="text-2xl font-bold text-purple-700 mb-3">保持联系！</h2>
              <p className="text-gray-700 mb-4">成为第一个知道我们上线的人。订阅我们的通讯！</p>
              <NewsletterForm />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
                <Link href="https://twitter.com">
                  <span className="mr-2">🐦</span> 关注我们
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-purple-500 text-purple-700 hover:bg-purple-100"
              >
                <Link href="mailto:contact@example.com">
                  <span className="mr-2">✉️</span> 联系我们
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-20 h-20 bg-pink-300 rounded-md opacity-40 animate-pulse"></div>
        <div className="absolute top-[30%] right-[8%] w-32 h-32 bg-blue-300 rounded-md opacity-30 animate-pulse delay-300"></div>
        <div className="absolute bottom-[15%] left-[15%] w-24 h-24 bg-green-300 rounded-md opacity-40 animate-pulse delay-700"></div>
      </div>
    </main>
  )
}
