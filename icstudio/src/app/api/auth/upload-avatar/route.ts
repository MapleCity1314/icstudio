import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { User, TeamUser, Admin } from "@/lib/db/mongo/schemas/user";
import dbConnect from "@/lib/db/mongo/mongo";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// 处理文件上传
export async function POST(request: Request) {
    try {
        console.log("[DEBUG] 开始处理头像上传请求");
        
        // 获取NextAuth会话
        const session = await getServerSession(authOptions);
        console.log("[DEBUG] NextAuth会话:", session ? "存在" : "不存在");

        if (!session?.user?.id) {
            console.log("[DEBUG] 未找到有效会话，返回401未登录");
            return NextResponse.json(
                { error: "未登录" },
                { status: 401 }
            );
        }

        try {
            console.log("[DEBUG] 开始验证会话");
            await dbConnect();
            console.log("[DEBUG] 数据库连接成功");

            console.log("[DEBUG] 会话验证成功，用户ID:", session.user.id, "角色:", session.user.role);

            // 根据角色获取用户
            let user;
            let userModel;
            console.log("[DEBUG] 根据角色查询用户信息");
            switch (session.user.role) {
                case 'admin':
                    console.log("[DEBUG] 查询管理员信息");
                    user = await Admin.findById(session.user.id);
                    userModel = Admin;
                    break;
                case 'team':
                    console.log("[DEBUG] 查询团队用户信息");
                    user = await TeamUser.findById(session.user.id);
                    userModel = TeamUser;
                    break;
                default:
                    console.log("[DEBUG] 查询普通用户信息");
                    user = await User.findById(session.user.id);
                    userModel = User;
            }

        if (!user) {
            console.log("[DEBUG] 用户不存在，返回404");
            return NextResponse.json(
                { error: "用户不存在" },
                { status: 404 }
            );
        }
        console.log("[DEBUG] 用户验证成功");

        // 解析multipart/form-data请求
        console.log("[DEBUG] 开始解析上传的文件");
        const formData = await request.formData();
        const avatar = formData.get('avatar') as File;

        if (!avatar) {
            console.log("[DEBUG] 未找到头像文件，返回400");
            return NextResponse.json(
                { error: "未找到头像文件" },
                { status: 400 }
            );
        }
        console.log("[DEBUG] 成功获取上传的文件，类型:", avatar.type, "大小:", avatar.size);

        // 验证文件类型
        console.log("[DEBUG] 开始验证文件类型");
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(avatar.type)) {
            console.log("[DEBUG] 文件类型不支持:", avatar.type);
            return NextResponse.json(
                { error: "只支持JPG、PNG、GIF和WEBP格式的图片" },
                { status: 400 }
            );
        }
        console.log("[DEBUG] 文件类型验证通过");

        // 验证文件大小 (5MB)
        console.log("[DEBUG] 开始验证文件大小");
        if (avatar.size > 5 * 1024 * 1024) {
            console.log("[DEBUG] 文件大小超过限制:", avatar.size, "bytes");
            return NextResponse.json(
                { error: "头像文件大小不能超过5MB" },
                { status: 400 }
            );
        }
        console.log("[DEBUG] 文件大小验证通过");

        // 读取文件内容
        const bytes = await avatar.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 创建文件名和路径
        console.log("[DEBUG] 开始处理文件保存");
        const fileExt = avatar.type.split('/')[1];
        const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
        console.log("[DEBUG] 生成的文件名:", fileName);
        
        // 确保目录存在
        const uploadDir = join(process.cwd(), 'public', 'avatars');
        console.log("[DEBUG] 上传目录路径:", uploadDir);
        if (!existsSync(uploadDir)) {
            console.log("[DEBUG] 创建上传目录");
            await mkdir(uploadDir, { recursive: true });
        }
        
        const filePath = join(uploadDir, fileName);
        console.log("[DEBUG] 完整文件路径:", filePath);
        
        // 写入文件
        console.log("[DEBUG] 开始写入文件");
        await writeFile(filePath, buffer);
        console.log("[DEBUG] 文件写入成功");
        
        // 更新用户头像URL
        console.log("[DEBUG] 开始更新用户头像URL");
        const avatarUrl = `/avatars/${fileName}`;
        await userModel.findByIdAndUpdate(session.user.id, { avatar: avatarUrl });
        console.log("[DEBUG] 用户头像URL更新成功");

        console.log("[DEBUG] 头像上传处理完成");
        return NextResponse.json({
            message: "头像上传成功",
            avatarUrl
        });
    } catch (sessionError) {
        console.error("[DEBUG] 会话验证失败:", sessionError);
        return NextResponse.json(
            { error: "会话验证失败" },
            { status: 401 }
        );
    }
    } catch (error) {
        console.error("[DEBUG] 头像上传失败:", error);
        return NextResponse.json(
            { error: "头像上传失败" },
            { status: 500 }
        );
    }
}