/**
 * @description 数据库hooks
 * @author maplecity 1314
 * @date 2025-04-18
 */

import { useEffect, useState, useCallback } from 'react';
import { Schema, Document, FilterQuery, UpdateQuery, QueryOptions, PipelineStage } from 'mongoose';
import { dbFactory } from '@/lib/db/db-factory';
import { DBResponse, IModelService, PaginationOptions, PaginatedResult } from '@/lib/db/types';
import MongoClient from '@/lib/db/mongo';

/**
 * 数据库连接状态
 */
export enum DBConnectionStatus {
  /** 未连接 */
  DISCONNECTED = 'disconnected',
  /** 正在连接 */
  CONNECTING = 'connecting',
  /** 已连接 */
  CONNECTED = 'connected',
  /** 连接出错 */
  ERROR = 'error'
}

/**
 * MongoDB数据库钩子
 * @description 提供MongoDB数据库操作的React Hook，支持对所有模型的操作，并提供类型安全的API
 * @returns 数据库操作对象和状态
 * 
 * @example
 * ```tsx
 * // 导入必要的组件和类型
 * import { useDB } from '@/hooks/use-db';
 * import { userSchema, USER_MODEL_NAME, IUser, UserRole } from '@/lib/db/schema/user';
 * 
 * // 在组件中使用
 * const UserList = () => {
 *   const { 
 *     registerSchema, 
 *     getService, 
 *     connectionStatus, 
 *     error 
 *   } = useDB();
 *   const [users, setUsers] = useState<IUser[]>([]);
 *   const [loading, setLoading] = useState(false);
 * 
 *   // 注册Schema和获取服务
 *   useEffect(() => {
 *     registerSchema(USER_MODEL_NAME, userSchema);
 *   }, [registerSchema]);
 * 
 *   // 加载用户列表
 *   const loadUsers = useCallback(async () => {
 *     if (connectionStatus !== DBConnectionStatus.CONNECTED) return;
 *     
 *     setLoading(true);
 *     try {
 *       const userService = getService<IUser>(USER_MODEL_NAME);
 *       const response = await userService.find({});
 *       
 *       if (response.success && response.data) {
 *         setUsers(response.data);
 *       }
 *     } catch (err) {
 *       console.error('加载用户列表失败', err);
 *     } finally {
 *       setLoading(false);
 *     }
 *   }, [connectionStatus, getService]);
 * 
 *   // 连接成功后加载用户
 *   useEffect(() => {
 *     if (connectionStatus === DBConnectionStatus.CONNECTED) {
 *       loadUsers();
 *     }
 *   }, [connectionStatus, loadUsers]);
 * 
 *   // 渲染组件
 *   if (connectionStatus === DBConnectionStatus.CONNECTING) {
 *     return <div>连接数据库中...</div>;
 *   }
 * 
 *   if (connectionStatus === DBConnectionStatus.ERROR) {
 *     return <div>数据库连接错误: {error?.message}</div>;
 *   }
 * 
 *   if (loading) {
 *     return <div>加载中...</div>;
 *   }
 * 
 *   return (
 *     <div>
 *       <h1>用户列表</h1>
 *       <ul>
 *         {users.map(user => (
 *           <li key={user._id}>{user.username} - {user.email}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * };
 * ```
 */
