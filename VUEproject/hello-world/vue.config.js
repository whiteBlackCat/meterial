const path = require('path');
const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);
const UglifyPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  publicPath: '/',
  // 部署应用包时的基本 URL，不要直接修改 webpack 的 output.publicPath
  indexPath: 'index.html',
  // 相对于打包路径index.html的路径
  outputDir: process.env.outputDir || 'dist',
  // 'dist', 生产环境构建文件的目录   构建时传入 --no-clean 可关闭目标目录在构建之前会被清除 
  assetsDir: 'static',
  // 相对于outputDir的静态资源(js、css、img、fonts)目录
  filenameHashing: true,
  // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存 然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希
  pages: undefined,
  /**
   * 在 multi-page 模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件。其值应该是一个对象，对象的 key 是入口的名字，value 是：
   1,一个指定了 entry, template, filename, title 和 chunks 的对象 (除了 entry 之外都是可选的)；
   2,一个指定其 entry 的字符串。
   pages: {
     index: {
       // page 的入口
       entry: 'src/index/main.js',
       // 模板来源
       template: 'public/index.html',
       // 在 dist/index.html 的输出
       filename: 'index.html',
       // 当使用 title 选项时，
       // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
       title: 'Index Page',
       // 在这个页面中包含的块，默认情况下会包含
       // 提取出来的通用 chunk 和 vendor chunk。
       chunks: ['chunk-vendors', 'chunk-common', 'index']
     },
     // 当使用只有入口的字符串格式时，
     // 模板会被推导为 `public/subpage.html`
     // 并且如果找不到的话，就回退到 `public/index.html`。
     // 输出文件名会被推导为 `subpage.html`。
     subpage: 'src/subpage/main.js'
   }
   * 
   */
  lintOnSave: process.env.NODE_ENV !== 'production',
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  runtimeCompiler: false,
  // 是否使用包含运行时编译器的 Vue 构建版本  可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
  transpileDependencies: [],
  // babel转义列表
  productionSourceMap: false,
  // 生产环境的 source map
  crossorigin: undefined,
  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。
  // 需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响
  integrity: false,
  //  Subresource Integrity(SRI)  鱼CDN有关
  parallel: require("os").cpus().length > 1,
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {},
  // 向 PWA 插件传递选项。
  chainWebpack: config => {
    // 配置Jquery
    // config.plugin('provide').use(webpack.ProvidePlugin, [{
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery',
    //   Popper: ['popper.js', 'default']
    // }]);

    // 开启js、css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
        .use(new CompressionPlugin({
          test: /\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        }))
    }
    config.resolve.symlinks(true); // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = "none"
      return args
    });
    config.resolve.alias // 添加别名
      .set('@', resolve('src')).set('@assets', resolve('src/assets')).set('@components', resolve('src/components')).set('@views', resolve('src/views')).set('@store', resolve('src/store'));
    // 压缩图片
    // 需要 npm i -D image-webpack-loader
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/).use('url-loader').loader('url-loader').options({imit: 10240 }).end()
    // 打包分析, 打包之后自动生成一个名叫report.html文件(可忽视)
    if (IS_PROD) {
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [{
        analyzerMode: "static"
      }]);
    }
  },
  // 链式操作webpack
  configureWebpack: config => {
    // 开启 gzip 压缩
    // 需要 npm i -D compression-webpack-plugin
    // const plugins = [];
    // if (IS_PROD) {
    //   plugins.push(new CompressionWebpackPlugin({
    //     filename: "[path].gz[query]",
    //     algorithm: "gzip",
    //     test: productionGzipExtensions,
    //     threshold: 10240,
    //     minRatio: 0.8
    //   }));
    // }
    // config.plugins = [...config.plugins, ...plugins];

    // if (process.env.NODE_ENV === 'production') {
    //   // 为生产环境修改配置...
    //   config.mode = 'production'

    //   // 将每个依赖包打包成单独的js文件
    //   const optimization = {
    //     runtimeChunk: 'single',
    //     splitChunks: {
    //       chunks: 'all',
    //       maxInitialRequests: Infinity,
    //       minSize: 20000, // 依赖包超过20000bit将被单独打包
    //       cacheGroups: {
    //         vendor: {
    //           test: /[\\/]node_modules[\\/]/,
    //           name(module) {
    //             // get the name. E.g. node_modules/packageName/not/this/part.js
    //             // or node_modules/packageName
    //             const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
    //             // npm package names are URL-safe, but some servers don't like @ symbols
    //             return `npm.${packageName.replace('@', '')}`
    //           }
    //         }
    //       }
    //     },

    //     // 移除console
    //     minimizer: [new UglifyPlugin({
    //       uglifyOptions: {
    //         warnings: false,
    //         compress: {
    //           drop_console: true, // console
    //           drop_debugger: false,
    //           pure_funcs: ['console.log'] // 移除console
    //         }
    //       }
    //     })]
    //   }
    //   Object.assign(config, {
    //     optimization
    //   })
    // } else {
    //   // 为开发环境修改配置...
    //   config.mode = 'development'
    // }
    // Object.assign(config, {
    //   // 开发生产共同配置
    //   resolve: {
    //     alias: {
    //       '@': path.resolve(__dirname, './src'),
    //       '@c': path.resolve(__dirname, './src/components'),
    //       '@p': path.resolve(__dirname, './src/pages'),
    //       '@v': path.resolve(__dirname, './src/views'),
    //     } // 别名配置
    //   }
    // })


    // 手动为不同依赖换成不同chunk
    // manualChunks(id) {
    //   if (id.includes('node_modules')) {
    //     // Return the directory name following the last `node_modules`.
    //     // Usually this is the package, but it could also be the scope.
    //     const dirs = id.split(path.sep);
    //     return dirs[dirs.lastIndexOf('node_modules') + 1];
    //   }
    // }

    // 自动导入文件 (用于颜色、变量、mixin……)
    // const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    // types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
  },
  // webpack配置
  css: {
    extract: IS_PROD,
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)
    requireModuleExtension: false,
    // 去掉文件名中的 .module   默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v7 中，这个选项名是 "data"
        // prependData: `@import "~@/variables.sass";`
      },
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // `globalVars` 定义全局对象，可加入全局变量
        globalVars: {
          primary: '#333'
        }
      }
    },
    // 向 CSS 相关的 loader 传递选项 支持:css-loader,postcss-loader,sass-loader,less-loader,stylus-loader
    sourceMap: false,
    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
  },
  devServer: {
    overlay: { // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    host: "localhost", // host: '0.0.0.0', // 允许外部ip访问
    port: 8080,
    // 端口号
    https: false,
    // https:{type:Boolean}
    open: true,
    inline: true, // 开启实时刷新
    //配置自动启动浏览器
    hotOnly: true,
    // 热更新
    // proxy: 'http://localhost:8080' // 配置跨域处理,只有一个代理
    proxy: { //配置多个跨域
      "/api": {
        target: "http://172.11.11.11:7071",
        changeOrigin: true,
        // ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/api": "/"
        }
      },
      "/api2": {
        target: "http://172.12.12.12:2018",
        changeOrigin: true,
        //ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/api2": "/"
        }
      },
    }
    // 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器
  },
  // 第三方插件配置
  pluginOptions: {}
}


