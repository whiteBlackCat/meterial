//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    appScreat: '1f8c1892b1bfc4a571efb4c0d30cfa0d ',
    appID: 'wx2d38210dc8682472'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  submit(e) {
    let {
      appID,
      appScreat
    } = e.detail.value,
      that = this

    // 生成token
    const step1 = (resolve, rej) => {
      wx.request({
        url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appScreat}`,
        success(res) {
          // console.log(res)
          if (res.data.access_token) {
            resolve(res.data.access_token)
          } else {
            rej(res)
          }
        }
      })
    }
    // 获取二维码图片
    const step2 = (token) => {
      wx.request({
        url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`,
        method: 'POST',
        data: {
          path: 'pages/index/index',
          scene: '1004'
        },
        responseType: 'arraybuffer',
        success(res) {
          console.assert(res.data instanceof ArrayBuffer,'很可惜res.data不是ArrayBuffer');
          let arrayBuffer  = res.data
          if (res.data instanceof ArrayBuffer) {
            // // let unit8Arr = new Uint8Array(arrayBuffer);
            // // console.log(unit8Arr);
            // // //下面这个可以但是中文乱码
            // // // console.log(String.fromCharCode.apply(null, unit8Arr));

            // // //下面这个调试也可以但是微信预览就不行了报错说TextDecoder  undefined
            // // // var decodeStr = new TextDecoder("utf-8").decode(unit8Arr);
            // // // console.log(decodeStr);
            // let s = decodeURIComponent(Array.from(arrayBuffer).map(function (value, index) { 
            //   console.log(value)
            //   return '%' + value.toString(16) }).join(''));
            // // let unit8Arr = new Uint8Array(arrayBuffer);
            // // let encodedString = String.fromCharCode.apply(null, unit8Arr)
            // //   // ,decodedString = decodeURIComponent(encodedString);//没有这一步中文会乱码
            // // // console.log(decodedString);
            // // console.log(encodedString);

          }
          // console.log(res)
          that.setData({
            qrcode: res.data
          })
        }
      })
    }

    let promise = new Promise(step1)
    promise
      .then(step2)
      .catch(err => {
        console.log(err)
      })

  },
  // 使用接口B,得到并保存二维码图片
  _getQRCode() {

  }
})

/**
 * java生成微信小程序吗
 * 回归正题，描述一下业务，利用小程序前端传参给后端，后端生成二维码，保存到本地，前端调用本地二维码图片，显示，用户可以扫描二维码获取相应界面。后端获取二维码的流程：向服务器发送url+appid和secret以获取token，再向服务器发送token和scene参数获取二维码参数，参数保存为图片格式。贴上主要代码：

//controller中处理主要业务

public R createRoomCode(int roomId) throws IOException {
    //获取token_access
    String params=grant_type_code+"&appid="+app_id+"&secret="+secret;
    String sr = HttpRequest.sendGet("https://api.weixin.qq.com/cgi-bin/token?grant_type", params);
    JSONObject json=JSONObject.fromObject(sr);
    String token_access=sr.substring(sr.indexOf(":")+2,sr.indexOf(",")-1);
    String sceneStr=""+roomId;
    HttpUtil.getminiqrQr(sceneStr,token_access);
    return  R.ok("succ");
}
//getminiqrQr类处理返回的二维码参数保存图片
public class HttpUtil {

    public static Map getminiqrQr(String sceneStr, String accessToken) {
        RestTemplate rest = new RestTemplate();
        InputStream inputStream = null;
        OutputStream outputStream = null;
        try {
            String url = "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token="+accessToken;
            Map<String,Object> param = new HashMap<>();
            param.put("scene", sceneStr);
            param.put("path", "pages/bookinglist/bookinglist");
            param.put("width", 300);
            param.put("auto_color", false);
            Map<String,Object> line_color = new HashMap<>();
            line_color.put("r", 0);
            line_color.put("g", 0);
            line_color.put("b", 0);
            param.put("line_color", line_color);
            System.out.println("调用生成微信URL接口传参:" + param);
            MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
            HttpEntity requestEntity = new HttpEntity(param, headers);
            ResponseEntity<byte[]> entity = rest.exchange(url, HttpMethod.POST, requestEntity, byte[].class, new Object[0]);
            System.out.println("调用小程序生成微信永久小程序码URL接口返回结果:" + entity.getBody());
            byte[] result = entity.getBody();
            inputStream = new ByteArrayInputStream(result);

            File file = new File("D:/workSpace/wechat2.0/03-Source/java2.0/room/pic/1.png");
            if (!file.exists()){
                file.createNewFile();
            }
            outputStream = new FileOutputStream(file);
            int len = 0;
            byte[] buf = new byte[1024];
            while ((len = inputStream.read(buf, 0, 1024)) != -1) {
                outputStream.write(buf, 0, len);
            }
            outputStream.flush();
        } catch (Exception e) {
            System.out.println("调用小程序生成微信永久小程序码URL接口异常");
        } finally {
            if(inputStream != null){
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(outputStream != null){
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }
}

下面的坑就是经验不足了，我启动后端服务器后，前端无法访问我上面指定图片保存的路径，后来问了大佬，在ieda项目resources文件夹下新建一个static文件夹，将图片放入其中，然后就可以在网页上请求路径格式如https://域名:端口号/项目名称/图片名称.png就可以访问了

前端直接访问这个路径就可以预览二维码。

参考网页找不到了，不过谢谢网上的大佬和公司的大佬。
*/

