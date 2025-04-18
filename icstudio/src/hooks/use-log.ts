/**
 * @description 日志hooks
 * @author maplecity 1314
 * @date 2025-04-18
 */

import { useEffect, useState } from "react";

// 日志接口定义
export interface ILogItem {
  id: string;
  name: string;
  time: string;
  event: string;
  content: string;
}

export const useLog = () => {
  const [logs, setLogs] = useState<ILogItem[]>([]);

  // 单例模式
  class Log {
    private static instance: Log;
    private logItems: ILogItem[] = [];
    private listeners: ((logs: ILogItem[]) => void)[] = [];

    private constructor() {}

    public static getInstance(): Log {
      if (!Log.instance) {
        Log.instance = new Log();
      }
      return Log.instance;
    }

    // 添加日志
    public log(logItem: Omit<ILogItem, "id" | "time"> & { id?: string, time?: string }): string {
      const id = logItem.id || Date.now().toString();
      const time = logItem.time || new Date().toISOString();
      
      const newLog: ILogItem = {
        id,
        name: logItem.name,
        time,
        event: logItem.event,
        content: logItem.content
      };
      
      this.logItems.push(newLog);
      this.notifyListeners();
      return id;
    }

    // 批量添加日志
    public bulkLog(items: Array<Omit<ILogItem, "id" | "time"> & { id?: string, time?: string }>): string[] {
      const ids: string[] = [];
      
      items.forEach(item => {
        ids.push(this.log(item));
      });
      
      return ids;
    }

    // 删除日志
    public removeLog(id: string): boolean {
      const initialLength = this.logItems.length;
      this.logItems = this.logItems.filter(log => log.id !== id);
      
      if (initialLength !== this.logItems.length) {
        this.notifyListeners();
        return true;
      }
      
      return false;
    }

    // 清空所有日志
    public clearLogs(): void {
      this.logItems = [];
      this.notifyListeners();
    }

    // 获取所有日志
    public getLogs(): ILogItem[] {
      return [...this.logItems];
    }

    // 获取指定名称的日志
    public getLogsByName(name: string): ILogItem[] {
      return this.logItems.filter(log => log.name === name);
    }

    // 获取指定事件的日志
    public getLogsByEvent(event: string): ILogItem[] {
      return this.logItems.filter(log => log.event === event);
    }

    // 添加监听器
    public addListener(listener: (logs: ILogItem[]) => void): () => void {
      this.listeners.push(listener);
      
      // 返回移除监听器的函数
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }

    // 通知所有监听器
    private notifyListeners(): void {
      this.listeners.forEach(listener => listener([...this.logItems]));
    }
  }

  // 获取日志实例
  const logInstance = Log.getInstance();

  // 组件挂载时添加监听器，卸载时移除
  useEffect(() => {
    const unsubscribe = logInstance.addListener((updatedLogs) => {
      setLogs(updatedLogs);
    });
    
    // 组件卸载时清理
    return () => {
      unsubscribe();
    };
  }, []);

  
  return {
    logs,
    addLog: (name: string, event: string, content: string) => 
      logInstance.log({ name, event, content }),
    removeLog: (id: string) => logInstance.removeLog(id),
    clearLogs: () => logInstance.clearLogs(),
    getLogsByName: (name: string) => logInstance.getLogsByName(name),
    getLogsByEvent: (event: string) => logInstance.getLogsByEvent(event)
  };
};