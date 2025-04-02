import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User, TeamUser, Admin } from "@/lib/db/mongo/schemas/user";
import dbConnect from "@/lib/db/mongo/mongo";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function GET() {
    try {
        console.log("[DEBUG] 开始获取用户信息");
        
        // 首先尝试从NextAuth会话获取用户信息
        const session = await getServerSession(authOptions);
        console.log("[DEBUG] NextAuth会话:", session ? "存在" : "不存在");
        
        // 如果存在NextAuth会话，使用会话中的用户ID
        if (session && session.user && session.user.id) {
            console.log("[DEBUG] 使用NextAuth会话中的用户ID:", session.user.id, "角色:", session.user.role);
            
            await dbConnect();
            console.log("[DEBUG] 数据库连接成功");
            
            let user;
            switch (session.user.role) {
                case 'admin':
                    console.log("[DEBUG] 查询管理员信息");
                    user = await Admin.findById(session.user.id).select('-password');
                    break;
                case 'team':
                    console.log("[DEBUG] 查询团队用户信息");
                    user = await TeamUser.findById(session.user.id).select('-password');
                    break;
                default:
                    console.log("[DEBUG] 查询普通用户信息");
                    user = await User.findById(session.user.id).select('-password');
            }
            
            console.log("[DEBUG] 查询结果:", user ? "用户存在" : "用户不存在", user ? `用户名: ${user.username}` : "");
            
            if (!user) {
                console.log("[DEBUG] 用户不存在，返回404");
                return NextResponse.json(
                    { error: "用户不存在" },
                    { status: 404 }
                );
            }
            
            console.log("[DEBUG] 成功获取用户信息，返回用户数据");
            return NextResponse.json(user);
        }
        
        // 如果没有NextAuth会话，尝试使用JWT token
        const token = (await cookies()).get("ic-token")?.value;
        console.log("[DEBUG] 获取到的token:", token ? "存在" : "不存在");

        if (!token) {
            console.log("[DEBUG] 未找到token和会话，返回401未登录");
            return NextResponse.json(
                { error: "未登录" },
                { status: 401 }
            );
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
            console.log("[DEBUG] token解析成功，用户ID:", decoded.id, "角色:", decoded.role);
            await dbConnect();
            console.log("[DEBUG] 数据库连接成功");

            let user;
            switch (decoded.role) {
                case 'admin':
                    console.log("[DEBUG] 查询管理员信息");
                    user = await Admin.findById(decoded.id).select('-password');
                    break;
                case 'team':
                    console.log("[DEBUG] 查询团队用户信息");
                    user = await TeamUser.findById(decoded.id).select('-password');
                    break;
                default:
                    console.log("[DEBUG] 查询普通用户信息");
                    user = await User.findById(decoded.id).select('-password');
            }

            console.log("[DEBUG] 查询结果:", user ? "用户存在" : "用户不存在", user ? `用户名: ${user.username}` : "");

            if (!user) {
                console.log("[DEBUG] 用户不存在，返回404");
                return NextResponse.json(
                    { error: "用户不存在" },
                    { status: 404 }
                );
            }

            console.log("[DEBUG] 成功获取用户信息，返回用户数据");
            return NextResponse.json(user);
        } catch (jwtError) {
            console.error("[DEBUG] JWT验证失败:", jwtError);
            return NextResponse.json(
                { error: "无效的token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("[DEBUG] 获取用户信息失败:", error);
        return NextResponse.json(
            { error: "获取用户信息失败" },
            { status: 500 }
        );
    }
}