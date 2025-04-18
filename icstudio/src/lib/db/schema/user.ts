import { Schema, Document } from 'mongoose';

/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}

/**
 * 用户文档接口
 */
export interface IUser {
  /** 用户名 */
  username: string;
  /** 电子邮件 */
  email: string;
  /** 密码哈希 */
  passwordHash: string;
  /** 用户角色 */
  role: UserRole;
  /** 用户状态 */
  status: UserStatus;
  /** 头像URL */
  avatar?: string;
  /** 个人简介 */
  bio?: string;
  /** 上次登录时间 */
  lastLogin?: Date;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/**
 * 用户文档类型
 */
export interface UserDocument extends Document, IUser {}

/**
 * 用户模式定义
 */
const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: [true, '用户名是必需的'],
      unique: true,
      trim: true,
      minlength: [3, '用户名至少需要3个字符'],
      maxlength: [50, '用户名不能超过50个字符']
    },
    email: {
      type: String,
      required: [true, '电子邮件是必需的'],
      unique: true,
      trim: true,
      lowercase: true,
      // 简单的电子邮件验证
      match: [/^\S+@\S+\.\S+$/, '请提供有效的电子邮件地址']
    },
    passwordHash: {
      type: String,
      required: [true, '密码是必需的'],
      minlength: [6, '密码至少需要6个字符']
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE
    },
    avatar: {
      type: String,
      default: undefined
    },
    bio: {
      type: String,
      default: undefined,
      maxlength: [500, '个人简介不能超过500个字符']
    },
    lastLogin: {
      type: Date,
      default: undefined
    }
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
    versionKey: false // 不包含 __v 字段
  }
);

// 添加索引
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

// 添加虚拟属性
userSchema.virtual('isAdmin').get(function(this: UserDocument) {
  return this.role === UserRole.ADMIN;
});

// 添加实例方法
userSchema.methods.isActive = function(this: UserDocument): boolean {
  return this.status === UserStatus.ACTIVE;
};

// 添加静态方法
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email });
};

// 导出模式和接口
export { userSchema };
export const USER_MODEL_NAME = 'User';
