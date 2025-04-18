import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Mail, MessageSquare, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Home() {

  redirect("/home");
  // error page(if u see this page, please contact the developer)
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                width: `${Math.random() * 300}px`,
                height: `${Math.random() * 300}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl z-10 space-y-8">
        {/* 错误图标 */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <AlertCircle className="h-24 w-24 text-red-500 relative" />
          </div>
        </div>

        {/* 错误卡片 */}
        <Card className="border-2 border-red-200 shadow-lg">
          <CardContent className="pt-6 pb-8 px-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-red-500 mb-2">
                系统错误
              </h1>
              <p className="text-muted-foreground text-lg">
                抱歉，系统遇到了一个错误，请稍后再试
              </p>
            </div>

            <Alert className="bg-red-50 border-red-200 mb-6">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertTitle className="text-lg font-semibold text-red-700">
                系统错误
              </AlertTitle>
              <AlertDescription className="mt-2 text-red-600">
                抱歉，系统遇到了一个错误，请稍后再试
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  size="lg"
                  asChild
                >
                  <Link href="mailto:developer@example.com">
                    <Mail className="mr-2 h-4 w-4" />
                    联系开发者
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-200"
                  asChild
                >
                  <Link href="/">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    刷新页面
                  </Link>
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-red-100 flex items-center justify-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>错误代码: ERR_SERVER_UNAVAILABLE</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 额外信息 */}
        <div className="text-center text-sm text-muted-foreground">
          <p>技术支持</p>
          <p className="mt-1">
            电话：<span className="font-medium">+86 155 4164 9093</span> |
            微信：<span className="font-medium">TechSupport123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
