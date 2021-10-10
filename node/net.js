// 创建基于流的 TCP 或 IPC 的服务器（net.createServer()）与客户端（net.createConnection()）
const net = require('net');
// 识别路径
// path 是文件系统路径名。 它被截断为 sizeof(sockaddr_un.sun_path) - 1 的长度
// 路径必须是以 \\?\pipe\ 或 \\.\pipe\ 为入口
// net.createServer().listen(path.join('\\\\?\\pipe', process.cwd(), 'myctl'));

// new net.Server([options][, connectionListener])
// options <Object> 参阅 net.createServer([options][, connectionListener])。
// connectionListener <Function> 自动设置为 'connection' 事件的监听器。
// close、connection、error、listening

// server.address()
// 返回操作系统报告的绑定的 address、地址 family 名称、以及服务器 port
// 不要在 'listening' 事件触发之前调用 server.address()。

// server.getConnections(callback)
// 异步获取服务器的当前并发连接数

// server.listen()
// 启动一个服务器来监听连接
// erver.listen(handle[, backlog][, callback])
// server.listen(options[, callback])
// server.listen(path[, backlog][, callback]) 用于 IPC 服务器。
// server.listen([port[, host[, backlog]]][, callback]) 用于 TCP 服务器。
// 当且仅当上次调用 server.listen() 发生错误或已经调用 server.close() 时，才能再次调用 server.listen() 方法。否则将抛出 ERR_SERVER_ALREADY_LISTEN 错误。
// 监听时最常见的错误之一是 EADDRINUSE。 这是因为另一个服务器已正在监听请求的 port/path/handle。 处理此问题的一种方法是在一段时间后重试：
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('地址正被使用，重试中...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});

// server.unref()
// 如果这个 server 在事件系统中是唯一有效的，那么对 server 调用 unref() 将允许程序退出


// new net.Socket([options])
// fd <number> 如果指定了该参数，则使用一个给定的文件描述符包装一个已存在的 socket，否则将创建一个新的 socket。
// allowHalfOpen <boolean> 指示是否允许半打开的 TCP 连接。详情查看 net.createServer() 和 'end' 事件。默认值: false。
// readable <boolean> 当传递了 fd 时允许读取 socket，否则忽略。默认值: false。
// writable <boolean> 当传递了 fd 时允许写入 socket，否则忽略。默认值: false。
// 创建一个 socket 对象
// close、connect、data、drain、end、error、lookup、ready、timeout

// net.createConnection()
// 一个用于创建 net.Socket 的工厂函数，立即使用 socket.connect() 初始化链接，然后返回启动连接的 net.Socket
// net.createServer([options][, connectionListener])
// allowHalfOpen <boolean> 表明是否允许半开的 TCP 连接。默认值: false。
// pauseOnConnect <boolean> 表明是否应在传入连接上暂停套接字。默认值: false。
// const net = require('net');
// const server = net.createServer((c) => {
//   // 'connection' 监听器。
//   console.log('客户端已连接');
//   c.on('end', () => {
//     console.log('客户端已断开连接');
//   });
//   c.write('你好\r\n');
//   c.pipe(c);
// });
// server.on('error', (err) => {
//   throw err;
// });
// server.listen(8124, () => {
//   console.log('服务器已启动');
// });