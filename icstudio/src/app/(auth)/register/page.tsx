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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import router from "next/router";

const registerSchema = z.object({
    username: z.string().min(2, "用户名至少2个字符"),
    password: z.string().min(6, "密码至少6位"),
    confirmPassword: z.string(),
    userType: z.enum(["user", "team"]),
    phone: z.string().optional(),
    phoneCode: z.string().optional(),
    email: z.string().optional(),
    emailCode: z.string().optional(),
    inviteCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
}).refine((data) => {
    if (!data.phone && !data.email) {
        return false;
    }
    return true;
}, {
    message: "手机号或邮箱至少填写一项",
    path: ["phone"],
}).refine((data) => {
    if (data.userType === "team" && !data.inviteCode) {
        return false;
    }
    return true;
}, {
    message: "团队成员必须填写邀请码",
    path: ["inviteCode"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const Page = () => {
    const { theme } = useTheme();
    const [verifyMethod, setVerifyMethod] = useState<"phone" | "email">("phone");
    const [countdown, setCountdown] = useState(0);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const userType = watch("userType");

    const startCountdown = () => {
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const sendVerifyCode = async () => {
        try {
            const contact = verifyMethod === "phone" ? watch("phone") : watch("email");
            if (!contact) {
                toast.error(`请输入${verifyMethod === "phone" ? "手机号" : "邮箱"}`);
                return;
            }

            const response = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: verifyMethod,
                    contact
                }),
            });

            if (!response.ok) {
                throw new Error("验证码发送失败");
            }

            startCountdown();
            toast.success("验证码已发送");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("验证码发送失败");
        }
    };

    const onSubmit = async (data: RegisterForm) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "注册失败");
            }

            toast.success("注册成功");
            router.push('/admin');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            console.error(error)
            toast.error(error.message || "注册失败");
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
                                创建账号
                            </CardTitle>
                            <CardDescription className="text-center">
                                请填写以下信息完成注册
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="px-8 py-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>用户类型</Label>
                                        <Select onValueChange={(value) => setValue("userType", value as "user" | "team")}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="选择用户类型" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">普通用户</SelectItem>
                                                <SelectItem value="team">团队成员</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>用户名</Label>
                                        <Input
                                            {...register("username")}
                                            placeholder="请输入用户名"
                                        />
                                        {errors.username && (
                                            <p className="text-sm text-red-500">{errors.username.message}</p>
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

                                    <div className="space-y-2">
                                        <Label>确认密码</Label>
                                        <Input
                                            type="password"
                                            {...register("confirmPassword")}
                                            placeholder="请再次输入密码"
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>

                                    <Tabs defaultValue="phone" onValueChange={(v) => setVerifyMethod(v as "phone" | "email")}>
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="phone">手机号验证</TabsTrigger>
                                            <TabsTrigger value="email">邮箱验证</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="phone" className="space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    {...register("phone")}
                                                    placeholder="请输入手机号"
                                                />
                                                <Button 
                                                    type="button" 
                                                    onClick={sendVerifyCode}
                                                    disabled={countdown > 0}
                                                >
                                                    {countdown > 0 ? `${countdown}s` : "发送验证码"}
                                                </Button>
                                            </div>
                                            <Input
                                                {...register("phoneCode")}
                                                placeholder="请输入验证码"
                                            />
                                        </TabsContent>
                                        <TabsContent value="email" className="space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    {...register("email")}
                                                    placeholder="请输入邮箱"
                                                />
                                                <Button 
                                                    type="button" 
                                                    onClick={sendVerifyCode}
                                                    disabled={countdown > 0}
                                                >
                                                    {countdown > 0 ? `${countdown}s` : "发送验证码"}
                                                </Button>
                                            </div>
                                            <Input
                                                {...register("emailCode")}
                                                placeholder="请输入验证码"
                                            />
                                        </TabsContent>
                                    </Tabs>

                                    {userType === "team" && (
                                        <div className="space-y-2">
                                            <Label>邀请码</Label>
                                            <Input
                                                {...register("inviteCode")}
                                                placeholder="请输入6位邀请码"
                                                maxLength={6}
                                            />
                                            {errors.inviteCode && (
                                                <p className="text-sm text-red-500">{errors.inviteCode.message}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Button type="submit" className="w-full">
                                    注册
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="justify-center pb-8">
                            <p className="text-sm">
                                已有账号？{" "}
                                <a href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                                    立即登录
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
