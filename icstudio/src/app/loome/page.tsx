import Loome from "./loome"
import { FeatureSection, AboutSection, FaqSection } from "@/components/loome/sections"
import VideoBackground from "@/components/media/VideoBackground"
import StarryBackground from "@/components/starry-background"

export default function Page() {
    return (
        <div className="snap-y snap-mandatory h-screen w-full overflow-y-scroll overflow-x-hidden bg-black">
            {/* 第一屏: Loome 展示部分 */}
            <section className="snap-start w-full h-screen relative overflow-hidden isolate">
                {/* 视频背景仅用于第一屏 */}
                <VideoBackground />
                <div className="relative z-10 w-full h-full">
                    <Loome />
                </div>
            </section>
            
            {/* 第二屏: 功能特性介绍 */}
            <section className="snap-start w-full h-screen relative overflow-hidden isolate">
                <div className="absolute inset-0 w-[calc(100%+4px)] h-[calc(100%+4px)] left-[-2px] top-[-2px]">
                    <StarryBackground />
                </div>
                <div className="absolute inset-0 bg-slate-900/70 z-[1]"></div>
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <FeatureSection />
                </div>
            </section>
            
            {/* 第三屏: 关于我们 */}
            <section className="snap-start w-full h-screen relative overflow-hidden isolate">
                <div className="absolute inset-0 w-[calc(100%+4px)] h-[calc(100%+4px)] left-[-2px] top-[-2px]">
                    <StarryBackground />
                </div>
                <div className="absolute inset-0 bg-indigo-900/70 z-[1]"></div>
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <AboutSection />
                </div>
            </section>
            
            {/* 第四屏: 常见问题 */}
            <section className="snap-start w-full h-screen relative overflow-hidden isolate">
                <div className="absolute inset-0 w-[calc(100%+4px)] h-[calc(100%+4px)] left-[-2px] top-[-2px]">
                    <StarryBackground />
                </div>
                <div className="absolute inset-0 bg-slate-900/70 z-[1]"></div>
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <FaqSection />
                </div>
            </section>
        </div>
    )
}