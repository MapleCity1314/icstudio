import { Schema } from 'mongoose'

// 新闻模型定义
export const newsSchema = new Schema({
        title: {
                type: String,
                required: true,
                trim: true
        },
        
        date: {
                type: String,
                required: true
        },
        month: {
                type: String,
                required: true
        },
        day: {
                type: String,
                required: true
        },
        slug: {
                type: String,
                required: true,
                unique: true,
                trim: true
        },
        excerpt: {
                type: String,
                trim: true
        },
        category: {
                type: String,
                trim: true,
                default: '新闻'
        },
        readTime: {
                type: String,
                default: '5分钟阅读'
        },
        image: {
                type: String
        },
        content: {
                type: String
        }
}, {
        timestamps: true, // 添加 createdAt 和 updatedAt 字段
        toJSON: {
                virtuals: true,
                transform: (_, ret) => {
                        ret.id = ret._id;
                        delete ret._id;
                        delete ret.__v;
                        return ret;
                }
        }
})