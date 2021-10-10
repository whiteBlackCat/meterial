// Node.js Broadcast Server
var net = require('net');
var util = require('util');
var broadcastServer = net.createServer();
// Client Store
broadcastServer.clients = [];
// Clients Broadcast Method
net.Socket.prototype.broadcast = function(msg) {
  var clients = broadcastServer.clients;
  // 获得发佈广播的客户端在集閤中的下标
  var index = clients.indexOf(this);
  for (var i = clients.length - 1; i >= 0; --i) {
    if (i === index) {
      // 如果为发佈广播的客户端，则结束当前循环体
      continue;
    }
    currClient = clients[i];
    if (!currClient.destroyed) {
      currClient.write(
        util.format(
          '\r[Echo Client %s:%d] %s\nInput: ',
          currClient.remoteAddress, currClient.remotePort, msg)
      );
    }
  }
};
// A new client connected
broadcastServer.on('connection', function(client) {
  broadcastServer.clients.push(client);
  // Welcome
  client.write('[Broadcast Server] Welcome!\nInput:');
  client.broadcast(client, 'Joined!');
  // Message handle
  client.on('data', function(msg) {
    client.broadcast(msg);
    client.write('\rInput:');
  });
  // Disconnect handle
  client.on('end', function() {
    client.broadcast('Left!');
  })
});
// Bind
broadcastServer.listen(8080, function() {
  console.log('Broadcast Server bound.');
});
// 这段代码基於 node.js 的net模块实现了一个 broadcast server，
//  在其中的broadcast方法中， 我们使用了continue语句， 
//  用以实现将信息向除发佈广播的客户端外的所有已建立连接的客户端。
// 代码内容相当简单， 当某一客户端需要向其他客户端发佈广播时， 
// 则调用该客户端所对应client对象的broadcast方法， 在broadcast方法中，
//  程序会先获取当前客户端在以缓存的客户端 socket 集合中的位置下标，
//   然后对所有客户端 socket 进行循环发佈， 当循环计数器来到之前获得的位置下标，
//    则跳过当前循环体中的逻辑代码， 继续下一个循环。