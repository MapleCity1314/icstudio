import redis from "./redis";

/**
 * @description 发布订阅，socket相关
 */


export function publishComment(postId: string, comment: object) {
      redis.publish(`post:${postId}`, JSON.stringify(comment));
}

export function subscribeComment(postId: string, callback: (message: string) => void) {
      redis.subscribe(`post:${postId}`, (err, count) => {
            if (err) {
                  console.error("订阅失败", err);
            } else {
                  console.log(`成功订阅${count}个频道`);
            }
      });
      
      // 添加消息处理器来接收消息
      redis.on('message', (channel, message) => {
            if (channel === `post:${postId}`) {
                  callback(message);
            }
      });
}
