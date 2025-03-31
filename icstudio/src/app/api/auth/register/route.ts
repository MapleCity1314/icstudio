import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongo/mongo";
import { User, TeamUser, IUser } from "@/lib/db/mongo/schemas/user";
import Redis from "@/lib/db/redis/redis";
import bcrypt from "bcryptjs";
import { FilterQuery } from "mongoose";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            username,
            password,
            userType,
            phone,
            phoneCode,
            email,
            emailCode,
            inviteCode,
        } = body;

        await dbConnect();

        // 构建查询条件
        const queryConditions: FilterQuery<IUser>[] = [{ username }];
        if (phone) queryConditions.push({ phone });
        if (email) queryConditions.push({ email });

        // 验证用户名、手机号和邮箱是否已存在
        const existingUser = await Promise.all([
            User.findOne({ $or: queryConditions }),
            TeamUser.findOne({ $or: queryConditions })
        ]);

        if (existingUser[0] || existingUser[1]) {
            const field = existingUser[0]?.username === username || existingUser[1]?.username === username
                ? "用户名"
                : existingUser[0]?.phone === phone || existingUser[1]?.phone === phone
                ? "手机号"
                : "邮箱";
            
            return NextResponse.json(
                { error: `该${field}已被注册` },
                { status: 400 }
            );
        }

        // 验证码校验
        if (phone && phoneCode) {
            const savedCode = await Redis.get(`verify:phone:${phone}`);
            if (phoneCode !== savedCode) {
                return NextResponse.json(
                    { error: "手机验证码错误" },
                    { status: 400 }
                );
            }
        }

        if (email && emailCode) {
            const savedCode = await Redis.get(`verify:email:${email}`);
            if (emailCode !== savedCode) {
                return NextResponse.json(
                    { error: "邮箱验证码错误" },
                    { status: 400 }
                );
            }
        }

        // 团队邀请码验证
        if (userType === "team") {
            const validInviteCode = await Redis.get(`invite:${inviteCode}`);
            if (!validInviteCode) {
                return NextResponse.json(
                    { error: "邀请码无效或已过期" },
                    { status: 400 }
                );
            }
        }

        // 密码加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建用户
        const userData = {
            username,
            password: hashedPassword,
            phone,
            email,
            number: Date.now().toString(),
            registrationDate: new Date(),
            lastLoginDate: new Date(),
            status: 'active',
        };

        const newUser = userType === "team"
            ? await TeamUser.create(userData)
            : await User.create(userData);

        // 清除验证码
        if (phone) await Redis.del(`verify:phone:${phone}`);
        if (email) await Redis.del(`verify:email:${email}`);
        if (inviteCode) await Redis.del(`invite:${inviteCode}`);

        return NextResponse.json({
            message: "注册成功",
            user: {
                id: newUser._id,
                username: newUser.username,
                role: userType,
            }
        });

    } catch (error) {
        console.error("注册失败:", error);
        return NextResponse.json(
            { error: "注册失败" },
            { status: 500 }
        );
    }
}