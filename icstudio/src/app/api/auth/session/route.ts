import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

// 更新session中的用户信息
export async function PUT(request: Request) {
    try {
        console.log("[DEBUG] 开始处理session更新请求");

        // 获取当前session
        const session = await getServerSession(authOptions);
        console.log("[DEBUG] 当前session状态:", session ? "存在" : "不存在");
        
        if (!session) {
            console.log("[DEBUG] 未找到session，返回401未登录");
            return NextResponse.json(
                { error: "未登录" },
                { status: 401 }
            );
        }

        console.log("[DEBUG] 当前session用户信息:", JSON.stringify(session.user));

        let data;
        try {
            data = await request.json();
            console.log("[DEBUG] 请求体数据:", JSON.stringify(data));
        } catch (parseError) {
            console.error("[DEBUG] 请求体解析失败:", parseError);
            return NextResponse.json(
                { error: "请求体解析失败" },
                { status: 400 }
            );
        }
        
        if (!data || !data.user) {
            console.log("[DEBUG] 无效的请求数据:", JSON.stringify(data));
            return NextResponse.json(
                { error: "无效的请求数据" },
                { status: 400 }
            );
        }

        // 创建新的用户对象，而不是直接修改session
        const updatedUser = {
            ...session.user,
            ...data.user
        };
        console.log("[DEBUG] 更新后的用户信息:", JSON.stringify(updatedUser));

        const response = {
            message: "Session更新成功",
            user: updatedUser
        };
        console.log("[DEBUG] 返回响应:", JSON.stringify(response));

        return NextResponse.json(response);
    } catch (error) {
        console.error("更新session失败:", error);
        return NextResponse.json(
            { error: "更新session失败" },
            { status: 500 }
        );
    }
}


// 获取当前session状态
export async function GET() {
    try {
        console.log("[DEBUG] 开始获取session状态");

        const session = await getServerSession(authOptions);
        console.log("[DEBUG] 当前session状态:", session ? "存在" : "不存在");

        if (!session) {
            console.log("[DEBUG] 未找到session，返回401未登录");
            return NextResponse.json(
                { error: "未登录" },
                { status: 401 }
            );
        }

        console.log("[DEBUG] 返回session信息");
        return NextResponse.json(session);
    } catch (error) {
        console.error("获取session失败:", error);
        return NextResponse.json(
            { error: "获取session失败" },
            { status: 500 }
        );
    }
}