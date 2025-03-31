import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongo/mongo";
import { Admin, TeamUser, User } from "@/lib/db/mongo/schemas/user";
import { addToCache } from "@/lib/db/redis/use-cache";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier, password } = body;

        await dbConnect();

        // 尝试在三个集合中查找用户
        const admin = await Admin.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
                { number: identifier }
            ]
        });

        const teamUser = await TeamUser.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
                { number: identifier }
            ]
        });

        const normalUser = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
                { number: identifier }
            ]
        });

        // 找到的用户及其角色
        const user = admin || teamUser || normalUser;
        const role = admin ? 'admin' : (teamUser ? 'team' : 'user');

        if (!user) {
            return NextResponse.json(
                { error: "用户不存在" },
                { status: 404 }
            );
        }

        // 验证密码
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "密码错误" },
                { status: 401 }
            );
        }

        // 生成 JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                role: role,
                username: user.username
            },
            process.env.JWT_SECRET || 'Bababoy-key',
            { expiresIn: '24h' }
        );

        // 将用户信息存入 Redis 缓存
        await addToCache(`user:${user._id}`, {
            id: user._id,
            username: user.username,
            role: role,
            email: user.email
        }, 60 * 60 * 24); // 24小时

        return NextResponse.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: role,
                email: user.email
            }
        });

    } catch (error) {
        console.error("登录错误:", error);
        return NextResponse.json(
            { error: "登录失败" },
            { status: 500 }
        );
    }
}