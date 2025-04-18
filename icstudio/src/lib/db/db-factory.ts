import { Connection, Document, Model, Schema } from 'mongoose';
import { IDbServiceFactory, IModelService } from './types';
import { ModelService } from './model-service';
import MongoClient from './mongo';

/**
 * 数据库服务工厂类
 * @description 负责创建和管理所有模型服务实例，采用单例模式确保全局只有一个实例
 */
export class DbServiceFactory implements IDbServiceFactory {
  private static instance: DbServiceFactory;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private serviceCache: Map<string, IModelService<any, any>> = new Map();
  private schemaRegistry: Map<string, Schema> = new Map();
  private connection: Connection | null = null;

  private constructor() {}

  /**
   * 获取DbServiceFactory单例实例
   * @returns DbServiceFactory实例
   */
  public static getInstance(): DbServiceFactory {
    if (!DbServiceFactory.instance) {
      DbServiceFactory.instance = new DbServiceFactory();
    }
    return DbServiceFactory.instance;
  }

  /**
   * 初始化数据库连接
   * @param uri MongoDB连接URI，如未提供则使用环境变量
   * @returns 是否初始化成功
   * @throws 初始化失败时抛出异常
   */
  public async initialize(uri?: string): Promise<boolean> {
    try {
      if (!this.connection || !MongoClient.isConnected()) {
        this.connection = await MongoClient.connect(uri);
      }
      return true;
    } catch (error) {
      console.error('数据库服务初始化失败：', error);
      throw error;
    }
  }

  /**
   * 注册Schema
   * @param name Schema名称
   * @param schema Mongoose Schema对象
   */
  public registerSchema(name: string, schema: Schema): void {
    this.schemaRegistry.set(name, schema);
  }

  /**
   * 根据Schema名称获取对应的Model
   * @template T 文档类型
   * @template TDoc Document类型
   * @param name Schema名称
   * @returns Mongoose Model对象
   * @throws 如果Schema未注册或数据库未连接，抛出异常
   */
  public getModel<T, TDoc extends Document = Document & T>(name: string): Model<TDoc> {
    if (!this.connection) {
      throw new Error('数据库未连接，请先调用initialize方法');
    }

    if (!this.schemaRegistry.has(name)) {
      throw new Error(`Schema "${name}"未注册，请先调用registerSchema方法`);
    }

    // 检查连接中是否已存在此模型
    let model: Model<TDoc>;
    try {
      model = this.connection.model<TDoc>(name);
    } catch {
      // 如果模型不存在，则创建一个新的
      const schema = this.schemaRegistry.get(name)!;
      model = this.connection.model<TDoc>(name, schema);
    }

    return model;
  }

  /**
   * 获取指定模型的服务实例
   * @template T 文档类型
   * @template TDoc Document类型
   * @param modelName 模型名称
   * @returns 模型服务实例
   */
  public getService<T, TDoc extends Document = Document & T>(modelName: string): IModelService<T, TDoc> {
    // 如果缓存中已存在此服务实例，则直接返回
    const cachedService = this.serviceCache.get(modelName) as IModelService<T, TDoc>;
    if (cachedService) {
      return cachedService;
    }

    // 获取Model并创建服务实例
    const model = this.getModel<T, TDoc>(modelName);
    const service = new ModelService<T, TDoc>(model);
    
    // 将服务实例添加到缓存
    this.serviceCache.set(modelName, service);
    
    return service;
  }

  /**
   * 清空服务缓存
   */
  public clearServiceCache(): void {
    this.serviceCache.clear();
  }

  /**
   * 断开数据库连接
   */
  public async disconnect(): Promise<void> {
    this.clearServiceCache();
    await MongoClient.disconnect();
    this.connection = null;
  }
}

// 导出单例实例
export const dbFactory = DbServiceFactory.getInstance(); 