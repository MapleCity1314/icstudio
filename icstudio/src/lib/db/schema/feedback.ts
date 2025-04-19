import { Schema, Document } from 'mongoose'

/**
 * @description 反馈类型枚举
 */
export enum FeedbackType {
  JOIN = 'join', // 加入
  COLLABORATE = 'collaborate', // 合作
  MESSAGE = 'message', // 打招呼
}

/**
 * @description 反馈状态枚举
 */
export enum FeedbackStatus {
  PENDING = 'pending', // 待处理
  PROCESSING = 'processing', // 处理中
  COMPLETED = 'completed', // 已完成
  REJECTED = 'rejected', // 已拒绝
}

/**
 * @description 反馈基础接口
 */
export interface IFeedbackBase {
  _id?: string;
  name: string;
  email: string;
  message: string;
  type: FeedbackType;
  status: FeedbackStatus;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * @description Mongoose文档中使用的this类型
 */
export interface IFeedbackSchemaThis {
  type: string;
}

/**
 * @description 加入团队接口
 */
export interface IJoinFeedback extends IFeedbackBase {
  phone: string;
  portfolio?: string;
}

/**
 * @description 合作接口
 */
export interface ICollaborateFeedback extends IFeedbackBase {
  company?: string;
  address?: string;
}

/**
 * @description 打招呼接口
 * 这个类型没有额外字段，但为了类型安全和代码一致性，保留该接口
 */
export interface IMessageFeedback extends IFeedbackBase {
  _messageType: 'simple'; // 添加一个仅作标记用的字段
}

/**
 * @description 反馈接口
 */
export type IFeedback = IJoinFeedback | ICollaborateFeedback | IMessageFeedback;

/**
 * @description 反馈文档接口
 * 使用类型交集代替接口继承
 */
export type IFeedbackDocument = Document & IFeedback;

/**
 * @description 反馈模型名称
 */
export const FEEDBACK_MODEL_NAME = 'Feedback';

/**
 * @description 反馈模型Schema
 */
export const feedbackSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
  },
  email: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true,
  },
  message: { 
    type: String, 
    required: true,
  },
  type: { 
    type: String, 
    enum: Object.values(FeedbackType),
    required: true,
  },
  status: { 
    type: String, 
    enum: Object.values(FeedbackStatus),
    default: FeedbackStatus.PENDING,
  },
  _messageType: {
    type: String,
    default: 'simple',
  },
  // 加入团队特有字段
  phone: { 
    type: String, 
    required: function(this: IFeedbackSchemaThis) { 
      return this.type === FeedbackType.JOIN; 
    },
  },
  portfolio: { 
    type: String,
    trim: true,
  },
  // 合作特有字段
  company: { 
    type: String,
    trim: true,
  },
  address: { 
    type: String,
    trim: true,
  },
}, { 
  timestamps: true,
  versionKey: false,
});
