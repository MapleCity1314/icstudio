// 获取API基础URL
export const getBaseUrl = () => {
      if (typeof window !== 'undefined') {
            // 浏览器环境
            return '';
      }
      // 服务器环境
      if (process.env.VERCEL_URL) {
            return `https://${process.env.VERCEL_URL}`;
      }
      return `http://localhost:${process.env.PORT || 3000}`;
};
