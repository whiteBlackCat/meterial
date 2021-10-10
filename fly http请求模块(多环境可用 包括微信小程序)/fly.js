/**
 * 支持程度:
 * 浏览器:IE8+,Node.js,微信小程序,Weex,React Native,Quick App
 * 
 * 特点:
 * Promise API,轻量,多种JavaScript环境,请求/响应拦截器,自动转JSON数据,
 * 可切换底层Http Engine,浏览器可全局拦截Ajax,嵌入App时http请求可转发Native.直接请求图片
 * 
 * 安装:
 * npm: npm install flyio
 * CDN: <script src="https://unpkg.com/flyio/dist/fly.min.js"></script>
 * UMD: https://unpkg.com/flyio/dist/umd/fly.umd.min.js
 * 
 * 引入:主要是路径区别
 * 浏览器及React Native:"flyio/dist/npm/fly"  Node:"flyio/src/node"  微信:"flyio/dist/npm/wx"
 * weex:"flyio/dist/npm/weex"
 * 
 * 请求:
 * fly.get[|post]('/user?id=133',data).then().catch()
 * 并发:fly.all([f1,f2]).then(fly.spread((r1,r2)=>{})).catch()
 * request:fly.request(url,data,config) config:{method,timeout}
 * 
 * URLSearchParams: 注意兼容
 * (new URLSearchParams()).append(key,value) => data
 * 
 * FormData: 注意兼容  使用同上
 * 
 * 二进制数据:
 * fly.get("/Fly/v.png",null,{ responseType:"arraybuffer" ).then(d=>{ //d.data 为ArrayBuffer实例 })
 * responseType:"blob"/"arraybuffer"  node下设置'stream'
 * 
 * 拦截器:
//添加请求拦截器
fly.interceptors.request.use((request)=>{
  //给所有请求添加自定义header
  request.headers["X-Tag"]="flyio";
    //打印出请求体
    console.log(request.body)
    //终止请求
    //var err=new Error("xxx")
    //err.request=request
    //return Promise.reject(new Error(""))

  //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
      //只将请求结果的data字段返回
      return response.data
  },
  (err) => {
      //发生网络错误后会走到这里
      //return Promise.resolve("ssss")
  }
)
 * 请求拦截器中的request对象结构如下:
{
  baseURL,  //请求的基地址
  body, //请求的参数
  headers, //自定义的请求头
  method, // 请求方法
  timeout, //本次请求的超时时间
  url, // 本次请求的地址
  withCredentials //跨域请求是否发送第三方cookie
}
 * 响应拦截器中的response对象结构如下：
{
  data, //服务器返回的数据
  engine, //请求使用的http engine(见下面文档),浏览器中为本次请求的XMLHttpRequest对象
  headers, //响应头信息
  request  //本次响应对应的请求信息
}
 * 移除拦截器
 * fly.interceptors.request.use(null)
 * fly.interceptors.response.use(null,null)
 * 
 * catch捕获的err对象:
{
  message:"Not Find 404", //错误消息
  status:404, //如果服务器可通，则为http请求状态码。网络异常时为0，网络超时为1  文件下载成功，但保存失败为2，此错误只出现node环境下
  request:{...}, //对应的请求信息
  response:{}, //响应信息
  engine:{}//请求使用的http engine(见下面文档),浏览器中为本次请求的XMLHttpRequest对象
}

 * 配置选项
{
  headers:{}, //http请求头，
  baseURL:"", //请求基地址
  timeout:0,//超时时间，为0时则无超时限制
  //是否自动将Content-Type为“application/json”的响应数据转化为JSON对象，默认为true
  parseJson:true,
  withCredentials:false //跨域时是否发送cookie
}
 * 实例级配置: fly.config.headers   单次请求配置:fly.request("/test",{hh:5},{header})
 * 
 * data类型:String|Json|Object|Array|Blob|ArrayBuffer|FormData
 * 
 * 别名:fly.put/delete/patch
 * 
 * 使用application/x-www-form-urlencoded编码:同axios一毛一样
 * URLSearchParams或qs.stringify({ 'bar': 123 })或 querystring.stringify({ foo: 'bar' })(node环境)
 * 
 * 多实例时node引入的路径"flyio/dist/npm/fly"???
 * 
 * Http Engine:
 * 发起http请求中的引擎(如浏览器的XMLHttpRequest node使用其他模块) 请求重定向?
 * 
 * 自定义字段的支持由具体环境使用的http engine决定
 * 如果你要自定义一个http engine，然后支持一些自定义选项，你可以在adapter的request对象中直接读取：
fly.config.selfField="xx"
fly.engine=EngineWrapper(function(request,responseCallBack){
  //读取自定义选项
  var feild= request.selfFiled
})

 * 在拦截器中执行异步任务:
 * return Promise.resolve(request)或return Promise.resolve("xx") 后者会放弃本次请求直接返回'xx'
 * 
 * 拦截器锁定:在解锁前暂停所有其他请求
 * fly.lock=fly.interceptors.request.lock及fly.unlock=fly.interceptors.request.unlock
 * 在拦截处理函数内this指向拦截器对象(箭头函数无效)  this.lock()
 * 
 * 一个具体异步拦截实例:
var csrfToken="";
var tokenFly=new Fly();
var fly=new Fly();
fly.interceptors.request.use(function (request) {
  log(`发起请求：path:${request.url}，baseURL:${request.baseURL}`)
  if (!csrfToken) {
    log("没有token，先请求token...");
    //锁定当天实例，后续请求会在拦截器外排队，详情见后面文档
    fly.lock();
    return newFly.get("/token").then((d) => {
      request.headers["csrfToken"] = csrfToken = d.data.data.token;
      log("token请求成功，值为: " + d.data.data.token);
      log(`继续完成请求：path:${request.url}，baseURL:${request.baseURL}`)
      return request; //只有最终返回request对象时，原来的请求才会继续
    }).finally(()=>{
      fly.unlock();//解锁后，会继续发起请求队列中的任务，详情见后面文档
    })
  } else {
    request.headers["csrfToken"] = csrfToken;
  }
})

注意：由于我们在请求token时锁定了当前fly实例，所以千万不要用当前fly实例去请求token，如果这样做，会导致死锁：由于当前fly实例在发起token请求前已经被锁定，如果再用该fly实例去发起请求，那么该请求会进入队列，直到解锁时才会继续，但是只有当token请求结束后才会解锁，这就导致了一个死锁。所以通常的做法是创建一个新Fly实例去请求token。

现在基于上面的例子，我们添加一些功能：假设token有一个有效期，超过一段时间就会过期失效，失效时服务器会返回通知我们，然后我们再重新去请求新的token，请求成功后再重新发起之前的请求。

思路

首先如果我们在业务代码中手动处理的话，会意味着，没个请求都要处理token失效、重试的逻辑，这会非常麻烦。所以我们寻求一种全局处理方式，如果在请求拦截器中来做，我们是不知道token是否过期的，所以无法在请求拦截器中处理重试逻辑。这时候该怎么做？响应拦截器就是答案：

响应拦截器中我们收到服务器返回，然后首先判断是否token过期，如果是，我们重新请求token并重新发起之前的请求，代码如下：

fly.interceptors.response.use(
  function (response) {  //不要使用箭头函数，否则调用this.lock()时，this指向不对
    log("interceptors.response", response)
    //验证失效
    if (response.data.data.tokenExpired) {
      log("token失效，重新请求token...");
      this.lock(); //锁定响应拦截器，
      return newFly.get("/token")
        .then((d) => {
          csrfToken = d.data.data.token;
          log("token已更新，值为: " + csrfToken);
         })
        .finally(() => this.unlock()) //解锁
        .then(() => {
          log(`重新请求：path:${response.request.url}，baseURL:${response.request.baseURL}`)
          return fly.request(response.request);
        })
    } else {
      return response.data.data;
    }
  },
  function (err) {
    log("error-interceptor", err)
  }
)
上面的代码很简单，值得注意的是我们在请求token后先解锁，接下来重新发起请求，并将新请求的结果作为最终的请求结果。

 * 文件下载: fly.download (url, savePath, params = null, options={}).then(d=>{}) d:{size,path}
 * 等同于: fly.get(url,params,options).then(d=>{fs.writeFile(savePath,d.data,err=>{})})
 * 文件上传: fly.upload(url,formData,options={})
例:
formData = {
  name:"v.png", //普通的字段
  avatar: fs.createReadStream('./v.png'), //文件
  resume: fs.createReadStream('./resume.docx'), //文件
  attachments:[ //可以通过数组
      fs.createReadStream('./file1.zip'),
      fs.createReadStream('./file2.zip')
  ]
}
 * upload会将请求的 content-type 设为 “multipart/form-data” 注意http请求对文件上传限制
 * 
 * request库原生api: fly.$http('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'))
 * fly.$http.post('http://service.com/upload', {form:{key:'value'}})
 * 
 * 混合应用中的统一请求(无法干涉webview的ajax请求)
 * cookie同步,接口安全,访问控制,性能,缓存
 * cookie同步:请求池的不一致导致同步工作
 * 接口安全:https协议已经越来越普及，但是，浏览器/webview 对于https请求，默认的证书校验策略是：先查看本地证书信任列表，如果本地信任列表中没有当前访问站点的证书，则会去检验CA链。这也就意味着，如果攻击者通过伪造的证书开一个代理服务器，然后在自己的手机中手动添加这个伪造证书至本地证书信任列表， 然后攻击者将手机代理指向其代理服务器，这么一来， webview在请求接口时，数据将会完全暴漏在攻击者面前。而目前防止代理攻击的主要方式就是在端上进行证书校验，这可以保证Native发起的请求数据是安全的，但是h5通过webview发起的请求仍将会暴漏，如果你的APP是一个金融理财类的应用，这将非常危险。
 * 访问控制:服务端无法处理来自webview的跨域请求
 * 
 * 切换http engine:
 * fly.engine = XMLHttpRequest 或者
 * 使用adpter: engine.setAdapter (adpter)
var Fly = require("../../dist/npm/fly")
var EngineWrapper = require("../../dist/npm/engine-wrapper")
//引入fly实现的node adapter
var adapter = require("./adapter/node")
//通过包装node adapter生成一个engine
var engine=EngineWrapper(adapter)
module.exports=new Fly(engine)

实例:
var engine= EngineWrapper(function (request,responseCallback) {
  responseCallback({
    statusCode:200,
    responseText:"你变或者不变，我都不变😜。",
    extraFeild:"自定义字段"
  })
})
fly.engine=engine;

fly.get("../package.json").then(d=>{
  log(d.data)
  log(d.extraFeild)
})
 * 
 * 远程 engine:调用者和执行者并不在同一个环境
 * Javascript Bridge 是指web应用中Javascript与Native之间接口互调，数据传输的一个桥梁。现在github中有一些成熟易用的移动端跨平台实现如: dsBridge 、 WebViewJavascriptBridge 
 * 预置的dsBridge:
var adapter = require("flyio/dist/npm/adapter/dsbridge")
var EngineWrapper = require("flyio/dist/npm/engine-wrapper")
var Fly = require("flyio/dist/npm/fly")

var dsEngine = EngineWrapper(adapter)
var fly = new Fly(engine);
//然后你就可以使用fly发起请求了
fly.get("xxx.com")...
现在在h5中通过fly发起的所有ajax请求都会被重定向到端上
 * 
 * Native实现Http Engine
第一步：Native端注册API
我们在APP中注册处理ajax请求的API，命名为 onAjaxRequest：
 @JavascriptInterface
 public void onAjaxRequest(JSONObject jsonObject, final CompletionHandler handler){
    //jsonObject 为fly adapter 传给端的requerst对象
    //端上完成请求后，将响应对象通过hander返回给fly adapter
    //hanlder(response)
 }

第二步：H5实现adapter
我们使用的是DSBridge, 可以直接调用Native中注册的 onAjaxRequest，下面是adapter/dsbridge.js的部分代码：
adapter = function (request, responseCallBack) {
      dsBridge.call("onAjaxRequest", request, function onResponse(responseData) {
          responseCallBack(JSON.parse(responseData))
     })
}
可以看到 adapter 直接通过dsBridge的call方法将请求对象传给了Native，Native在完成真正的http请求后会回调 responseCallBack，responseData 即为响应数据。

第三步：更换新engine
最后就是更换新的engine:
var adapter = require("flyio/dist/npm/adapter/dsbridge")
var EngineWrapper = require("flyio/dist/npm/engine-wrapper")
var dsEngine = EngineWrapper(adapter)
var fly = new Fly(dsEngine);
以上三步即为整个完整的流程。下面我们看看Android端如何实现http engine.

Android实现真正的网络请求
我们以Android下著名的http网络库okhttp为例 ，给出大概实现：
@JavascriptInterface 
public void onAjaxRequest(JSONObject requestData, final CompletionHandler handler){

    //定义响应结构
    final Map<String, Object> responseData=new HashMap<>();
    responseData.put("statusCode",0);

    try {
        //timeout值为0时代表不设置超时
        int timeout =requestData.getInt("timeout");
        //创建okhttp实例并设置超时
        final OkHttpClient okHttpClient = new OkHttpClient
            .Builder()
            .connectTimeout(timeout, TimeUnit.MILLISECONDS)
            .build();

        //判断是否需要将返回结果编码，responseType为stream时应编码
        String contentType="";
        boolean encode=false;
        String responseType=requestData.getString("responseType");
        if(responseType!=null&&responseType.equals("stream")){
            encode=true;
        }

        Request.Builder rb= new Request.Builder();
        rb.url(requestData.getString("url"));
        JSONObject headers=requestData.getJSONObject("headers");

        //设置请求头
        Iterator iterator = headers.keys();
        while(iterator.hasNext()){
            String  key = (String) iterator.next();
            String value = headers.getString(key);
            String lKey=key.toLowerCase();
            if(lKey.equals("cookie")){
                //使用CookieJar统一管理cookie
               continue;
            }
            if(lKey.toLowerCase().equals("content-type")){
                contentType=value;
            }
            rb.header(key,value);
        }

        //创建请求体
        if(requestData.getString("method").equals("POST")){
            RequestBody requestBody=RequestBody
                    .create(MediaType.parse(contentType),requestData.getString("data"));
            rb.post(requestBody) ;
        }
        //创建并发送http请求
        Call call=okHttpClient.newCall(rb.build());
        final boolean finalEncode = encode;
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                responseData.put("responseText",e.getMessage());
                handler.complete(new JSONObject(responseData).toString());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String data;
                //如果需要编码，则对结果进行base64编码后返回
                if(finalEncode){
                   data= Base64.encodeToString(response.body().bytes(),Base64.DEFAULT);
                }else{
                    data=response.body().string();
                }
                responseData.put("responseText",data);
                responseData.put("statusCode",response.code());
                responseData.put("statusMessage",response.message());
                Map<String, List<String>> responseHeaders=response.headers().toMultimap();
                responseHeaders.remove(null);
                responseData.put("headers",responseHeaders);
                handler.complete(new JSONObject(responseData).toString());
            }
        });

    }catch (Exception e){
        responseData.put("responseText",e.getMessage());
        handler.complete(new JSONObject(responseData).toString());
    }
}
上面代码为演示代码，在生产环境有以下几点需要注意

OkHttpClient 应该共享实例，而不是每次请求都创建实例
Cookie应进行统一的管理或持久化，可以使用okhttp的CookieJar。
Https请求时应添加证书校验。
Stream

由于大多数浏览器中的ajax是不能接收流数据，这对于图片等二进制文件来说不是很方便，Fly中通过对流数据进行 base64 编码的方式来支持二进制文件传输，这需要Native端支持，正如上面实例实现。在h5中发起请求时需要指明响应是一个stream。下面我们请求一张图片：

<img alt="加载中..." id="img" />
<script>
    //请求图片，native engine可以跨域
    fly.request("https://assets-cdn.github.com/favicon.ico", null,{
        method:"GET",
        responseType:"stream" //指定以流的方式接收响应
    }).then(function (d) {
       //图片支持base64
       document.getElementById("img").src=d.data;
    })
</script>
 * 
 * 全局Ajax拦截原理:
 * 无论你的应用是通过那个框架或库发起的 Ajax 请求，最终都会回归到 XMLHttpRequest 。 所以，拦截的本质就是替换浏览器原生的 XMLHttpRequest 。具体就是，在替换之前保存先保存 XMLHttpRequest，然后在请求过程中根据具体业务逻辑决定是否需要发起网络请求，如果需要，再创建真正的 XMLHttpRequest 实例。
var log = console.log;
//切换fly engine为真正的XMLHttpRequest
fly.engine = XMLHttpRequest;
var engine = EngineWrapper(function (request, responseCallback) {
    console.log(request.url, request.method)
    //发起真正的ajax请求
    fly.request(request.url, request.data, request)
        .then(function (d) {
            responseCallback({
                statusCode: d.engine.status,
                responseText: d.engine.responseText,
                statusMessage: d.engine.statusText
            })
        })
        .catch(function (err) {
            responseCallback({
                statusCode:err.status,
                statusMessage:err.message
            })
        })
})
//覆盖默认
XMLHttpRequest = engine;
axios.post("../package.json").then(log)
因为 Fly支持切换engine, 我们可以直接先将 fly engine 切换为真正的 XMLHttpRequest ，然后再覆盖，这样fly中的网络请求都是通过真正的 XMLHttpRequest 发起的 (事实上， 浏览器环境下 fly 默认的 engine本就是 XMLHttpRequest，无需手动切换，此处为了清晰，故手动切换了一下)。fly 会根据request对象自动同步请求头。如果想阻止请求，直接在 adapter 中 return 即可。

可以使用ajax-hook拦截
 * 
 * 微信adpter:
//微信小程序适配器
module.exports=function(request, responseCallback) {
    var con = {
        method: request.method,
        url: request.url,
        dataType: request.dataType||"text",
        header: request.headers,
        data: request.body||{},
        success(res) {
            responseCallback({
                statusCode: res.statusCode,
                responseText: res.data,
                headers: res.header,
                statusMessage: res.errMsg
            })
        },
        fail(res) {
            responseCallback({
                statusCode: res.statusCode||0,
                statusMessage: res.errMsg
            })
        }
    }
    //调用微信接口发出请求
    wx.request(con)
}
 * 
 * 与axios和Fetch对比:
共同点

都支持Promise API
都同时支持Node和Browser环境
都支持请求／响应拦截器
都支持自动转换 JSON
不同点

浏览器环境

axios支持请求取消和全局配置，而 fly 不支持请求取消，fly的配置支持实例级别和单次请求级别，其余功能基本不分伯仲，在体积上，fly.min.js只有4K左右，而axios.min.js 12K左右。Fly更轻量，集成成本更低。

Node环境

Node下 Fly 的功能要明显强于axios，Fly在node下不仅提供了文件下载、上传的API，而且还可以通过 fly.$http 直接调用 request 库 的所有功能，详情请参照Node下增强的API 。

请求转发

Fly最大的特点就是在混合APP中支持请求转发，而axios不支持，关于请求转发的详细内容请参照请求重定向 。

Http Engine

Fly中提出了Http Engine的概念，Fly可以通过更换Http Engine的方式实现很多有趣的功能，比如全局Ajax拦截，详情请参考 全局ajax拦截 。

设计思想

Fly采用分层的设计思想，将上层用户接口和底层Http Engine分离。采用适配器模式，让实现Http Engine变的非常容易。正是这样的框架设计，可以通过替换底层Http Engine的方式，使得fly能够在灵活的支持各种环境的同时又能保证上层接口的一致性。还有，通过adapter，用户完全可以自定义http请求的实现.......还有很多高级的玩法。

Fetch

Fetch的接口设计要好于 XMLHttpRequest，但是，由于Fetch本身的一些特点，导致其在使用时也不是很方便，下面我们看一个post请求的例子：

fetch("doAct.action", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    credentials: 'include',
    body: "key=value"
}).then(function(res) {
    if (res.ok) {
        // To do with res
    } else if (res.status == 401) {
        // To do with res
    }else if(res.status == 404){
       //
    }else if(res.status==500){
       // 
    }
})
.catch(function(e) {
    // Handling errors
});
上面有三点要注意：

必须手动设置header的 content-type，Fetch不会自动设置。
必须手动设置  credentials，Fetch默认不带cookie。
像40X、50X这种http 状态错误是不会触发catch，需要在then中处理。
除此之外，Fetch：

不支持请求／响应拦截器，这在设置一些全局的参数、请求头时很有用。
不支持Node
浏览器支持程度不同。
另一个角度

我们用 XMLHttprequest 来实现上述功能其实代码量也差不多：

var xhr = new XMLHttpRequest();
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
xhr.open('post', "doAct.action");
xhr.onload = function() {
    if (xhr.status>=200&&xhr.status<300) {
        // To do with res
    } else if (xhr.status == 401) {
        // To do with res
    }else if(xhr.status == 404){
       //
    }else if(xhr.status==500){
       // 
    }
};
xhr.onerror = function() {
    // Handling errors
};
xhr.send("key=value");
既然代码量又差不多，为什么在 XMLHttprequest 时代我们还是要引一个 http请求库，答案是 方便。不可否认，Fetch是比 XMLHttprequest 的接口好很多，但是即使使用Fetch，也不是很方便。而fly也会在合适的时候支持Fetch。

 */