export const useDB = () => {
  // 数据库连接状态
  const [connectionStatus, setConnectionStatus] = useState<DBConnectionStatus>(
    MongoClient.isConnected() ? DBConnectionStatus.CONNECTED : DBConnectionStatus.DISCONNECTED
  );
  // 连接错误
  const [error, setError] = useState<Error | null>(null);

  /**
   * 初始化数据库连接
   * @param uri MongoDB连接URI
   */
  const initializeDB = useCallback(async (uri?: string): Promise<boolean> => {
    if (connectionStatus === DBConnectionStatus.CONNECTING) return false;

    setConnectionStatus(DBConnectionStatus.CONNECTING);
    setError(null);

    try {
      await dbFactory.initialize(uri);
      setConnectionStatus(DBConnectionStatus.CONNECTED);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('数据库连接失败:', error);
      setError(error);
      setConnectionStatus(DBConnectionStatus.ERROR);
      return false;
    }
  }, [connectionStatus]);

  /**
   * 断开数据库连接
   */
  const disconnectDB = useCallback(async (): Promise<void> => {
    try {
      await dbFactory.disconnect();
      setConnectionStatus(DBConnectionStatus.DISCONNECTED);
    } catch (err) {
      console.error('断开数据库连接失败:', err);
    }
  }, []);

  /**
   * 注册Schema
   * @param name Schema名称
   * @param schema Mongoose Schema
   */
  const registerSchema = useCallback((name: string, schema: Schema): void => {
    dbFactory.registerSchema(name, schema);
  }, []);

  /**
   * 获取模型服务
   * @template T 文档类型
   * @template TDoc Document类型
   * @param modelName 模型名称
   * @returns 模型服务实例
   */
  const getService = useCallback(<T, TDoc extends Document = Document & T>(
    modelName: string
  ): IModelService<T, TDoc> => {
    return dbFactory.getService<T, TDoc>(modelName);
  }, []);

  /**
   * 创建文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param data 文档数据
   * @returns 创建结果
   */
  const createDocument = useCallback(async <T>(
    modelName: string,
    data: Partial<T>
  ): Promise<DBResponse<T>> => {
    const service = getService<T>(modelName);
    return service.create(data);
  }, [getService]);

  /**
   * 批量创建文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param data 文档数据数组
   * @returns 创建结果
   */
  const createDocuments = useCallback(async <T>(
    modelName: string,
    data: Partial<T>[]
  ): Promise<DBResponse<T[]>> => {
    const service = getService<T>(modelName);
    return service.createMany(data);
  }, [getService]);

  /**
   * 查找单个文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param filter 查询条件
   * @param projection 投影条件
   * @returns 查询结果
   */
  const findDocument = useCallback(async <T, TDoc extends Document = Document & T>(
    modelName: string,
    filter: FilterQuery<TDoc>,
    projection?: Record<string, number | boolean>
  ): Promise<DBResponse<T | null>> => {
    const service = getService<T, TDoc>(modelName);
    return service.findOne(filter, projection);
  }, [getService]);

  /**
   * 根据ID查找文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param id 文档ID
   * @param projection 投影条件
   * @returns 查询结果
   */
  const findDocumentById = useCallback(async <T>(
    modelName: string,
    id: string,
    projection?: Record<string, number | boolean>
  ): Promise<DBResponse<T | null>> => {
    const service = getService<T>(modelName);
    return service.findById(id, projection);
  }, [getService]);

  /**
   * 查找多个文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param filter 查询条件
   * @param projection 投影条件
   * @param options 查询选项
   * @returns 查询结果
   */
  const findDocuments = useCallback(async <T, TDoc extends Document = Document & T>(
    modelName: string,
    filter: FilterQuery<TDoc>,
    projection?: Record<string, number | boolean>,
    options?: QueryOptions
  ): Promise<DBResponse<T[]>> => {
    const service = getService<T, TDoc>(modelName);
    return service.find(filter, projection, options);
  }, [getService]);

  /**
   * 分页查询文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param filter 查询条件
   * @param paginationOptions 分页选项
   * @param projection 投影条件
   * @returns 分页查询结果
   */
  const findDocumentsWithPagination = useCallback(async <T, TDoc extends Document = Document & T>(
    modelName: string,
    filter: FilterQuery<TDoc>,
    paginationOptions: PaginationOptions,
    projection?: Record<string, number | boolean>
  ): Promise<DBResponse<PaginatedResult<T>>> => {
    const service = getService<T, TDoc>(modelName);
    return service.findWithPagination(filter, paginationOptions, projection);
  }, [getService]);

  /**
   * 更新单个文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param filter 查询条件
   * @param update 更新内容
   * @param options 更新选项
   * @returns 更新结果
   */
  const updateDocument = useCallback(async <T, TDoc extends Document = Document & T>(
    modelName: string,
    filter: FilterQuery<TDoc>,
    update: UpdateQuery<TDoc>,
    options?: QueryOptions
  ): Promise<DBResponse<T | null>> => {
    const service = getService<T, TDoc>(modelName);
    return service.updateOne(filter, update, options);
  }, [getService]);

  /**
   * 根据ID更新文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param id 文档ID
   * @param update 更新内容
   * @param options 更新选项
   * @returns 更新结果
   */
  const updateDocumentById = useCallback(async <T, TDoc extends Document = Document & T>(
    modelName: string,
    id: string,
    update: UpdateQuery<TDoc>,
    options?: QueryOptions
  ): Promise<DBResponse<T | null>> => {
    const service = getService<T, TDoc>(modelName);
    return service.updateById(id, update, options);
  }, [getService]);

  /**
   * 更新多个文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param filter 查询条件
   * @param update 更新内容
   * @param options 更新选项
   * @returns 更新文档数量
   */
  const updateDocuments = useCallback(async <T, TDoc extends Document = Document & T>(
    modelName: string,
    filter: FilterQuery<TDoc>,
    update: UpdateQuery<TDoc>,
    options?: QueryOptions
  ): Promise<DBResponse<number>> => {
    const service = getService<T, TDoc>(modelName);
    return service.updateMany(filter, update, options);
  }, [getService]);

  /**
   * 删除单个文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param filter 查询条件
   * @returns 删除结果
   */
  const deleteDocument = useCallback(async <T, TDoc extends Document = Document & T>(
    modelName: string,
    filter: FilterQuery<TDoc>
  ): Promise<DBResponse<boolean>> => {
    const service = getService<T, TDoc>(modelName);
    return service.deleteOne(filter);
  }, [getService]);

  /**
   * 根据ID删除文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param id 文档ID
   * @returns 删除结果
   */
  const deleteDocumentById = useCallback(async <T>(
    modelName: string,
    id: string
  ): Promise<DBResponse<boolean>> => {
    const service = getService<T>(modelName);
    return service.deleteById(id);
  }, [getService]);

  /**
   * 删除多个文档
   * @template T 文档类型
   * @param modelName 模型名称
   * @param filter 查询条件
   * @returns 删除文档数量
   */
  const deleteDocuments = useCallback(async <T, TDoc extends Document = Document & T>(
    modelName: string,
    filter: FilterQuery<TDoc>
  ): Promise<DBResponse<number>> => {
    const service = getService<T, TDoc>(modelName);
    return service.deleteMany(filter);
  }, [getService]);

  /**
   * 聚合查询
   * @template T 文档类型
   * @param modelName 模型名称
   * @param pipeline 聚合管道
   * @returns 聚合结果
   */
  const aggregateDocuments = useCallback(async <T>(
    modelName: string,
    pipeline: PipelineStage[]
  ): Promise<DBResponse<unknown[]>> => {
    const service = getService<T>(modelName);
    return service.aggregate(pipeline);
  }, [getService]);

  /**
   * 计数查询
   * @template T 文档类型
   * @param modelName 模型名称
   * @param filter 查询条件
   * @returns 文档数量
   */
  const countDocuments = useCallback(async <T, TDoc extends Document = Document & T>(
    modelName: string,
    filter: FilterQuery<TDoc>
  ): Promise<DBResponse<number>> => {
    const service = getService<T, TDoc>(modelName);
    return service.count(filter);
  }, [getService]);

  // 组件挂载时自动尝试连接数据库
  useEffect(() => {
    if (connectionStatus === DBConnectionStatus.DISCONNECTED) {
      initializeDB().catch(err => {
        console.error('初始化数据库连接失败:', err);
      });
    }

    // 组件卸载时不断开连接，因为可能有其他组件仍在使用
    return () => {};
  }, [connectionStatus, initializeDB]);

  return {
    // 连接状态
    connectionStatus,
    error,
    
    // 数据库管理
    initializeDB,
    disconnectDB,
    registerSchema,
    getService,
    
    // 便捷CRUD操作
    createDocument,
    createDocuments,
    findDocument,
    findDocumentById,
    findDocuments,
    findDocumentsWithPagination,
    updateDocument,
    updateDocumentById,
    updateDocuments,
    deleteDocument,
    deleteDocumentById,
    deleteDocuments,
    aggregateDocuments,
    countDocuments
  };
};
