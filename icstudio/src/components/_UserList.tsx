import React, { useEffect, useState, useCallback } from 'react';
import { useDB, DBConnectionStatus } from '@/hooks/use-db';
import { userSchema, USER_MODEL_NAME, IUser, UserRole, UserStatus } from '@/lib/db/schema/user';

/**
 * 用户列表组件
 * @description 展示如何使用useDB钩子操作MongoDB
 */
export const UserList: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Partial<IUser>>({
    username: '',
    email: '',
    passwordHash: '',
    role: UserRole.USER,
    status: UserStatus.ACTIVE
  });

  // 使用数据库钩子
  const {
    connectionStatus,
    error: dbError,
    registerSchema,
    createDocument,
    findDocuments,
    updateDocumentById,
    deleteDocumentById
  } = useDB();

  // 注册用户Schema
  useEffect(() => {
    registerSchema(USER_MODEL_NAME, userSchema);
  }, [registerSchema]);

  // 加载用户列表
  const loadUsers = useCallback(async () => {
    if (connectionStatus !== DBConnectionStatus.CONNECTED) return;

    setLoading(true);
    setError(null);

    try {
      const response = await findDocuments<IUser>(USER_MODEL_NAME, {});
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error?.toString() || '加载用户失败');
      }
    } catch (err) {
      console.error('加载用户列表失败', err);
      setError('加载用户列表时发生错误');
    } finally {
      setLoading(false);
    }
  }, [connectionStatus, findDocuments]);

  // 创建新用户
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.username || !newUser.email || !newUser.passwordHash) {
      setError('请填写所有必填字段');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createDocument<IUser>(USER_MODEL_NAME, newUser);
      
      if (response.success && response.data) {
        // 重置表单
        setNewUser({
          username: '',
          email: '',
          passwordHash: '',
          role: UserRole.USER,
          status: UserStatus.ACTIVE
        });
        
        // 重新加载用户列表
        loadUsers();
      } else {
        setError(response.error?.toString() || '创建用户失败');
      }
    } catch (err) {
      console.error('创建用户失败', err);
      setError('创建用户时发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 更新用户状态
  const handleUpdateUserStatus = async (userId: string, newStatus: UserStatus) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateDocumentById<IUser>(
        USER_MODEL_NAME,
        userId,
        { $set: { status: newStatus } }
      );
      
      if (response.success) {
        // 重新加载用户列表
        loadUsers();
      } else {
        setError(response.error?.toString() || '更新用户状态失败');
      }
    } catch (err) {
      console.error('更新用户状态失败', err);
      setError('更新用户状态时发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('确定要删除此用户吗？')) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await deleteDocumentById<IUser>(USER_MODEL_NAME, userId);
      
      if (response.success && response.data) {
        // 重新加载用户列表
        loadUsers();
      } else {
        setError(response.error?.toString() || '删除用户失败');
      }
    } catch (err) {
      console.error('删除用户失败', err);
      setError('删除用户时发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  // 连接成功后加载用户
  useEffect(() => {
    if (connectionStatus === DBConnectionStatus.CONNECTED) {
      loadUsers();
    }
  }, [connectionStatus, loadUsers]);

  // 渲染不同的连接状态
  if (connectionStatus === DBConnectionStatus.CONNECTING) {
    return <div className="loading">连接数据库中...</div>;
  }

  if (connectionStatus === DBConnectionStatus.ERROR) {
    return <div className="error">数据库连接错误: {dbError?.message}</div>;
  }

  if (connectionStatus === DBConnectionStatus.DISCONNECTED) {
    return <div className="error">数据库未连接</div>;
  }

  return (
    <div className="user-management">
      <h1>用户管理</h1>
      
      {/* 错误提示 */}
      {error && <div className="error-message">{error}</div>}

      {/* 新建用户表单 */}
      <div className="user-form">
        <h2>创建新用户</h2>
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label htmlFor="username">用户名:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">邮箱:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordHash">密码:</label>
            <input
              type="password"
              id="passwordHash"
              name="passwordHash"
              value={newUser.passwordHash}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">角色:</label>
            <select
              id="role"
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
            >
              <option value={UserRole.ADMIN}>管理员</option>
              <option value={UserRole.USER}>普通用户</option>
              <option value={UserRole.GUEST}>访客</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>创建用户</button>
        </form>
      </div>

      {/* 用户列表 */}
      <div className="user-list">
        <h2>用户列表</h2>
        {loading ? (
          <div className="loading">加载中...</div>
        ) : users.length === 0 ? (
          <div className="empty-list">暂无用户</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>用户名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="actions">
                      {user.status === UserStatus.ACTIVE ? (
                        <button 
                          onClick={() => handleUpdateUserStatus(user._id, UserStatus.INACTIVE)}
                          className="btn-deactivate"
                        >
                          停用
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUpdateUserStatus(user._id, UserStatus.ACTIVE)}
                          className="btn-activate"
                        >
                          激活
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="btn-delete"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .user-management {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        h1, h2 {
          color: #333;
        }

        .loading, .error, .empty-list {
          padding: 20px;
          text-align: center;
          border-radius: 4px;
          margin: 20px 0;
        }

        .loading {
          background-color: #f0f0f0;
        }

        .error, .error-message {
          background-color: #ffe6e6;
          color: #d8000c;
          padding: 10px;
          margin: 10px 0;
          border-radius: 4px;
        }

        .empty-list {
          background-color: #f9f9f9;
          color: #666;
        }

        .user-form {
          margin-bottom: 30px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        input, select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        button {
          padding: 10px 15px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .btn-activate {
          background-color: #4caf50;
        }

        .btn-deactivate {
          background-color: #ff9800;
        }

        .btn-delete {
          background-color: #f44336;
        }
      `}</style>
    </div>
  );
}; 