/**
 * 
 * 使用qrcode.js在微信生成二维码
 * 纯javascript版js源码：

qrcode

1、解读源码，修改绘制canvas部分，源代码如下

draw: function (string, canvas, size, ecc) {

            ecclevel = ecc || ecclevel;
            canvas = canvas || _canvas;

            if (!canvas) {
                console.warn('No canvas provided to draw QR code in!')
                return;
            }

            size = size || _size || Math.min(canvas.width, canvas.height);

            var frame = genframe(string),
                ctx = canvas.getContext('2d'),
                px = Math.round(size / (width + 8));

            var roundedSize = px * (width + 8),
                offset = Math.floor((size - roundedSize) / 2);

            size = roundedSize;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = '#000';
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < width; j++) {
                    if (frame[j * width + i]) {
                        ctx.fillRect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
                    }
                }
            }

        },
2、然后愉快的将代码修改如下：

draw: function (string, canvas, cavW, cavH, ecc) {
            ecclevel = ecc || ecclevel;
            canvas = canvas || _canvas;
            if (!canvas) {
                console.warn('No canvas provided to draw QR code in!')
                return;
            }

            var size =  Math.min(cavW, cavH);

            var frame = this.getFrame(string),
                ctx = wx.createContext(),
                px = Math.round(size / (width + 8));

            var roundedSize = px * (width + 8),
                offset = Math.floor((size - roundedSize) / 2);
            size = roundedSize;
            ctx.clearRect(0, 0, cavW, cavW);
            // ctx.setFillStyle('#ffffff');
            // ctx.rect(0, 0, size, size);
            ctx.setFillStyle('#000000');
			// ctx.setLineWidth(1);
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < width; j++) {
                    if (frame[j * width + i]) {
                        ctx.fillRect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
					}
                }
            }

			wx.drawCanvas({
          		canvasId: canvas,
          		actions: ctx.getActions()
    		});
        }
    }
3、哈哈，愉快的运行起来~~~~~~报错！！

WAService.js:3 TypeError: ctx.fillRect is not a function

赶紧看看小程序的api，发现小程序是没有fillRect()方法的，只有rect()方法,所以啪~啪~啪改为如下：


 for (var i = 0; i < width; i++) {
                for (var j = 0; j < width; j++) {
                    if (frame[j * width + i]) {
                        ctx.rect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
					}
                }
            }
运行，懵逼了，怎么没有二维码呢，我的二维码呢？好吧接着分析rect语fillRect的区别，其实rect方法只是绘制出轮廓，并不会对路径进行填充，所以紧接其后要对其fill填充。

把代码改为如下：


ctx.setFillStyle('#000000');
			// ctx.setLineWidth(1);
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < width; j++) {
                    if (frame[j * width + i]) {
                        ctx.rect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
                        ctx.fill();
                    }
                }
            }
运行~~~噢啦，终于出现期待已久的二维码喽！！





好了，总算完成了，但是怎么生成二维码的时候感觉有点慢呢，于是借用同事的手机（安卓系统）试了一下，输入网址，点击生成~~

崩了，微信直接挂了好吧接着找原因，感觉影响速度的只能是for循环那块代码，于是把ctx.fill()拿到for最外层；


 for (var i = 0; i < width; i++) {
                for (var j = 0; j < width; j++) {
                    if (frame[j * width + i]) {
                        ctx.rect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
                        // ctx.fill();
                    }
                }
            }
            ctx.fill();
运行~~这速度，飞快！自己的小7也不卡了，又用同事的试了一把，没问题。原来对绘制路径填充只需要最后填充就Ok了，我还二逼的对每次绘制进行了填充。
 */