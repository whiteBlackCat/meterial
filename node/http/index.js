// 1、引入http模块   
var http = require('http')
// 2、创建服务请求  
var sever = http.creatSever(function (req, res) { });//收到客户端http请求时触发  参数：请求  响应
// req.url  请求的路径信息   req.method      res.write()返回数据   res.end()断开连接  
// 3、监听服务端口（知名端口 80 不可监听）   端口号（越大占用率月底）  回调初始化
sever.listen(8080, function () { })

// http请求 gzip压缩
var zlib = require('zlib');
var http = require('http');
var fs = require('fs');
var request = http.get({
  host: 'homeway.me',
  path: '/',
  port: 80,
  headers: { 'accept-encoding': 'gzip,deflate' }
});
request.on('response', function (response) {
  var output = fs.createWriteStream('izs.me_index.html');
  switch (response.headers['content-encoding']) {
    // or, just use zlib.createUnzip() to handle both cases
    case 'gzip':
      response.pipe(zlib.createGunzip()).pipe(output);
      break;
    case 'deflate':
      response.pipe(zlib.createInflate()).pipe(output);
      break;
    default:
      response.pipe(output);
      break;
  }
});

// 非管道压缩  区别?
var http = require('http'),
  querystring = require('querystring'),
  zlib = require('zlib');
var args = {
  //参数以及备用数据
  contents: querystring.stringify({
    //发包的信息
    name: 'homeway.me',
  }),
};
var options = {
  hostname: 'homeway.me',
  port: 80,
  path: '/',
  method: 'GET',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Content-Length': args.contents.length,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.11 Safari/537.36',
    'Accept-Encoding': 'gzip, deflate',
  },
};
var get = function (options, args, callback) {
  var req = http.request(options, function (res) {
    var chunks = [], data, encoding = res.headers['content-encoding'];
    // 非gzip/deflate要转成utf-8格式
    if (encoding === 'undefined') {
      res.setEncoding('utf-8');
    }
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });
    res.on('end', function () {
      var buffer = Buffer.concat(chunks);
      if (encoding == 'gzip') {
        zlib.gunzip(buffer, function (err, decoded) {
          data = decoded.toString();
          callback(err, args, res.headers, data);
        });
      } else if (encoding == 'deflate') {
        zlib.inflate(buffer, function (err, decoded) {
          data = decoded.toString();
          callback(err, args, res.headers, data);
        });
      } else {
        data = buffer.toString();
        callback(null, args, res.headers, data);
      }
    });
  });
  req.write(args.contents);
  req.end();
};
get(options, args, function (err, args, headers, data) {
  console.log('==>header \n', headers);
  console.log('==data \n', data);
});
