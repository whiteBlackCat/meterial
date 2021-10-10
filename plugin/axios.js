import Axios from 'Axios'
const axios = Axios.creat({
  method: 'get', // 默认  请求方法
  baseURL: 'https://some-domain.com/api/',
  transformRequest, // 这只适用于'PUT'，'POST'和'PATCH';数组中的最后一个函数必须返回一个字符串，一个 ArrayBuffer或一个Stream
  transformResponse,
  headers,
  params,
  timeout,
  withCredentials,
  adapter,
  auth,
  paramsSerializer = params => { return Qs.stringify(params, { arrayFormat: 'brackets' }) },
  xsrfCookieName: 'XSRF-TOKEN', // default `xsrfCookieName`是要用作 xsrf 令牌的值的cookie的名称
  maxRedirects: 5, // node.js中要遵循的重定向的最大数量。
  httpAgent: new http.Agent({ keepAlive: true }), // nodejs 代理
  httpsAgent: new https.Agent({ keepAlive: true }),
  proxy, // 代理服务器的主机名和端口  host,port,auth
  cancelToken,  // 取消请求令牌 axios.CancelToken.source().token  具体使用查文档
})

exports = {
  $http: axios
}