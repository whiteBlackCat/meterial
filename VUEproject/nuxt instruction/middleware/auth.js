export default function (context) {
  context.userAgent = process.server ? context.req.headers['user-agent'] : navigator.userAgent
}
// 中间件允许您定义一个自定义函数运行在一个页面或一组页面渲染之前。
// 中间件执行流程顺序：

// nuxt.config.js
// 匹配布局
// 匹配页面