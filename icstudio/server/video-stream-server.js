const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORT = process.env.WS_PORT || 8080;
const videoPath = path.join(process.cwd(), 'public', 'loome', 'bg-h264.mp4');

// 检查视频文件是否存在
if (!fs.existsSync(videoPath)) {
  console.error(`错误：视频文件未找到于 ${videoPath}`);
  console.error('请确保 public/loome/bg.mp4 文件存在。');
  process.exit(1); // 退出进程
}

const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket 视频流服务器正在监听端口 ${PORT}`);
console.log(`将要串流的文件: ${videoPath}`);

wss.on('connection', (ws) => {
  console.log('客户端已连接');

  // --- 基本的文件分块流式传输 --- 
  // **警告**: 这种简单的分块方式很可能与客户端的 MediaSource Extensions (MSE) 不兼容。
  // MSE 需要首先接收到 MP4 的初始化片段 (moov atom)。
  // 一个健壮的实现需要解析 MP4 或使用特定库 (如 fluent-ffmpeg) 来正确分块。
  const readStream = fs.createReadStream(videoPath);

  let bytesSent = 0;

  // 当有数据块可读时触发
  readStream.on('data', (chunk) => {
    // 确保客户端连接仍然打开
    if (ws.readyState === WebSocket.OPEN) {
      // console.log(`发送数据块，大小: ${chunk.length} bytes`);
      ws.send(chunk, (err) => {
        if (err) {
          console.error('发送数据块时出错:', err);
          // 出错时可能需要停止流
          readStream.destroy(); 
        }
      });
      bytesSent += chunk.length;
    } else {
      // 如果客户端已关闭连接，停止读取流
      console.log('客户端在传输过程中断开连接，停止发送。');
      readStream.destroy();
    }
  });

  // 当文件读取完成时触发
  readStream.on('end', () => {
    console.log(`文件传输完成，总共发送: ${bytesSent} bytes`);
    // （可选）发送一个结束信号给客户端
    if (ws.readyState === WebSocket.OPEN) {
       try {
           ws.send('EOF'); // 与客户端 VideoBackground 组件中的处理匹配
           console.log("已发送 EOF 信号");
       } catch (e) {
           console.error("发送 EOF 时出错:", e);
       }
    }
    // 文件结束后，可以选择关闭连接，或等待客户端关闭
    // ws.close(); 
  });

  // 当读取文件发生错误时触发
  readStream.on('error', (err) => {
    console.error('读取文件时出错:', err);
    if (ws.readyState === WebSocket.OPEN) {
      // 通知客户端发生了错误
      ws.send(JSON.stringify({ error: '无法读取视频文件' }), () => {
         ws.close(1011, '服务器内部错误'); // 1011: Internal Error
      });
    } 
  });

  // 当客户端断开连接时触发
  ws.on('close', () => {
    console.log('客户端已断开连接');
    // 确保文件流被销毁，释放资源
    if (!readStream.destroyed) {
        console.log("销毁文件读取流...");
        readStream.destroy();
    }
  });

  // 当 WebSocket 连接发生错误时触发
  ws.on('error', (err) => {
    console.error('WebSocket 连接错误:', err);
    // 同样需要确保文件流被销毁
     if (!readStream.destroyed) {
        console.log("因 WebSocket 错误销毁文件读取流...");
        readStream.destroy();
    }
  });
});

wss.on('error', (error) => {
    console.error('WebSocket 服务器错误:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`端口 ${PORT} 已被占用。请尝试使用不同的端口。`);
        console.error('你可以通过设置 WS_PORT 环境变量来指定端口，例如: WS_PORT=8081 node server/video-stream-server.js');
    } else {
        // 处理其他可能的服务器启动错误
    }
}); 