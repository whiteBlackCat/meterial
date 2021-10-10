const dgram = require('dgram');
// 创建 dgram.Socket 类
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`服务器异常：\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`服务器接收到来自 ${rinfo.address}:${rinfo.port} 的 ${msg}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`服务器监听 ${address.address}:${address.port}`);
});

server.bind(41234);
// 服务器监听 0.0.0.0:41234

// socket.addMembership(multicastAddress[, multicastInterface])
// 通知内核将 multicastAddress 和 multicastInterface 提供的多路传送集合通过 IP_ADD_MEMBERSHIP 这个 socket 选项结合起来。 若 multicastInterface 参数未指定，则操作系统将会选择一个接口并向其添加成员
// 当多个 cluster 工作进程之间共享 UDP socket 时，则 socket.addMembership() 函数必须只能被调用一次，否则将会发生 EADDRINUSE 错误

// socket.address()    包含 socket 地址信息的对象
// socket.bind([port][, address][, callback])
// socket.send(msg[, offset, length][, port][, address][, callback])
// msg <Buffer> | <Uint8Array> | <string> | <Array> 要发送的消息。
// offset <integer> 指定消息的开头在 buffer 中的偏移量。
// length <integer> 消息的字节数。
// port <integer> 目标端口。
// address <string> 目标主机名或 IP 地址。