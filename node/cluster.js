//  为了充分利用多核系统，有时需要启用一组 Node.js 进程去处理负载任务。
// cluster 模块可以创建共享服务器端口的子进程
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是 HTTP 服务器。
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('你好世界\n');
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}

// 同文件多个子进程，有基本的子进程事件
// 事件：online
// exitedAfterDisconnect 由于 .kill() 或 .disconnect() 而退出，则此属性为 true。 如果工作进程以任何其他方式退出，则为 false。 如果工作进程尚未退出，则为 undefined
// id,isConnected(),isDead(),process
// 主进程
// disconnect([callback]) 当所有子进程断开时调用
// fork([env]) 环境变量添加到进程
// isMaster 判断当前是否主进程
// worker