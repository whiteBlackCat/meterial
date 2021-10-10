const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// 将所有被使用的.css模块打包成一个文件  正式环境下，更希望使用link而不是使用js写入样式
// 详情https://www.npmjs.com/package/extract-text-webpack-plugin
const ExtractPlugin = require('extract-text-webpack-plugin')

//启动脚本时环境变量存在 process.env中
const isDev = process.env.NODE_ENV === 'development'

const config = {
  mode: 'development', // 等同于CLI参数 --mode=production   启用相应插件
  entry: path.join(__dirname, 'src/index.js'), // 亦有__dirname + "/app/main.js"写法
  /**
   * 入口文件 :
   * 完整用法
   * entry: {[entryChunkName: string]: string|Array<string>}
   * 简洁用法: path
   * path值: 描述path字符串, path.join(__dirname, rPath)(推荐)
   * 
   * 应用场景：多页面应用使用多入口，使用 CommonsChunkPlugin为每个页面间的应用程序共享代码创建 bundle以便复用。
   * 动态加载的模块不是入口起点
   */
  output: {
    filename: 'bundle.[hash:8]js', // 打包文件名 多页面应用会需要占位符
    path: path.join(__dirname, 'dist') // 打包文件输出路径
  },
  libraryTarget: "umd", // 导出库类型
  devtool: 'none',
  /** 调试选项:
   * source-map: 打包代码的同时生成一个sourcemap文件(完整且功能完全 末尾添加//# souceURL),单减慢打包速度
   * cheap-module-source-map: 由于不带列映射的map(调试只对应行),提升打包速度
   * eval-source-map: 完整的source map,速度影响不大,但输出的JS具有性能隐患(过程:将每个模块转化为字符串，使用eval包裹，并将打包前每个模块的sourcemap信息转换为Base64编码，拼接在每个打包后文件的结尾)
   * cheap-module-eval-source-map: 生成source map最快,与js文件同行显示,也有性能隐患
   * eval 每个模块被转化为字符串，在尾部添加//# souceURL（指明eval前文件）后，被eval包裹起来  同source-map,但不包含列信息，不包含 loader 的 sourcemap
   * hidden-source-map  打包结果与source-map一致，但是.map文件结尾不显示//# sourceMappingURL
   * inline-source-map 为打包前的每个文件添加sourcemap的dataUrl，追加到打包后文件内容的结尾；此处，dataUrl包含一个文件完整 souremap 信息的 Base64 格式化后的字符串
   */

  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
  },
  /**
   * 开发服务: 
   * contentBase: 提供本地服务的文件夹
   * port,
   * inline: 源文件改变时会自动刷新页面
   * historyApiFallback: 使用HTML5 history API,跳转将指向index.html
   */
  module: {
    /**
     * 每条rule完整配置:
     * {
     *    test: extREG, // 匹配文件扩展名正则
     *    use
     *      loader: loader-name, // 将资源转换为模块
     *      options: {} // loader配置
     * }
     * 对于复数loader使用方法:
     *  1. 使用use替换loader属性: [loader1, loader2, loader3,...]
     *  2. 使用形式同 -> 'loader1!loader2!...'  例: 'style-loader!css-loader'
     * 复数loader情况下,loader从右向左依次调用
     */
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      },
      // {
      //     test: /\.css$/,
      //     use: ExtractTextPlugin.extract({ // 正式环境才有的css提取
      //         fallback: "style-loader",
      //         use: [{
      //             loader: "css-loader",
      //             options: {
      //                 modules: true,
      //                 localIdentName: '[name]__[local]--[hash:base64:5]'
      //             }
      //         }, {
      //             loader: "postcss-loader"
      //         }]
      //     })
      // }, 
      {
        test: /\.(jpg|gif|jpeg|png|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024, // 阈值 Kb
            name: '[name]-aaa.[ext]' // 重命名
          }
        }]
      }, {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "env", "react"
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  // 解析模块请求选项
  resolve:{
    modules:["path"], //查找模块目录
    extensions: [".js", ".json", ".jsx", ".css"],  // 模块无扩展名时，在此查询
    alias:{  // 模块别名列表
      "module": "new-module", // 起别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"
    }
  },

  // performance: {
  //   hints: false
  // },
  context:__dirname, // 解析起点，推荐传值以独立于CWD（current working directory）
  target:'web', // bundle运行环境

  externals: { // string,array,reg,object,function  不要打包的模块
    jquery: 'jQuery', // 引用该募块石直接使用全局变量
    // require('react')はwindow.Reactを使う
    'react': 'React',
    // require('react-dom')はwindow.ReactDOMを使う
    'react-dom': 'ReactDOM'
  },
  state:'errors-only', // string|object bundle信息显示

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin(),
    new webpack.BannerPlugin('版权所有，翻版必究')
  ]
}

if (isDev) {
  // 开发环境下使用js写入样式无所谓
  config.module.rules.push({
    test: /\.styl$/,
    use: [
      'style-loader',
      'css-loader', {
        loader: 'postcss-loader',
        options: {
          sourceMap: true
        }
      },
      'stylus-loader'
    ]
  })
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    port: 8080,
    overlay: {
      errors: true,
    },
    hot: true
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  //分开打包类库代码 
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue']
  }
  config.output.filename = '[name].[chunkhash:8].js' // 正式环境下的打包输出路径 chunkhash:8会为每个文件生成不同hash，hash：8会共享一个

  // 对css文件打包
  config.module.rules.push({
    test: /\.styl$/,
    use: ExtractPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader', {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        'stylus-loader'
      ]
    })
  })
  // css文件打包输出  单独打包  未被模块使用的名字便于浏览器通过hash缓存
  config.plugins.push(
    // 分离CSS和JS文件
    new ExtractPlugin('styles.[contentHash:8].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块并为它们分配最小的ID
  )
}

module.exports = config