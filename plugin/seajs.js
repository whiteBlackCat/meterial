seajs.config({
  paths: {  // 同baseUrl
    'gallery': 'https://a.alipayobjects.com/gallery'
  }, 
  alias: { // path
    'jquery': 'path',
    'underscore': 'gallery/underscore'
  },
  // 路径 = paths + alias
  vars: { // 变量: 有时路径只在运行时才能确定
    'locale': 'zh-cn'
  },
  map: [ // 对路径映射修改
    ['.js', '-debug.js']
  ],
  preload: [ // use前
    Function.prototype.bind ? '' : 'es5-safe',
    this.JSON ? '' : 'json'
  ],
  debug: false, // true时,加载器不会删除动态插入的script
  base: string, // 解析顶级标志时，相对base路径解析
  charset: string // 默认utf-8
})

//启用模块
seajs.use(['./a', './b'], function (a, b) {});
// seajs.cache 可以查阅当前模块系统中的所有模块信息。
seajs.resolve('jquery'); // => http://path/to/jquery.js  获取模块路径
// seajs.data 查看seajs配置以及一些内部变量的值

// 定义模块
define(function (require, exports, module) {
  //引用jQuery模块
  var $ = require('jquery'); // 接受模块标识作为唯一参数，用来获取其他模块提供的接口。
  var _ = require('underscore');
  //=> 加载的是 https://a.alipayobjects.com/gallery/underscore.js
  var lang = require('./i18n/{locale}.js');
  //=> 加载的是 path/to/i18n/zh-cn.js
  var a = require('./a');
  //=> 加载的是 path/to/a-debug.js  只有相对路径的非'.js'才转'-debug.js'?
});

// define([id,] [deps,] factory) 字符串 id 表示模块标识，数组 deps 是模块依赖,factory可为字符串,数组 此时表接口
// define.cmd Object  一个空对象，可用来判定当前页面是否有 CMD 模块加载器
// require.async(id, callback?)在模块内部异步加载模块，并在加载完成后执行指定回调。
// 模块导出:
// 由于exports=module.exports,在进行exports={foo: 'bar'}时其与module.exports的联系切断
// module对象:id 唯一标识;url:模块绝对路径;dependencies:依赖;exports:对外提供的接口。
// seajs.find(selector) 从 seajs.cache 里查找匹配的模块 返回null或数组