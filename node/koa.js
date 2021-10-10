// 验证公众号
'use strict'
var Koa = require('koa');
var sha1 = require('sha1');

var config = {
  wechat: {
    appID: '...', //填写你自己的appID
    appSecret: '...', //填写你自己的appSecret
    token: '...' //填写你自己的token  
  }
};

var app = new Koa();

app.use(function* (next) {
  var token = config.wechat.token;
  var signature = this.query.signature;
  var nonce = this.query.nonce;
  var timestamp = this.query.timestamp;
  var echostr = this.query.echostr;
  var str = [token, timestamp, nonce].sort().join(''); //按字典排序，拼接字符串
  var sha = sha1(str); //加密
  this.body = (sha === signature) ? echostr + '' : 'failed'; //比较并返回结果
});
app.listen(8080);



const Koa = require('koa')
const app = new Koa()

// 中间件
// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response
app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(3000)

/*
首先请求流通过 x-response-time 和 logging 中间件来请求何时开始，然后继续移交控制给 response 中间件。当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。
*/

// app.env 默认是 NODE_ENV 或 "development"
// app.proxy 当真正的代理头字段将被信任时
// app.subdomainOffset 对于要忽略的 .subdomains 偏移[2]
// app.keys 设置签名的 Cookie 密钥
// app.context  ctx 的原型

// 在其低级中间件层中提供高级“语法糖” 如：
// app.listen(3000);  等价于
// http.createServer(app.callback()).listen(3000); 这里http还可使用https模块

// stderr
// app.on('error', err => {
//   log.error('server error', err)
// });

// ctx.request; // 这是 koa Request
// ctx.response; // 这是 koa Response
// ctx.req  Node 的 request 对象.
// ctx.res  Node 的 response 对象. 不支持绕过 Koa 的 response 处理如：res.write/res.end
// ctx.state 通过中间件传递信息和你的前端视图
// ctx.cookies.get(name, [options])
// ctx.cookies.set(name, value, [options])
// ctx.throw([status], [msg], [properties])
// 别名属性，来自request及response 