# MongoDB utils with mongoose

By Maplecity1314 icstudio

## 1. 系统概述

本系统采用**单例模式**和工厂模式设计，提供了完整的 MongoDB 数据库操作解决方案。主要包含以下核心组件：

- MongoClient: MongoDB 连接管理器
- DbServiceFactory: 数据库服务工厂
- ModelService: 模型服务封装
- init-db: 数据库初始化工具

## 2.快速开始

### 2.1 初始化数据库连接

```typescript
import { ensureDbConnection } from '@/lib/db/init-db';

// 方式1：使用环境变量中的连接URI
await ensureDbConnection();

// 方式2：指定连接URI
await ensureDbConnection('mongodb://localhost:27017/your-database');
```

### 2.2 定义数据模型（schema）

```typescript
import { Schema } from 'mongoose';
import { dbFactory } from '@/lib/db/db-factory';

// 定义Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number }
});

// 注册Schema
dbFactory.registerSchema('User', userSchema);
```

## 3. 数据库操作

### 3.1 获取模型服务

```typescript
import { dbFactory } from '@/lib/db/db-factory';

// 获取User模型服务
const userService = dbFactory.getService<User>('User');
```

### 3.2 基础CRUD操作

```typescript
// 创建文档
const newUser = await userService.create({
  name: '张三',
  email: 'zhangsan@example.com',
  age: 25
});

// 查询文档
const user = await userService.findById('user_id');
const users = await userService.find({ age: { $gt: 20 } });

// 更新文档
await userService.updateById('user_id', { age: 26 });

// 删除文档
await userService.deleteById('user_id');
```

### 3.3 高级查询操作

```typescript
// 分页查询
const { data, total } = await userService.findWithPagination(
  { age: { $gt: 20 } },
  { page: 1, limit: 10 }
);

// 聚合查询
const result = await userService.aggregate([
  { $match: { age: { $gt: 20 } } },
  { $group: { _id: '$age', count: { $sum: 1 } } }
]);
```

## 4. 连接管理

### 4.1 检查连接状态

```typescript
import { isDbInitialized } from '@/lib/db/init-db';

const isConnected = isDbInitialized();
```

### 4.2 断开连接

```typescript
import { cleanupDbConnection } from '@/lib/db/init-db';

await cleanupDbConnection();
```

## 5. 最佳实践

### 5.1 错误处理

```typescript
try {
  await ensureDbConnection();
  const userService = dbFactory.getService<User>('User');
  // 执行数据库操作
} catch (error) {
  console.error('数据库操作失败:', error);
  // 错误处理逻辑
}
```

### 5.2 性能优化

- 使用服务缓存

```typescript
// 服务实例会被缓存，无需重复创建
const userService = dbFactory.getService<User>('User');
```

- 批量操作

```typescript
// 批量创建
await userService.createMany([
  { name: '张三', email: 'zhangsan@example.com' },
  { name: '李四', email: 'lisi@example.com' }
]);

// 批量更新
await userService.updateMany(
  { age: { $lt: 20 } },
  { $set: { status: 'minor' } }
);
```

## 6. 注意事项

1. 确保在使用数据库操作前已初始化连接
2. 合理使用连接池，避免频繁创建连接
3. 及时处理数据库操作异常
4. 在应用关闭时正确断开数据库连接
5. 使用 TypeScript 类型定义确保类型安全
  
## 7. 环境配置

在 .env 文件中配置数据库连接信息：

```typescript
MONGO_URI=mongodb://localhost:27017/your-database
```

## 8. 调试与监控

```typescript
// 检查连接状态
console.log('数据库连接状态:', isDbInitialized());

// 监控连接事件
MongoClient.getInstance().on('connected', () => {
  console.log('数据库已连接');
});

MongoClient.getInstance().on('error', (error) => {
  console.error('数据库连接错误:', error);
});
```
