import LoomeNav from "@/components/layout/loome/loome-nav";

export default function LoomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full">
      {/* 固定导航栏，滚动时保持可见 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
        <LoomeNav />
      </div>
      
      {/* 主要内容 */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

