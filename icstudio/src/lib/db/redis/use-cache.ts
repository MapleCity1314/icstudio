import redis from "./redis";

export async function getFromCache(key: string) {
      try {
            const data = await redis.get(key);
            if (data) {
                  return JSON.parse(data);
            }
            return null;
      } catch (error: unknown) {
            console.error("redis读取数据异常：", error);
      }
}

//添加缓存
export async function addToCache(key: string, data: object, duration?: number) {
      try {
            if (!duration) {
                  duration = 60 * 60;
            }
            await redis.set(key, JSON.stringify(data), "EX", duration);
      } catch (error: unknown) {
            console.error("redis写入数据异常", error);
      }
}
