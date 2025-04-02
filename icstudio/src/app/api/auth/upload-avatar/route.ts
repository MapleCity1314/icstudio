import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { User, TeamUser, Admin } from "@/lib/db/mongo/schemas/user";
import dbConnect from "@/lib/db/mongo/mongo";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// 处理文件上传
export async function POST(request: Request) {
    try {
        // 从请求头获取token
        const authHeader = (await headers()).get("cookie");
        const token = authHeader?.split(';').find(c => c.trim().startsWith('ic-token='))?.split('=')[1];
        
        if (!token) {
            console.log("[DEBUG] 未找到token");
            return NextResponse.json(
                { error: "未登录" },
                { status: 401 }
            );
        }

        // 解析token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
        await dbConnect();

        // 根据角色获取用户
        let user;
        let userModel;
        switch (decoded.role) {
            case 'admin':
                user = await Admin.findById(decoded.id);
                userModel = Admin;
                break;
            case 'team':
                user = await TeamUser.findById(decoded.id);
                userModel = TeamUser;
                break;
            default:
                user = await User.findById(decoded.id);
                userModel = User;
        }

        if (!user) {
            return NextResponse.json(
                { error: "用户不存在" },
                { status: 404 }
            );
        }

        // 解析multipart/form-data请求
        const formData = await request.formData();
        const avatar = formData.get('avatar') as File;

        if (!avatar) {
            return NextResponse.json(
                { error: "未找到头像文件" },
                { status: 400 }
            );
        }

        // 验证文件类型
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(avatar.type)) {
            return NextResponse.json(
                { error: "只支持JPG、PNG、GIF和WEBP格式的图片" },
                { status: 400 }
            );
        }

        // 验证文件大小 (5MB)
        if (avatar.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "头像文件大小不能超过5MB" },
                { status: 400 }
            );
        }

        // 读取文件内容
        const bytes = await avatar.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 创建文件名和路径
        const fileExt = avatar.type.split('/')[1];
        const fileName = `${decoded.id}_${Date.now()}.${fileExt}`;
        
        // 确保目录存在
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }
        
        const filePath = join(uploadDir, fileName);
        
        // 写入文件
        await writeFile(filePath, buffer);
        
        // 更新用户头像URL
        const avatarUrl = `/uploads/avatars/${fileName}`;
        await userModel.findByIdAndUpdate(decoded.id, { avatar: avatarUrl });

        return NextResponse.json({
            message: "头像上传成功",
            avatarUrl
        });
    } catch (error) {
        console.error("头像上传失败:", error);
        return NextResponse.json(
            { error: "头像上传失败" },
            { status: 500 }
        );
    }
}