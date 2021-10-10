module.exports = {
  loading: false, // 控制页面切换的时候显示加载进度条
  // loading option
  // color String 'black'  进度条的颜色
  // failedColor String 'red'
  // 页面加载失败时的颜色（ 当 data 或 fetch 方法返回错误时）。
  // height String '2px'
  // 进度条的高度(在进度条元素的 style 属性上体现)。
  // throttle Number 200 在ms中， 在显示进度条之前等待指定的时间。 用于防止条形闪烁。
  // duration Number 5000 进度条的最大显示时长， 单位毫秒。 Nuxt.js 假设页面在该时长内加载完毕。
  // rtl Boolean false 从右到左设置进度条的方向。

  // 自定义loading组件  路径
  // start() 是 路由更新（ 即浏览器地址变化） 时调用,  请在该方法内显示组件。
  // finish() 是 路由更新完毕（ 即asyncData方法调用完成且页面加载完） 时调用， 请在该方法内隐藏组件。
  // fail() 否 路由更新失败时调用（ 如asyncData方法返回异常）。
  // increase(num) 否 页面加载过程中调用,  num 是小于 100 的整数。

  generate: {
    fallback: true, // if you want to use '404.html'
    // fallback: 'my-fallback/file.html' // if your hosting needs a custom location
  },
  css: [ // 全局过渡动效设置
    'assets/main.css'
  ],
  head: { // 默认meta
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    ],
    link: [{
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Roboto'
    }]
  },
  build: { // 解决多次引用多次打包问题
    vendor: ['axios']
  },
  plugins: [{
      src: '~/plugins/vue-notifications',
      ssr: false
    }, // 控制只在浏览器内使用
    '~/plugins/vue-inject.js',
    '~/plugins/combined-inject.js'
  ], // 插件使用
  modules: [
    // Simple usage
    // '~/modules/simple'

    // Passing options
    ['~/modules/simple', {
      token: '123'
    }],
    '@nuxtjs/axios'
  ],
  // axios module is aware of this by using `this.options.axios`
  // 在定义模块是就可以通过this.options.axios访问
  // 通过module扩展核心功能,注册插件???
  axios: {
    option1,
    option2
  }
}

// vue-meta默认参数
// {
//   keyName: 'head', // 设置 meta 信息的组件对象的字段，vue-meta 会根据这 key 值获取 meta 信息
//   attribute: 'n-head', // vue-meta 在监听标签时所添加的属性名
//   ssrAttribute: 'n-head-ssr', // 让 vue-meta 获知 meta 信息已完成服务端渲染的属性名
//   tagIDKeyName: 'hid' // 让 vue-meta 用来决定是否覆盖还是追加 tag 的属性名
// }


// 状态树还可以拆分成为模块，store 目录下的每个 .js 文件会被转换成为状态树指定命名的子模块
// 使用状态树模块化的方式，store/index.js 不需要返回 Vuex.Store 实例，而应该直接将 state、mutations 和 actions 暴露出来