function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/imports.styl'),
      ],
    })
}



  /**
  * webpack4以下的设置环境变量
  *   plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]

  审查 webpack配置
  vue inspect > output.js
  vue inspect module.rules.0
  vue inspect --plugin html



  pwa:

  Configuration is handled via the pwa property of either the vue.config.js file, or the "vue" field in package.json.

pwa.workboxPluginMode

This allows you to the choose between the two modes supported by the underlying workbox-webpack-plugin.

'GenerateSW' (default), will lead to a new service worker file being created each time you rebuild your web app.

'InjectManifest' allows you to start with an existing service worker file, and creates a copy of that file with a "precache manifest" injected into it.

The "Which Plugin to Use?" guide can help you choose between the two modes.

pwa.workboxOptions

These options are passed on through to the underlying workbox-webpack-plugin.

For more information on what values are supported, please see the guide for GenerateSW or for InjectManifest.

pwa.name

Default: "name" field in package.json

Used as the value for the apple-mobile-web-app-title meta tag in the generated HTML. Note you will need to edit public/manifest.json to match this.

pwa.themeColor

Default: '#4DBA87'
pwa.msTileColor

Default: '#000000'
pwa.appleMobileWebAppCapable

Default: 'no'

This defaults to 'no' because iOS before 11.3 does not have proper PWA support. See this article for more details.

pwa.appleMobileWebAppStatusBarStyle

Default: 'default'
pwa.assetsVersion

Default: ''

This option is used if you need to add a version to your icons and manifest, against browser’s cache. This will append ?v=<pwa.assetsVersion> to the URLs of the icons and manifest.

pwa.manifestPath

Default: 'manifest.json'

The path of app’s manifest. If the path is an URL, the plugin won't generate a manifest.json in the dist directory during the build.

pwa.manifestOptions

Default: {}

The object will be used to generate the manifest.json

If the following attributes are not defined in the object, the options of pwa or default options will be used instead.

name: pwa.name
short_name: pwa.name
start_url: '.'
display: 'standalone'
theme_color: pwa.themeColor
pwa.manifestCrossorigin

Default: undefined

Value for crossorigin attribute in manifest link tag in the generated HTML. You may need to set this if your PWA is behind an authenticated proxy. See cross-origin values for more details.

pwa.iconPaths

Defaults:

{
  favicon32: 'img/icons/favicon-32x32.png',
  favicon16: 'img/icons/favicon-16x16.png',
  appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
  maskIcon: 'img/icons/safari-pinned-tab.svg',
  msTileImage: 'img/icons/msapplication-icon-144x144.png'
}
Change these values to use different paths for your icons. As of v4.3.0, you can use null as a value and that icon will not be included.
  


通过 <style module> 以开箱即用的方式在 *.vue 文件中使用 CSS Modules
  */

  //  createProxyMiddleware('**', {...}) matches any path, all requests will be proxied.
  //  createProxyMiddleware('**/*.html', {...}) matches any path which ends with .html
  //  createProxyMiddleware('/*.html', {...}) matches paths directly under path-absolute
  //  createProxyMiddleware('/api/**/*.html', {...}) matches requests ending with .html in the path of /api
  //  createProxyMiddleware(['/api/**', '/ajax/**'], {...}) combine multiple patterns
  //  createProxyMiddleware(['/api/**', '!**/bad.json'], {...}) exclusion
  //