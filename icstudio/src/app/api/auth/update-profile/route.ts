import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, TeamUser, Admin } from "@/lib/db/mongo/schemas/user";
import dbConnect from "@/lib/db/mongo/mongo";
import Redis from "@/lib/db/redis/redis";

export async function POST(request: Request) {
    try {
        console.log("[DEBUG] 开始处理更新个人信息请求");
        const { password, verifyCode, verifyType, verifyContact, userData } = await request.json();
        console.log("[DEBUG] 请求数据:", { verifyType, verifyContact, userData });
        
        // 验证token
        const token = (await cookies()).get("ic-token")?.value;
        console.log("[DEBUG] 获取到的token:", token ? "存在" : "不存在");
        if (!token) {
            console.log("[DEBUG] 未找到token，返回401未登录");
            return NextResponse.json(
                { error: "未登录" },
                { status: 401 }
            );
        }

        // 解析token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
            console.log("[DEBUG] token解析成功，用户ID:", decoded.id, "角色:", decoded.role);
            await dbConnect();
            console.log("[DEBUG] 数据库连接成功");

        // 根据角色获取用户
        let user;
        switch (decoded.role) {
            case 'admin':
                console.log("[DEBUG] 查询管理员信息");
                user = await Admin.findById(decoded.id);
                break;
            case 'team':
                console.log("[DEBUG] 查询团队用户信息");
                user = await TeamUser.findById(decoded.id);
                break;
            default:
                console.log("[DEBUG] 查询普通用户信息");
                user = await User.findById(decoded.id);
        }
        
        console.log("[DEBUG] 查询结果:", user ? "用户存在" : "用户不存在", user ? `用户名: ${user.username}` : "");

        if (!user) {
            console.log("[DEBUG] 用户不存在，返回404");
            return NextResponse.json(
                { error: "用户不存在" },
                { status: 404 }
            );
        }

        // 验证密码
        console.log("[DEBUG] 开始验证密码");
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log("[DEBUG] 密码验证结果:", isValidPassword ? "正确" : "错误");
        if (!isValidPassword) {
            console.log("[DEBUG] 密码错误，返回400");
            return NextResponse.json(
                { error: "密码错误" },
                { status: 400 }
            );
        }

        // 验证验证码
        console.log("[DEBUG] 开始验证验证码，类型:", verifyType, "联系方式:", verifyContact);
        const storedCode = await Redis.get(`verify:${verifyType}:${verifyContact}`);
        console.log("[DEBUG] Redis中存储的验证码:", storedCode, "用户输入的验证码:", verifyCode);
        if (!storedCode || storedCode !== verifyCode) {
            console.log("[DEBUG] 验证码错误或已过期，返回400");
            return NextResponse.json(
                { error: "验证码错误或已过期" },
                { status: 400 }
            );
        }

        // 更新用户信息
        console.log("[DEBUG] 开始准备更新数据");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: Record<string, any> = {};
        
        if (userData.username && userData.username !== user.username) {
            console.log("[DEBUG] 需要更新用户名，原值:", user.username, "新值:", userData.username);
            updateData.username = userData.username;
        }
        
        if (userData.email && userData.email !== user.email) {
            console.log("[DEBUG] 需要更新邮箱，原值:", user.email, "新值:", userData.email);
            updateData.email = userData.email;
        }
        
        if (userData.phone && userData.phone !== user.phone) {
            console.log("[DEBUG] 需要更新手机号，原值:", user.phone, "新值:", userData.phone);
            updateData.phone = userData.phone;
        }
        
        console.log("[DEBUG] 最终更新数据:", updateData);

        // 如果没有要更新的数据
        if (Object.keys(updateData).length === 0) {
            console.log("[DEBUG] 没有要更新的数据，返回400");
            return NextResponse.json(
                { error: "没有要更新的数据" },
                { status: 400 }
            );
        }

        // 更新用户信息
        console.log("[DEBUG] 开始执行数据库更新操作");
        try {
            switch (decoded.role) {
                case 'admin':
                    console.log("[DEBUG] 更新管理员信息");
                    await Admin.findByIdAndUpdate(decoded.id, updateData);
                    break;
                case 'team':
                    console.log("[DEBUG] 更新团队用户信息");
                    await TeamUser.findByIdAndUpdate(decoded.id, updateData);
                    break;
                default:
                    console.log("[DEBUG] 更新普通用户信息");
                    await User.findByIdAndUpdate(decoded.id, updateData);
            }
            console.log("[DEBUG] 数据库更新成功");
        } catch (dbError) {
            console.error("[DEBUG] 数据库更新失败:", dbError);
            throw dbError;
        }

        // 删除验证码
        console.log("[DEBUG] 删除Redis中的验证码");
        await Redis.del(`verify:${verifyType}:${verifyContact}`);

        console.log("[DEBUG] 个人信息更新成功，返回更新后的数据");
        return NextResponse.json({
            message: "个人信息更新成功",
            ...updateData
        });
        } catch (jwtError) {
            console.error("[DEBUG] JWT验证失败:", jwtError);
            return NextResponse.json(
                { error: "无效的token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("[DEBUG] 更新个人信息失败:", error);
        return NextResponse.json(
            { error: "更新个人信息失败" },
            { status: 500 }
        );
    }
}