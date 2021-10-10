/**
 * 请求模块：
 * 常规数据：request(url, function (error, response, body) {}
 * 		application/x-www-form-urlencoded:request.post({url, form: {key:'value'}}, function(err,httpResponse,body){  })
 *			还可以；1. request.post('http://service.com/upload').form({key:'value'})
 * 			    	2. request.post('http://service.com/upload', {form:{key:'value'}})
 * 		multipart/form-data；request.post({url, formData}, function(err, httpResponse, body) {}
 * 			formdata以键值对形式（包括stream，buffer）stream数据能提供元数据信息，形式如；
 *{
    value:  fs.createReadStream('/dev/urandom'),
    options: {
      filename: 'topsecret.jpg',
      contentType: 'image/jpeg'
    }
  }
 * 二进制数据：request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'))/.pipe(request.put('http://mysite.com/obj.json'))
 * 能配置ua
 * proxy: 使用代理,首先向代理发送链接请求,在通过该链接与终端建立链接
TLS/SSL Protocol:配置直接添加在options内,或者options内agentOptions字段
 */
var request = require('request');