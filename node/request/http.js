

/**
 * 本地server服务  同类似有express，kao，http-server、
 * 创建服务：
 * var http = http.createServer(func(request,response)) 
 * 				request.on('data', function (chunk) {}  data事件缓存数据
 * 				request.on('end', function () {} end事件处理数据
 * 				response.write(chunk); 向响应写入数据
 * 				response.writeHead(200, { 'Content-Type': 'text-plain' }); 响应头 添加Content-Length字段后不再采用默认的chunk方式传输
 * 				response.end('response ' + chunk)  向响应传入数据
  http.listen(port)监听特定端口   
  http.request(opt,func(res))  opt内有hostname及path组成url
    .write(data) 穿入请求体   .end()结束（发起请求？）
 * 
 */
http.createServer(function (req, resp) {
  if (req.url === '/doodle.png') {
    if (req.method === 'PUT') {
      req.pipe(request.put('http://mysite.com/doodle.png'))
    } else if (req.method === 'GET' || req.method === 'HEAD') {
      request.get('http://mysite.com/doodle.png').pipe(resp)
    }
  }
})

/**
 * https服务：
 *  https.createServer({key,cert})  增加公钥，私钥  rejectUnauthorized: false 不进行证书有效性检测（证书自制？）
 * SNI技术：根据HTTPS客户端请求使用的域名动态使用不同的证书
 * server.addContext('foo.com', {
    key: fs.readFileSync('./ssl/foo.com.key'),
    cert: fs.readFileSync('./ssl/foo.com.cer')
});
 *
 * zlib模块：
 * gzip，gunzip  判断是否需要在使用相应功能
 *
 * Net模块：可以创建Socket服务器或Socket客户端
 * net.createServer(function (conn) {
    conn.on('data', function (data) {
        conn.write([
            'HTTP/1.1 200 OK',
            'Content-Type: text/plain',
            'Content-Length: 11',
            '',
            'Hello World'
        ].join('\n'));
    });
}).listen(80);
使用上与http模块类似，data事件是一次性的没有end事件

  URL模块：
  parse；将url字符转换url对象  二参解析querry  三参跳过协议
  format：与parse相反
  resolve：拼接url

  querystring模块：
  parse；参数字符串转为参数对象
  stringify：参数对象转为参数字符串
 *
 */