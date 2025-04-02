import mongoose from 'mongoose';

// 基础用户 Schema
const baseUserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,  
        unique: true, 
        trim: true,
        minlength: 2
    },
    password: { 
        type: String, 
        required: true 
    },
    avatar: { 
        type: String,  // 改为存储图片URL或路径
        default: null
    },
    email: { 
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^1[3-9]\d{9}$/, '请输入有效的手机号']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active'
    },
    lastLoginAt: {
        type: Date,
        default: null
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        immutable: true
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true, // 自动管理 createdAt 和 updatedAt
    versionKey: false // 不使用 __v 字段
});

// 超级管理员
const adminSchema = new mongoose.Schema({
    ...baseUserSchema.obj,
    role: {
        type: String,
        default: 'admin'
    }
});

// 团队成员
const teamUserSchema = new mongoose.Schema({
    ...baseUserSchema.obj,
    role: {
        type: String,
        default: 'team'
    }
});

// 普通用户
const userSchema = new mongoose.Schema({
    ...baseUserSchema.obj,
    role: {
        type: String,
        default: 'user'
    }
});

// 创建模型
export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema, 'admin');
export const TeamUser = mongoose.models.TeamUser || mongoose.model('TeamUser', teamUserSchema, 'team-user');
export const User = mongoose.models.User || mongoose.model('User', userSchema, 'user');

// 导出类型定义
// 更新接口定义
export interface IUser {
    _id: string;
    username: string; // 用户名
    password: string; // 密码
    avatar?: string; // 头像
    email?: string; // 邮箱
    phone?: string; // 手机号
    status: 'active' | 'inactive' | 'banned'; // 状态：激活、禁用、封禁
    lastLoginAt?: Date;  // 最后登录时间
    createdAt: Date; // 创建时间
    updatedAt: Date; // 更新时间
}

export type IAdmin = IUser;
export type ITeamUser = IUser;