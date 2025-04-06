"use client";

import React, { useEffect, useRef, useState } from 'react';

// --- 配置 ---
// 你需要根据你的 WebSocket 服务器地址修改这里
// 建议使用环境变量，例如 .env.local: NEXT_PUBLIC_VIDEO_WS_URL=ws://your-server.com/video
const WEBSOCKET_URL = process.env.NEXT_PUBLIC_VIDEO_WS_URL || 'ws://localhost:8080/video';

// 开发/生产模式切换：设置为 true 使用普通 video 标签加载静态文件 (开发环境建议)
//                     设置为 false 使用 WebSocket + MSE 流式传输 (生产环境)
// 你也可以通过环境变量控制: NEXT_PUBLIC_USE_STATIC_VIDEO=true|false
const USE_STATIC_VIDEO = process.env.NEXT_PUBLIC_USE_STATIC_VIDEO 
  ? process.env.NEXT_PUBLIC_USE_STATIC_VIDEO === 'true'
  : process.env.NODE_ENV === 'development'; // 默认在开发环境中使用静态视频文件

// 静态视频文件路径 (仅在 USE_STATIC_VIDEO = true 时使用)
const STATIC_VIDEO_PATH = '/loome/bg-h264.mp4';
// --- --- ---

const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const queue = useRef<ArrayBuffer[]>([]); // 用于缓存服务器发送的初始数据块
  const hasSourceBufferBeenAdded = useRef(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true); // 用于显示静态视频加载状态

  // 使用静态视频模式 (开发环境)
  useEffect(() => {
    if (USE_STATIC_VIDEO) {
      console.log('使用静态视频模式，路径:', STATIC_VIDEO_PATH);
      setIsVideoLoading(true);
      
      const handleVideoLoad = () => {
        console.log('静态视频已加载');
        setIsVideoLoading(false);
      };
      
      const handleVideoError = (e: ErrorEvent) => {
        console.error('静态视频加载失败:', e);
        setError(`静态视频加载失败: ${e.message || '未知错误'}`);
        setIsVideoLoading(false);
      };
      
      if (videoRef.current) {
        videoRef.current.addEventListener('loadeddata', handleVideoLoad);
        videoRef.current.addEventListener('error', handleVideoError as EventListener);
        
        // 确保视频元素有正确的属性
        videoRef.current.src = STATIC_VIDEO_PATH;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        videoRef.current.loop = true; // 静态视频模式下可以启用循环播放
        
        try {
          videoRef.current.play().catch(err => {
            console.warn('自动播放可能失败:', err);
          });
        } catch (e) {
          console.warn('尝试播放视频时出错:', e);
        }
      }
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleVideoLoad);
          videoRef.current.removeEventListener('error', handleVideoError as EventListener);
          videoRef.current.pause();
          videoRef.current.removeAttribute('src');
          videoRef.current.load();
        }
      };
    }
  }, [USE_STATIC_VIDEO]); // 仅在 USE_STATIC_VIDEO 改变时重新运行

  // WebSocket + MSE 模式 (生产环境)
  // 处理接收到的 WebSocket 消息 (视频数据块)
  const handleWebSocketMessage = (event: MessageEvent) => {
    // ** 这里是关键的、需要你根据服务器实现来填充的部分 **
    // 假设服务器发送的是 ArrayBuffer 格式的视频块
    if (event.data instanceof ArrayBuffer) {
      const chunk = event.data;

      // --- MediaSource Extensions (MSE) 方案 ---
      // 这是推荐的方案，但需要服务器发送兼容MSE的格式 (包含初始化片段和媒体片段)
      if (sourceBufferRef.current && !sourceBufferRef.current.updating) {
        try {
          // console.log("Appending buffer chunk, size:", chunk.byteLength);
          sourceBufferRef.current.appendBuffer(chunk);
        } catch (e) {
          console.error('Error appending buffer:', e);
          setError(`处理视频数据块时出错: ${e instanceof Error ? e.message : String(e)}`);
          wsRef.current?.close(); // 发生严重错误时关闭连接
        }
      } else {
        // 如果 SourceBuffer 正在更新或尚未准备好，将数据块放入队列
        // console.log("Queueing buffer chunk, size:", chunk.byteLength);
        queue.current.push(chunk);
        // (可选) 可以检查队列长度，防止内存溢出
        if (queue.current.length > 50) { // 示例：限制队列长度
             console.warn("Video buffer queue is getting large.");
             // 可以考虑丢弃旧数据或断开连接
        }
      }
      // -------------------------------------------

      // --- Canvas 绘图方案 (备选) ---
      // 如果服务器发送的是解码后的帧图像 (如 base64编码的png)
      // 你需要一个 <canvas> 元素，并在这里解码和绘制图像
      // const canvas = canvasRef.current;
      // const ctx = canvas?.getContext('2d');
      // if (ctx && typeof event.data === 'string') {
      //   const image = new Image();
      //   image.onload = () => {
      //     ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      //   };
      //   image.src = event.data; // 假设是 base64 数据 URI
      // }
      // -------------------------------

    } else {
      console.warn('Received unexpected data format:', typeof event.data, event.data);
      // 根据服务器实现处理其他类型的数据 (例如 JSON 控制消息)
      // 例如，服务器可能会发送 "EOF" 表示流结束
       if (typeof event.data === 'string' && event.data === 'EOF') {
           if (mediaSourceRef.current && mediaSourceRef.current.readyState === 'open' && sourceBufferRef.current && !sourceBufferRef.current.updating) {
               console.log("Received EOF, ending MediaSource stream.");
               mediaSourceRef.current.endOfStream();
           } else {
               // 如果 buffer 还在更新，稍后尝试结束流
               const checkEndOfStream = setInterval(() => {
                   if (mediaSourceRef.current && mediaSourceRef.current.readyState === 'open' && sourceBufferRef.current && !sourceBufferRef.current.updating) {
                       console.log("Ending MediaSource stream after wait.");
                       mediaSourceRef.current.endOfStream();
                       clearInterval(checkEndOfStream);
                   } else if (!sourceBufferRef.current || mediaSourceRef.current?.readyState !== 'open') {
                        console.warn("Could not end stream, MediaSource/SourceBuffer state invalid.");
                        clearInterval(checkEndOfStream);
                   }
               }, 100);
           }
       }
    }
  };

  // 初始化 WebSocket 和 MediaSource
  useEffect(() => {
    // 如果使用静态视频模式，则跳过 WebSocket + MSE 初始化
    if (USE_STATIC_VIDEO) {
      return;
    }
    
    if (!videoRef.current || typeof window === 'undefined' || !window.MediaSource) {
      setError("浏览器不支持 MediaSource Extensions");
      return;
    }

    const currentVideoElement = videoRef.current;
    console.log("初始化 MediaSource...");
    setError(null);

    // --- MediaSource 设置 (如果采用 MSE 方案) ---
    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;
    const objectURL = URL.createObjectURL(mediaSource);
    currentVideoElement.src = objectURL;

    const onMediaSourceOpen = () => {
      console.log('MediaSource 已打开');
      // 撤销之前的 URL 以释放资源，因为我们已经将其赋给了 video.src
      URL.revokeObjectURL(objectURL);

      // **防止重复添加 SourceBuffer**
      if (hasSourceBufferBeenAdded.current) {
          console.warn("onMediaSourceOpen: SourceBuffer 已被添加，跳过重复添加。");
          return;
      }

      // **重要**: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' 这个 MIME 类型
      // **必须**与你的 bg.mp4 文件的实际编码完全匹配！你需要检查视频文件确认。
      // 可以使用工具如 ffprobe (ffprobe -v quiet -show_streams -select_streams v:0 bg.mp4)
      // 和 (ffprobe -v quiet -show_streams -select_streams a:0 bg.mp4) 来查看编码信息。
      // 常见的 H.264 baseline profile + AAC 音频组合如下，但请务必核实！
      const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'; // <--- 示例，必须正确设置!

      if (MediaSource.isTypeSupported(mimeCodec)) {

          // **标记即将添加 Buffer**
          hasSourceBufferBeenAdded.current = true; // <--- 在 try 之前标记
          console.log("标记 hasSourceBufferBeenAdded 为 true");

          try {
              console.log("即将添加 SourceBuffer，MediaSource state:", mediaSource.readyState, "Existing sourceBuffers:", mediaSource.sourceBuffers.length);
              const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
              sourceBufferRef.current = sourceBuffer;
              console.log('SourceBuffer 已添加，MediaSource state:', mediaSource.readyState, "New sourceBuffers:", mediaSource.sourceBuffers.length);

              // 监听 SourceBuffer 更新结束事件，以便处理队列中的数据
              const onUpdateEnd = () => {
                  if (queue.current.length > 0 && sourceBufferRef.current && !sourceBufferRef.current.updating) {
                      try {
                          // console.log("Appending buffer chunk from queue, size:", queue.current[0].byteLength);
                          sourceBufferRef.current.appendBuffer(queue.current.shift()!);
                      } catch (e) {
                          console.error('Error appending buffer from queue:', e);
                          setError(`处理队列中的视频数据时出错: ${e instanceof Error ? e.message : String(e)}`);
                          wsRef.current?.close();
                      }
                  } else if (queue.current.length === 0 && mediaSourceRef.current?.readyState === 'ended') {
                     // 如果队列为空且已收到 EOF，则可以认为流已完全处理
                     console.log("Buffer queue empty and stream ended.");
                  }
              };
              sourceBuffer.addEventListener('updateend', onUpdateEnd);

               // 在 MediaSource 和 SourceBuffer 准备好后才开始连接 WebSocket
              connectWebSocket();

          } catch (e) {
              console.error('添加 SourceBuffer 时出错:', e);
              setError(`不支持的视频编码或格式: ${mimeCodec} - ${e instanceof Error ? e.message : String(e)}`);
              // 如果添加失败，可能需要重置标记？取决于错误是否可恢复
              // hasSourceBufferBeenAdded.current = false;
          }
      } else {
          console.error(`不支持的 MIME 类型或编解码器: ${mimeCodec}`);
          setError(`浏览器不支持视频格式: ${mimeCodec}`);
           // 如果类型不支持，也应该认为没有成功添加
          // hasSourceBufferBeenAdded.current = false; // 这里重置可能意义不大，因为流程会中断
      }
    };

    mediaSource.addEventListener('sourceopen', onMediaSourceOpen);
    // --- ----------------------------------- ---

    const connectWebSocket = () => {
        console.log(`尝试连接到 WebSocket: ${WEBSOCKET_URL}`);
        wsRef.current = new WebSocket(WEBSOCKET_URL);
        wsRef.current.binaryType = 'arraybuffer'; // **重要**: 告诉 WebSocket 接收二进制数据为 ArrayBuffer

        wsRef.current.onopen = () => {
            console.log('WebSocket 连接已建立');
            setIsConnected(true);
            setError(null);
            // 连接建立后，可以向服务器发送请求开始传输的信令 (如果服务器需要)
            // wsRef.current?.send(JSON.stringify({ action: 'start_stream', file: 'bg.mp4' }));
        };

        wsRef.current.onmessage = handleWebSocketMessage;

        wsRef.current.onerror = (event) => {
            console.error('WebSocket 错误:', event);
            setError('WebSocket 连接出错');
            setIsConnected(false);
        };

        wsRef.current.onclose = (event) => {
            console.log(`WebSocket 连接已关闭: Code=${event.code}, Reason='${event.reason}', WasClean=${event.wasClean}`);
            setIsConnected(false);
            // 尝试结束 MediaSource 流，以防服务器异常关闭连接而未发送 EOF
            if (mediaSourceRef.current && mediaSourceRef.current.readyState === 'open' && sourceBufferRef.current && !sourceBufferRef.current.updating) {
                console.log("WebSocket closed, attempting to end MediaSource stream.");
                mediaSourceRef.current.endOfStream();
            }
            if (!event.wasClean && !error) { // 只有在之前没有设置错误时才设置这个错误
                setError('WebSocket 连接意外断开');
            }
            // 在这里可以根据需要实现重连逻辑
            // if (event.code !== 1000) { // 1000 是正常关闭
            //    setTimeout(connectWebSocket, 5000); // 5秒后尝试重连
            // }
        };
    };

    // 清理函数
    return () => {
      console.log('清理 VideoBackground 组件...');
      const currentWs = wsRef.current;
      const currentMediaSource = mediaSourceRef.current;
      const currentSourceBuffer = sourceBufferRef.current;
      // 使用 videoRef.current 而不是创建新的闭包变量，因为 videoRef 本身在 useEffect 作用域内是稳定的
      const currentVideo = videoRef.current;

      // 1. 关闭 WebSocket 连接
      if (currentWs) {
        console.log('关闭 WebSocket 连接');
        currentWs.onopen = null;
        currentWs.onmessage = null;
        currentWs.onerror = null;
        currentWs.onclose = null;
        if (currentWs.readyState === WebSocket.OPEN || currentWs.readyState === WebSocket.CONNECTING) {
            currentWs.close(1000, "Component unmounting"); // 使用正常关闭代码
        }
      }

      // 2. 清理 MediaSource 和 SourceBuffer
      if (currentMediaSource) {
        console.log("清理 MediaSource 相关资源...");
        // 移除事件监听器 (确保引用正确或在添加时保存引用)
        // 注意：sourceopen 可能在卸载前未触发，移除它可能不可靠或无效
        // currentMediaSource.removeEventListener('sourceopen', onMediaSourceOpen);

        // **关键：尝试移除 SourceBuffer (如果存在且 MediaSource 状态允许)**
        if (currentSourceBuffer && currentMediaSource.readyState === 'open') {
          try {
            console.log("尝试移除 SourceBuffer");
            // 移除 SourceBuffer 上的事件监听器 (需要保存函数引用才能正确移除)
            // currentSourceBuffer.removeEventListener('updateend', onUpdateEnd);
            currentMediaSource.removeSourceBuffer(currentSourceBuffer);
            console.log("SourceBuffer 已移除");
          } catch (e) {
            console.error("清理 SourceBuffer 时出错:", e);
          }
        } else {
           console.log("MediaSource 未打开或 SourceBuffer 不存在，跳过移除。 State:", currentMediaSource.readyState);
        }
      }

      // 3. 清理 Video 元素的 src 和加载
      if (currentVideo && currentVideo.src && currentVideo.src.startsWith('blob:')) {
        console.log("清理 MediaSource Object URL 并重置 video src");
        // 检查 MediaSource 状态，避免在非 open 状态 revoke (虽然通常影响不大)
        // if (currentMediaSource && currentMediaSource.readyState === 'open') {
        //    URL.revokeObjectURL(currentVideo.src); // 可能已在 sourceopen 时 revoke
        // }
        currentVideo.removeAttribute('src'); // 将 src 移除
        currentVideo.load(); // 告诉 video 元素停止加载当前资源
        console.log("已移除 video src 并停止加载");
      } else if (currentVideo) {
          // 如果 src 不是 blob URL (例如，在 HTTP 测试后)，也确保停止加载
          currentVideo.removeAttribute('src');
          currentVideo.load();
          console.log("已移除 video src (非 blob) 并停止加载");
      }


      // 4. 重置 Refs (放在最后)
      mediaSourceRef.current = null;
      sourceBufferRef.current = null; // <--- 确保重置
      wsRef.current = null;
      queue.current = [];
      hasSourceBufferBeenAdded.current = false; // <--- 重置标记
      console.log("清理完成");
    };
  }, [USE_STATIC_VIDEO]); // 依赖 USE_STATIC_VIDEO，确保在模式改变时重新运行

  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden bg-black"> {/* 添加黑色背景以防视频加载慢 */}
      {/*
        使用 <video> 元素配合 MediaSource Extensions (MSE)
        - muted: 背景视频通常需要静音
        - autoPlay: 尝试自动播放 (配合 MSE 可能需要用户交互才能开始，或在 sourceBuffer 添加数据后手动 play())
        - loop: 流式传输通常不直接循环 video 标签，循环逻辑需要在服务器端或客户端重新请求流
        - playsInline: 在移动设备上内联播放
      */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        muted
        autoPlay // 尝试自动播放
        playsInline
        // 如果使用静态视频模式，直接设置 src 和 loop 属性
        {...(USE_STATIC_VIDEO ? { src: STATIC_VIDEO_PATH, loop: true } : {})}
      >
        {/* 提供后备信息 */}
        你的浏览器不支持 HTML5 视频或 MediaSource Extensions。
      </video>

      {/* 加载指示器 - 针对 WebSocket 和静态视频模式分别处理 */}
      {!USE_STATIC_VIDEO && !isConnected && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white text-lg ml-3">正在连接视频流...</p>
        </div>
      )}
      
      {USE_STATIC_VIDEO && isVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white text-lg ml-3">正在加载视频...</p>
        </div>
      )}
      
      {/* 错误提示 - 两种模式通用 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-red-900 bg-opacity-80 text-red-100 p-4 rounded-lg shadow-lg max-w-md text-center">
            <h3 className="text-lg font-semibold mb-2">视频错误</h3>
            <p>{error}</p>
            {USE_STATIC_VIDEO && (
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md"
              >
                刷新页面
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* 开发模式提示 */}
      {USE_STATIC_VIDEO && !error && !isVideoLoading && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded">
          开发模式：使用静态视频
        </div>
      )}
    </div>
  );
};

export default VideoBackground; 