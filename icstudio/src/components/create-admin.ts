import bcrypt from 'bcryptjs';
import { Admin } from '../lib/db/mongo/schemas/user';
import dbConnect from '../lib/db/mongo/mongo';

export async function createAdmin() {
    try {
        await dbConnect();
        
        const hashedPassword = await bcrypt.hash('Zsxx*20120302', 10);
        
        const adminData = {
            username: "Maplecity1314",
            password: hashedPassword,
            avatar: "/avatars/admin-avatar.jpg",
            phone: "15541649093",
            email: "2702540295@qq.com",
            status: "active",
            role: "admin",
            lastLoginAt: new Date(),
        };

        const admin = await Admin.create(adminData);
        console.log('超级管理员创建成功:', admin);
        process.exit(0);
    } catch (error) {
        console.error('创建失败:', error);
        process.exit(1);
    }
}

createAdmin();