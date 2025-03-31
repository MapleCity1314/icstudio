import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User, TeamUser, Admin } from "@/lib/db/mongo/schemas/user";
import dbConnect from "@/lib/db/mongo/mongo";

export async function GET() {
    try {
        const token = (await cookies()).get("ic-token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "未登录" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
        await dbConnect();

        let user;
        switch (decoded.role) {
            case 'admin':
                user = await Admin.findById(decoded.id).select('-password');
                break;
            case 'team':
                user = await TeamUser.findById(decoded.id).select('-password');
                break;
            default:
                user = await User.findById(decoded.id).select('-password');
        }

        if (!user) {
            return NextResponse.json(
                { error: "用户不存在" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("获取用户信息失败:", error);
        return NextResponse.json(
            { error: "获取用户信息失败" },
            { status: 500 }
        );
    }
}