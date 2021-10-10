// Agent 类
// 负责管理 HTTP 客户端的连接持久性和重用
// keepAlive <boolean> 即使没有未完成的请求，也要保持套接字，这样它们就可以被用于将来的请求而无需重新建立 TCP 连接。 不要与 Connection 请求头的 keep-alive 值混淆。 Connection: keep-alive 请求头始终在使用代理时发送，除非明确指定 Connection 请求头、或者 keepAlive 和 maxSockets 选项分别设置为 false 和 Infinity，在这种情况下将会使用 Connection: close。 默认值: false。
// keepAliveMsecs <number> 当使用 keepAlive 选项时，指定用于 TCP Keep-Alive 数据包的初始延迟。当 keepAlive 选项为 false 或 undefined 时则忽略。默认值: 1000。
// maxSockets <number> 每个主机允许的套接字的最大数量。默认值: Infinity。
// maxFreeSockets <number> 在空闲状态下保持打开的套接字的最大数量。仅当 keepAlive 被设置为 true 时才相关。默认值: 256。
// timeout <number> 套接字的超时时间，以毫秒为单位。这会在套接字被连接之后设置超时时间。

// agent.createConnection(options[, callback])
// 生成用于 HTTP 请求的套接字或流

// agent.keepSocketAlive(socket)


const http = require('http');
const net = require('net');
const { URL } = require('url');

// 创建 HTTP 隧道代理。
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('响应内容');
});
proxy.on('connect', (req, cltSocket, head) => {
  // 连接到原始服务器。
  const { port, hostname } = new URL(`http://${req.url}`);
  const srvSocket = net.connect(port || 80, hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
});

// 代理正在运行。
proxy.listen(1337, '127.0.0.1', () => {

  // 向隧道代理发出请求。
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'nodejs.cn:80'
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('已连接');

    // 通过 HTTP 隧道发出请求。
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: nodejs.cn:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});