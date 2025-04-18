import { Document, Model, FilterQuery, UpdateQuery, QueryOptions, PipelineStage } from 'mongoose';

/**
 * 对数据库操作的返回结果进行封装
 */
export interface DBResponse<T> {
  /** 操作是否成功 */
  success: boolean;
  /** 操作返回的数据 */
  data?: T;
  /** 操作返回的错误信息 */
  error?: Error | string;
  /** 操作返回的消息 */
  message?: string;
  /** 总记录数（用于分页查询） */
  total?: number;
}

/**
 * 分页查询参数
 */
export interface PaginationOptions {
  /** 当前页码，从1开始 */
  page?: number;
  /** 每页条数 */
  limit?: number;
  /** 排序字段 */
  sort?: Record<string, 1 | -1>;
}

/**
 * 集合查询结果
 */
export interface PaginatedResult<T> {
  /** 查询结果数据 */
  items: T[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  limit: number;
  /** 总页数 */
  pages: number;
  /** 是否有下一页 */
  hasNext: boolean;
  /** 是否有上一页 */
  hasPrev: boolean;
}

/**
 * MongoDB模型服务接口定义
 * @template T - 文档类型
 * @template TDoc - Document类型
 */
export interface IModelService<T, TDoc extends Document = Document & T> {
  /** 获取Model实例 */
  getModel(): Model<TDoc>;
  
  /** 创建单个文档 */
  create(data: Partial<T>): Promise<DBResponse<T>>;
  
  /** 批量创建文档 */
  createMany(data: Partial<T>[]): Promise<DBResponse<T[]>>;
  
  /** 查找单个文档 */
  findOne(filter: FilterQuery<TDoc>, projection?: Record<string, number | boolean>): Promise<DBResponse<T | null>>;
  
  /** 根据ID查找文档 */
  findById(id: string, projection?: Record<string, number | boolean>): Promise<DBResponse<T | null>>;
  
  /** 查找多个文档 */
  find(filter: FilterQuery<TDoc>, projection?: Record<string, number | boolean>, options?: QueryOptions): Promise<DBResponse<T[]>>;
  
  /** 分页查询 */
  findWithPagination(
    filter: FilterQuery<TDoc>,
    options: PaginationOptions,
    projection?: Record<string, number | boolean>
  ): Promise<DBResponse<PaginatedResult<T>>>;
  
  /** 更新单个文档 */
  updateOne(filter: FilterQuery<TDoc>, update: UpdateQuery<TDoc>, options?: QueryOptions): Promise<DBResponse<T | null>>;
  
  /** 根据ID更新文档 */
  updateById(id: string, update: UpdateQuery<TDoc>, options?: QueryOptions): Promise<DBResponse<T | null>>;
  
  /** 更新多个文档 */
  updateMany(filter: FilterQuery<TDoc>, update: UpdateQuery<TDoc>, options?: QueryOptions): Promise<DBResponse<number>>;
  
  /** 删除单个文档 */
  deleteOne(filter: FilterQuery<TDoc>): Promise<DBResponse<boolean>>;
  
  /** 根据ID删除文档 */
  deleteById(id: string): Promise<DBResponse<boolean>>;
  
  /** 删除多个文档 */
  deleteMany(filter: FilterQuery<TDoc>): Promise<DBResponse<number>>;
  
  /** 统计文档数量 */
  count(filter: FilterQuery<TDoc>): Promise<DBResponse<number>>;
  
  /** 聚合查询 */
  aggregate(pipeline: PipelineStage[]): Promise<DBResponse<unknown[]>>;
  
  /** 判断文档是否存在 */
  exists(filter: FilterQuery<TDoc>): Promise<DBResponse<boolean>>;
}

/**
 * 数据库服务工厂类接口
 */
export interface IDbServiceFactory {
  /** 获取指定模型的服务实例 */
  getService<T, TDoc extends Document = Document & T>(modelName: string): IModelService<T, TDoc>;
} 