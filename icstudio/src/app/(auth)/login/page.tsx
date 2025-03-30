"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



const Page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: 处理登录逻辑
    };

    return (
        <div className="min-h-screen w-full relative">
            {/* 3D背景 */}
            {/* <div className="absolute inset-0 z-0">
                <ThreeDMarqueeDemo />
            </div> */}
            
            {/* 登录表单 */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
                    <h2 className="text-3xl font-bold text-center mb-8 text-white">欢迎回来</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                邮箱地址
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="请输入邮箱"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                密码
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="请输入密码"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-white">记住我</label>
                            </div>
                            <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                                忘记密码？
                            </a>
                        </div>
                        <Button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors duration-200"
                        >
                            登录
                        </Button>
                    </form>
                    <p className="mt-6 text-center text-sm text-white">
                        还没有账号？{" "}
                        <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                            立即注册
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Page;
