"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
    identifier: z.string().min(1, "请输入用户名/手机号/邮箱"),
    password: z.string().min(6, "密码至少6位"),
    rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

const Page = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            console.log("开始登录流程，callbackUrl:", callbackUrl);
            const result = await signIn("credentials", {
                identifier: data.identifier,
                password: data.password,
                rememberMe: data.rememberMe,
                redirect: false,
            });

            console.log("登录结果:", result);

            if (result?.error) {
                toast.error(result.error);
                return;
            }

            toast.success("登录成功");
            console.log("准备重定向到:", callbackUrl);
            router.push(callbackUrl);
            router.refresh();
        } catch (error) {
            console.error("登录错误:", error);
            toast.error("登录失败");
        }
    };

    return (
        <div className="min-h-screen w-full relative">
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <Card className="w-full max-w-md border-none bg-transparent">
                    <MagicCard 
                        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                        className="overflow-hidden rounded-xl"
                    >
                        <CardHeader className="space-y-2 pt-8">
                            <CardTitle className="text-3xl font-bold text-center">
                                欢迎回来
                            </CardTitle>
                            <CardDescription className="text-center">
                                请使用您的账号登录系统
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="px-8 py-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>账号</Label>
                                        <Input
                                            {...register("identifier")}
                                            placeholder="用户名/手机号/邮箱"
                                        />
                                        {errors.identifier && (
                                            <p className="text-sm text-red-500">{errors.identifier.message}</p>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label>密码</Label>
                                        <Input
                                            type="password"
                                            {...register("password")}
                                            placeholder="请输入密码"
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-500">{errors.password.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="checkbox"
                                            {...register("rememberMe")}
                                            className="h-4 w-4"
                                        />
                                        <Label>记住我</Label>
                                    </div>
                                    <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                                        忘记密码？
                                    </a>
                                </div>

                                <Button type="submit" className="w-full">
                                    登录
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="justify-center pb-8">
                            <p className="text-sm">
                                还没有账号？{" "}
                                <a href="/register" className="text-blue-500 hover:text-blue-600 font-medium">
                                    立即注册
                                </a>
                            </p>
                        </CardFooter>
                    </MagicCard>
                </Card>
            </div>
        </div>
    );
}

export default Page; 