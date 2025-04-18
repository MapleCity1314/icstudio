import mongoose, { Connection, ConnectOptions } from "mongoose";

/**
 * MongoDB客户端单例类
 * @description 管理MongoDB连接的单例类，确保整个应用只有一个数据库连接实例
 */
class MongoClient {
    private static instance: Connection;
    private static isConnecting: boolean = false;
    private static connectionPromise: Promise<Connection> | null = null;

    private constructor() {}

    /**
     * 获取MongoDB连接实例
     * @returns MongoDB连接实例
     */
    public static getInstance(): Connection {
        if (!MongoClient.instance) {
            throw new Error("MongoDB尚未连接，请先调用connect方法");
        }
        return MongoClient.instance;
    }

    /**
     * 检查MongoDB连接状态
     * @returns 是否已连接
     */
    public static isConnected(): boolean {
        return !!MongoClient.instance && MongoClient.instance.readyState === 1;
    }

    /**
     * 异步连接到MongoDB
     * @param uri MongoDB连接URI，如未提供则使用环境变量
     * @param options MongoDB连接选项
     * @returns MongoDB连接实例
     * @throws 连接失败时抛出异常
     */
    public static async connect(
        uri?: string, 
        options?: ConnectOptions
    ): Promise<Connection> {
        if (MongoClient.isConnected()) {
            return MongoClient.instance;
        }

        if (MongoClient.isConnecting && MongoClient.connectionPromise) {
            return MongoClient.connectionPromise;
        }

        const connectionUri = uri || process.env.MONGO_URI;
        if (!connectionUri) {
            throw new Error("未提供MongoDB连接URI，请传入uri参数或设置MONGO_URI环境变量");
        }

        MongoClient.isConnecting = true;
        MongoClient.connectionPromise = mongoose.connect(connectionUri, {
            ...options,
            retryWrites: true,
            serverSelectionTimeoutMS: 5000,
        }).then((connection) => {
            console.log("MongoDB连接成功");
            MongoClient.instance = connection.connection;
            MongoClient.isConnecting = false;
            return MongoClient.instance;
        }).catch((error) => {
            MongoClient.isConnecting = false;
            console.error("MongoDB连接失败：", error);
            throw error;
        });

        return MongoClient.connectionPromise;
    }

    /**
     * 断开MongoDB连接
     */
    public static async disconnect(): Promise<void> {
        if (MongoClient.instance) {
            await mongoose.disconnect();
            console.log("MongoDB连接已断开");
            MongoClient.instance = null as unknown as Connection;
        }
    }

    /**
     * 重新连接MongoDB
     * @returns MongoDB连接实例
     */
    public static async reconnect(): Promise<Connection> {
        await MongoClient.disconnect();
        return MongoClient.connect();
    }
}

export default MongoClient;
