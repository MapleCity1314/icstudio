import { AnimatedTestimonialsDemo } from "@/components/self-introduce";
import HeroGeometric from "@/components/hero-page";
import Nav from "@/components/nav";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const App = () => {
  return (
    <div className="relative w-full">
      {/* 固定导航栏 */}
      <Nav />
      
      {/* 主内容区域 */}
      <main className="w-full">
        {/* 第一页：Hero部分 */}
        <section id="hero" className="min-h-screen w-full relative">
          <HeroGeometric />
          
          {/* 向下滚动指示器 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
            <span className="text-white/70 text-sm mb-2">向下滚动</span>
            <a 
              href="#introduce" 
              className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <ChevronDownIcon className="w-5 h-5 text-white" />
            </a>
          </div>
        </section>
        
        {/* 第二页：自我介绍部分 */}
        <section id="introduce" className="min-h-screen w-full relative overflow-hidden">
          <div className="relative z-10">
            <div className="container mx-auto px-4 py-20">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
                我们的团队
              </h2>
              <AnimatedTestimonialsDemo />
            </div>
            
            {/* 向下滚动指示器（如果有下一页） */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
              <span className="text-white/70 text-sm mb-2">继续探索</span>
              <a 
                href="#future-section" 
                className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
              >
                <ChevronDownIcon className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </section>
        
        {/* 预留第三页：可以根据需要添加更多内容 */}
        <section id="future-section" className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-gray-800 to-gray-900 relative">
          <div className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              更多精彩，敬请期待
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              我们正在努力为您带来更多精彩内容，请继续关注我们的更新。
            </p>
          </div>
          
          {/* 回到顶部按钮 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <span className="text-white/70 text-sm mb-2">回到顶部</span>
            <a 
              href="#hero" 
              className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <ChevronDownIcon className="w-5 h-5 text-white rotate-180" />
            </a>
          </div>
        </section>
      </main>
      
      {/* 可选：侧边滚动指示器 */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        <a 
          href="#hero" 
          className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/80 transition-all"
          aria-label="滚动到顶部"
        />
        <a 
          href="#introduce" 
          className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/80 transition-all"
          aria-label="滚动到团队介绍"
        />
        <a 
          href="#future-section" 
          className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/80 transition-all"
          aria-label="滚动到未来内容"
        />
      </div>
    </div>
  );
};

export default App;
