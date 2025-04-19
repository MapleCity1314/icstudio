import { Document, Model, FilterQuery, UpdateQuery, QueryOptions, PipelineStage, UpdateWithAggregationPipeline, MongooseQueryOptions } from 'mongoose';
import { DBResponse, IModelService, PaginationOptions, PaginatedResult } from './types';

/**
 * MongoDB模型操作服务基类
 * @template T - 文档类型
 * @template TDoc - Document类型
 */
export class ModelService<T, TDoc extends Document = Document & T> implements IModelService<T, TDoc> {
  /**
   * 构造函数
   * @param model - Mongoose模型
   */
  constructor(private readonly model: Model<TDoc>) {}

  /**
   * 获取Model实例
   * @returns Mongoose模型
   */
  public getModel(): Model<TDoc> {
    return this.model;
  }

  /**
   * 创建包装响应对象
   * @param success - 操作是否成功
   * @param data - 操作返回的数据
   * @param error - 操作返回的错误
   * @param message - 操作返回的消息
   * @returns 包装后的响应对象
   */
  private createResponse<R>(
    success: boolean,
    data?: R,
    error?: Error | string,
    message?: string,
    total?: number
  ): DBResponse<R> {
    return {
      success,
      data,
      error,
      message,
      total
    };
  }

  /**
   * 处理数据库操作错误
   * @param error - 错误对象
   * @returns 包含错误信息的响应对象
   */
  private handleError<R>(error: unknown): DBResponse<R> {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[MongoDB操作错误]: ${errorMessage}`, error);
    return this.createResponse<R>(false, undefined, error as Error, errorMessage);
  }

  /**
   * 创建单个文档
   * @param data - 文档数据
   * @returns 创建的文档
   */
  public async create(data: Partial<T>): Promise<DBResponse<T>> {
    try {
      const created = await this.model.create(data);
      return this.createResponse(true, created.toObject() as T, undefined, '文档创建成功');
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * 批量创建文档
   * @param data - 文档数据数组
   * @returns 创建的文档数组
   */
  public async createMany(data: Partial<T>[]): Promise<DBResponse<T[]>> {
    try {
      const created = await this.model.insertMany(data);
      return this.createResponse(
        true,
        created.map(doc => (doc as unknown as Document).toObject ? (doc as unknown as Document).toObject() as T : doc as unknown as T),
        undefined,
        `${created.length}个文档创建成功`
      );
    } catch (error) {
      return this.handleError<T[]>(error);
    }
  }

  /**
   * 查找单个文档
   * @param filter - 查询条件
   * @param projection - 投影条件
   * @returns 查询到的文档或null
   */
  public async findOne(
    filter: FilterQuery<TDoc>,
    projection?: Record<string, number | boolean>
  ): Promise<DBResponse<T | null>> {
    try {
      const document = await this.model.findOne(filter, projection).exec();
      return this.createResponse(
        true,
        document ? document.toObject() as T : null,
        undefined,
        document ? '文档查询成功' : '未找到符合条件的文档'
      );
    } catch (error) {
      return this.handleError<T | null>(error);
    }
  }

  /**
   * 根据ID查找文档
   * @param id - 文档ID
   * @param projection - 投影条件
   * @returns 查询到的文档或null
   */
  public async findById(
    id: string,
    projection?: Record<string, number | boolean>
  ): Promise<DBResponse<T | null>> {
    try {
      const document = await this.model.findById(id, projection).exec();
      return this.createResponse(
        true,
        document ? document.toObject() as T : null,
        undefined,
        document ? '文档查询成功' : '未找到指定ID的文档'
      );
    } catch (error) {
      return this.handleError<T | null>(error);
    }
  }

  /**
   * 查找多个文档
   * @param filter - 查询条件
   * @param projection - 投影条件
   * @param options - 查询选项
   * @returns 查询到的文档数组
   */
  public async find(
    filter: FilterQuery<TDoc>,
    projection?: Record<string, number | boolean>,
    options?: QueryOptions
  ): Promise<DBResponse<T[]>> {
    try {
      const documents = await this.model.find(filter, projection, options).exec();
      return this.createResponse(
        true,
        documents.map(doc => doc.toObject() as T),
        undefined,
        `查询到${documents.length}个文档`
      );
    } catch (error) {
      return this.handleError<T[]>(error);
    }
  }

  /**
   * 分页查询
   * @param filter - 查询条件
   * @param options - 分页选项
   * @param projection - 投影条件
   * @returns 分页查询结果
   */
  public async findWithPagination(
    filter: FilterQuery<TDoc>,
    options: PaginationOptions,
    projection?: Record<string, number | boolean>
  ): Promise<DBResponse<PaginatedResult<T>>> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;
      const sort = options.sort || { createdAt: -1 };

      const [documents, total] = await Promise.all([
        this.model
          .find(filter, projection)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.model.countDocuments(filter).exec()
      ]);

      const pages = Math.ceil(total / limit);
      const result: PaginatedResult<T> = {
        items: documents.map(doc => doc.toObject() as T),
        total,
        page,
        limit,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      };

      return this.createResponse(
        true,
        result,
        undefined,
        `查询到${documents.length}个文档，总计${total}条记录`
      );
    } catch (error) {
      return this.handleError<PaginatedResult<T>>(error);
    }
  }

  /**
   * 更新单个文档
   * @param filter - 查询条件
   * @param update - 更新内容
   * @param options - 更新选项
   * @returns 更新后的文档或null
   */
  public async updateOne(
    filter: FilterQuery<TDoc>,
    update: UpdateQuery<TDoc>,
    options?: QueryOptions
  ): Promise<DBResponse<T | null>> {
    try {
      const updated = await this.model.findOneAndUpdate(
        filter,
        update,
        { new: true, ...options }
      ).exec();
      
      return this.createResponse(
        true,
        updated ? updated.toObject() as T : null,
        undefined,
        updated ? '文档更新成功' : '未找到符合条件的文档'
      );
    } catch (error) {
      return this.handleError<T | null>(error);
    }
  }

  /**
   * 根据ID更新文档
   * @param id - 文档ID
   * @param update - 更新内容
   * @param options - 更新选项
   * @returns 更新后的文档或null
   */
  public async updateById(
    id: string,
    update: UpdateQuery<TDoc>,
    options?: QueryOptions
  ): Promise<DBResponse<T | null>> {
    try {
      const updated = await this.model.findByIdAndUpdate(
        id,
        update,
        { new: true, ...options }
      ).exec();
      
      return this.createResponse(
        true,
        updated ? updated.toObject() as T : null,
        undefined,
        updated ? '文档更新成功' : '未找到指定ID的文档'
      );
    } catch (error) {
      return this.handleError<T | null>(error);
    }
  }

  /**
   * 更新多个文档
   * @param filter - 查询条件
   * @param update - 更新内容
   * @param options - 更新选项
   * @returns 更新的文档数量
   */
  public async updateMany(
    filter: FilterQuery<TDoc>,
    update: UpdateQuery<TDoc> | UpdateWithAggregationPipeline,
    options?: QueryOptions
  ): Promise<DBResponse<number>> {
    try {
      const result = await this.model.updateMany(
        filter, 
        update as UpdateQuery<TDoc>, 
        options as MongooseQueryOptions
      ).exec();
      return this.createResponse(
        true,
        result.modifiedCount,
        undefined,
        `成功更新${result.modifiedCount}个文档`
      );
    } catch (error) {
      return this.handleError<number>(error);
    }
  }

  /**
   * 删除单个文档
   * @param filter - 查询条件
   * @returns 是否删除成功
   */
  public async deleteOne(filter: FilterQuery<TDoc>): Promise<DBResponse<boolean>> {
    try {
      const result = await this.model.deleteOne(filter).exec();
      return this.createResponse(
        true,
        result.deletedCount > 0,
        undefined,
        result.deletedCount > 0 ? '文档删除成功' : '未找到符合条件的文档'
      );
    } catch (error) {
      return this.handleError<boolean>(error);
    }
  }

  /**
   * 根据ID删除文档
   * @param id - 文档ID
   * @returns 是否删除成功
   */
  public async deleteById(id: string): Promise<DBResponse<boolean>> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return this.createResponse(
        true,
        !!result,
        undefined,
        result ? '文档删除成功' : '未找到指定ID的文档'
      );
    } catch (error) {
      return this.handleError<boolean>(error);
    }
  }

  /**
   * 删除多个文档
   * @param filter - 查询条件
   * @returns 删除的文档数量
   */
  public async deleteMany(filter: FilterQuery<TDoc>): Promise<DBResponse<number>> {
    try {
      const result = await this.model.deleteMany(filter).exec();
      return this.createResponse(
        true,
        result.deletedCount,
        undefined,
        `成功删除${result.deletedCount}个文档`
      );
    } catch (error) {
      return this.handleError<number>(error);
    }
  }

  /**
   * 统计文档数量
   * @param filter - 查询条件
   * @returns 文档数量
   */
  public async count(filter: FilterQuery<TDoc>): Promise<DBResponse<number>> {
    try {
      const count = await this.model.countDocuments(filter).exec();
      return this.createResponse(
        true,
        count,
        undefined,
        `符合条件的文档数量为${count}`
      );
    } catch (error) {
      return this.handleError<number>(error);
    }
  }

  /**
   * 聚合查询
   * @param pipeline - 聚合管道
   * @returns 聚合结果
   */
  public async aggregate(pipeline: PipelineStage[]): Promise<DBResponse<unknown[]>> {
    try {
      const results = await this.model.aggregate(pipeline).exec();
      return this.createResponse(
        true,
        results,
        undefined,
        `聚合查询返回${results.length}条结果`
      );
    } catch (error) {
      return this.handleError<unknown[]>(error);
    }
  }

  /**
   * 判断文档是否存在
   * @param filter - 查询条件
   * @returns 是否存在符合条件的文档
   */
  public async exists(filter: FilterQuery<TDoc>): Promise<DBResponse<boolean>> {
    try {
      const exists = await this.model.exists(filter);
      return this.createResponse(
        true,
        !!exists,
        undefined,
        exists ? '文档存在' : '文档不存在'
      );
    } catch (error) {
      return this.handleError<boolean>(error);
    }
  }
} 