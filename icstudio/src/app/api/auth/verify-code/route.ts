import { NextResponse } from "next/server";
import Redis from "@/lib/db/redis/redis";

// 生成验证码
const generateCode = () => Math.random().toString().slice(2, 8);

// 模拟发送验证码
const mockSendCode = (type: string, contact: string, code: string) => {
    console.log(`[验证码模拟发送]
    发送类型: ${type}
    接收地址: ${contact}
    验证码: ${code}
    有效期: 5分钟`);
};

export async function POST(request: Request) {
    try {
        const { type, contact } = await request.json();
        const code = generateCode();

        // 检查发送频率限制
        const lastSendTime = await Redis.get(`lastSend:${type}:${contact}`);
        if (lastSendTime) {
            return NextResponse.json(
                { error: "请求过于频繁，请稍后再试" },
                { status: 429 }
            );
        }

        // 模拟发送验证码
        mockSendCode(type, contact, code);

        // 存储验证码，5分钟有效
        await Redis.set(`verify:${type}:${contact}`, code, "EX", 300);
        // 设置发送频率限制，1分钟
        await Redis.set(`lastSend:${type}:${contact}`, '1', "EX", 60);

        return NextResponse.json({ message: "验证码已发送" });
    } catch (error) {
        console.error("验证码发送失败:", error);
        return NextResponse.json(
            { error: "验证码发送失败" },
            { status: 500 }
        );
    }
}