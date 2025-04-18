import { renderHook, act } from '@testing-library/react-hooks';
import { useDB, DBConnectionStatus } from './use-db';
import MongoClient from '@/lib/db/mongo';
import { dbFactory } from '@/lib/db/db-factory';
import { userSchema, USER_MODEL_NAME, IUser, UserRole, UserStatus } from '@/lib/db/schema/user';

// 模拟MongoDB客户端
jest.mock('@/lib/db/mongo', () => ({
  isConnected: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

// 模拟数据库工厂
jest.mock('@/lib/db/db-factory', () => ({
  dbFactory: {
    initialize: jest.fn(),
    disconnect: jest.fn(),
    registerSchema: jest.fn(),
    getService: jest.fn(),
  },
  DbServiceFactory: {
    getInstance: jest.fn(),
  }
}));

describe('useDB', () => {
  // 准备测试数据
  const mockUser: Partial<IUser> = {
    username: 'testuser',
    email: 'test@example.com',
    passwordHash: 'hashedpassword',
    role: UserRole.USER,
    status: UserStatus.ACTIVE
  };

  // 模拟服务返回
  const mockServiceResponse = {
    success: true,
    data: mockUser,
    message: '操作成功'
  };

  // 模拟服务实例
  const mockService = {
    create: jest.fn().mockResolvedValue(mockServiceResponse),
    createMany: jest.fn().mockResolvedValue({ ...mockServiceResponse, data: [mockUser] }),
    findOne: jest.fn().mockResolvedValue(mockServiceResponse),
    findById: jest.fn().mockResolvedValue(mockServiceResponse),
    find: jest.fn().mockResolvedValue({ ...mockServiceResponse, data: [mockUser] }),
    findWithPagination: jest.fn().mockResolvedValue({
      success: true,
      data: {
        items: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        pages: 1,
        hasNext: false,
        hasPrev: false
      }
    }),
    updateOne: jest.fn().mockResolvedValue(mockServiceResponse),
    updateById: jest.fn().mockResolvedValue(mockServiceResponse),
    updateMany: jest.fn().mockResolvedValue({ success: true, data: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ success: true, data: true }),
    deleteById: jest.fn().mockResolvedValue({ success: true, data: true }),
    deleteMany: jest.fn().mockResolvedValue({ success: true, data: 1 }),
    aggregate: jest.fn().mockResolvedValue({ success: true, data: [{ count: 1 }] }),
    count: jest.fn().mockResolvedValue({ success: true, data: 1 })
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (MongoClient.isConnected as jest.Mock).mockReturnValue(false);
    (dbFactory.getService as jest.Mock).mockReturnValue(mockService);
  });

  test('应该初始化为断开连接状态', () => {
    const { result } = renderHook(() => useDB());
    expect(result.current.connectionStatus).toBe(DBConnectionStatus.DISCONNECTED);
  });

  test('应该在挂载时尝试连接数据库', async () => {
    (dbFactory.initialize as jest.Mock).mockResolvedValue(true);
    
    const { result, waitForNextUpdate } = renderHook(() => useDB());
    
    // 初始状态应该是CONNECTING
    expect(result.current.connectionStatus).toBe(DBConnectionStatus.CONNECTING);
    
    // 等待异步操作完成
    await waitForNextUpdate();
    
    // 现在应该是CONNECTED
    expect(result.current.connectionStatus).toBe(DBConnectionStatus.CONNECTED);
    expect(dbFactory.initialize).toHaveBeenCalled();
  });

  test('当连接失败时应该设置错误状态', async () => {
    const mockError = new Error('连接失败');
    (dbFactory.initialize as jest.Mock).mockRejectedValue(mockError);
    
    const { result, waitForNextUpdate } = renderHook(() => useDB());
    
    // 等待异步操作完成
    await waitForNextUpdate();
    
    // 现在应该是ERROR
    expect(result.current.connectionStatus).toBe(DBConnectionStatus.ERROR);
    expect(result.current.error).toBe(mockError);
  });

  test('应该能注册Schema', () => {
    const { result } = renderHook(() => useDB());
    
    act(() => {
      result.current.registerSchema(USER_MODEL_NAME, userSchema);
    });
    
    expect(dbFactory.registerSchema).toHaveBeenCalledWith(USER_MODEL_NAME, userSchema);
  });

  test('应该能创建文档', async () => {
    const { result } = renderHook(() => useDB());
    
    await act(async () => {
      await result.current.createDocument(USER_MODEL_NAME, mockUser);
    });
    
    expect(dbFactory.getService).toHaveBeenCalledWith(USER_MODEL_NAME);
    expect(mockService.create).toHaveBeenCalledWith(mockUser);
  });

  test('应该能查找文档', async () => {
    const { result } = renderHook(() => useDB());
    const filter = { username: 'testuser' };
    
    await act(async () => {
      await result.current.findDocument(USER_MODEL_NAME, filter);
    });
    
    expect(mockService.findOne).toHaveBeenCalledWith(filter, undefined);
  });

  test('应该能更新文档', async () => {
    const { result } = renderHook(() => useDB());
    const filter = { username: 'testuser' };
    const update = { $set: { status: UserStatus.INACTIVE } };
    
    await act(async () => {
      await result.current.updateDocument(USER_MODEL_NAME, filter, update);
    });
    
    expect(mockService.updateOne).toHaveBeenCalledWith(filter, update, undefined);
  });

  test('应该能删除文档', async () => {
    const { result } = renderHook(() => useDB());
    const filter = { username: 'testuser' };
    
    await act(async () => {
      await result.current.deleteDocument(USER_MODEL_NAME, filter);
    });
    
    expect(mockService.deleteOne).toHaveBeenCalledWith(filter);
  });

  test('应该能进行分页查询', async () => {
    const { result } = renderHook(() => useDB());
    const filter = {};
    const paginationOptions = { page: 1, limit: 10 };
    
    await act(async () => {
      await result.current.findDocumentsWithPagination(USER_MODEL_NAME, filter, paginationOptions);
    });
    
    expect(mockService.findWithPagination).toHaveBeenCalledWith(filter, paginationOptions, undefined);
  });

  test('应该能进行聚合查询', async () => {
    const { result } = renderHook(() => useDB());
    const pipeline = [{ $group: { _id: '$status', count: { $sum: 1 } } }];
    
    await act(async () => {
      await result.current.aggregateDocuments(USER_MODEL_NAME, pipeline);
    });
    
    expect(mockService.aggregate).toHaveBeenCalledWith(pipeline);
  });

  test('应该能断开数据库连接', async () => {
    (dbFactory.initialize as jest.Mock).mockResolvedValue(true);
    const { result, waitForNextUpdate } = renderHook(() => useDB());
    
    // 等待连接建立
    await waitForNextUpdate();
    
    await act(async () => {
      await result.current.disconnectDB();
    });
    
    expect(dbFactory.disconnect).toHaveBeenCalled();
    expect(result.current.connectionStatus).toBe(DBConnectionStatus.DISCONNECTED);
  });
});





