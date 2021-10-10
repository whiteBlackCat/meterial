淘宝镜像
$ npm install -g cnpm --registry=https://registry.npm.taobao.org

alias cnpm="npm --registry=https://registry.npm.taobao.org \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npm.taobao.org/dist \
--userconfig=$HOME/.cnpmrc"

# Or alias it in .bashrc or .zshrc
$ echo '\n#alias for cnpm\nalias cnpm="npm --registry=https://registry.npm.taobao.org \
  --cache=$HOME/.npm/.cache/cnpm \
  --disturl=https://npm.taobao.org/dist \
  --userconfig=$HOME/.cnpmrc"' >> ~/.zshrc && source ~/.zshrc



如果你在 Windows 上通过 minTTY 使用 Git Bash，交互提示符并不工作。你必须通过 winpty vue.cmd create hello-world 启动这个命令。不过，如果你仍想使用 vue create hello-world，则可以通过在 ~/.bashrc 文件中添加以下行来为命令添加别名。 alias vue='winpty vue.cmd' 你需要重新启动 Git Bash 终端会话以使更新后的 bashrc 文件生效。

创建项目
vue create hello-world
or
vue ui

添加插件  可以不添加scope，这里是'@foo/'
vue add @foo/bar 

项目内访问插件
{
  "vuePlugins": {
    "service": ["my-commands.js"]
  }
}

使用远程preset创建项目
vue create --preset gitlab:username/repo --clone my-project

vue-cli-service
你可以在 npm scripts 中以 vue-cli-service、或者从终端中以 ./node_modules/.bin/vue-cli-service 访问这个命令。

需要手动添加vue.config.js
便是Webpack的配置文件webpack.config.js
/node_modules/@vue/cli-service/webpack.config.js  获取解析好的配置

帮助
npx vue-cli-service help

cache-loader 会默认为 Vue/Babel/TypeScript 编译开启。文件会缓存在 node_modules/.cache 中——如果你遇到了编译方面的问题，记得先删掉缓存目录之后再试试看。

thread-loader 会在多核 CPU 的机器上为 Babel/TypeScript 转译开启

git hooks:
pre-commit 钩子在键入提交信息前运行。 它用于检查即将提交的快照，例如，检查是否有所遗漏，确保测试运行，以及核查代码。 如果该钩子以非零值退出，Git 将放弃此次提交，不过你可以用 git commit --no-verify 来绕过这个环节。 你可以利用该钩子，来检查代码风格是否一致（运行类似 lint 的程序）、尾随空白字符是否存在（自带的钩子就是这么做的），或新方法的文档是否适当。

prepare-commit-msg 钩子在启动提交信息编辑器之前，默认信息被创建之后运行。 它允许你编辑提交者所看到的默认信息。 该钩子接收一些选项：存有当前提交信息的文件的路径、提交类型和修补提交的提交的 SHA-1 校验。 它对一般的提交来说并没有什么用；然而对那些会自动产生默认信息的提交，如提交信息模板、合并提交、压缩提交和修订提交等非常实用。 你可以结合提交模板来使用它，动态地插入信息。

commit-msg 钩子接收一个参数，此参数即上文提到的，存有当前提交信息的临时文件的路径。 如果该钩子脚本以非零值退出，Git 将放弃提交，因此，可以用来在提交通过前验证项目状态或提交信息。 在本章的最后一节，我们将展示如何使用该钩子来核对提交信息是否遵循指定的模板。

post-commit 钩子在整个提交过程完成后运行。 它不接收任何参数，但你可以很容易地通过运行 git log -1 HEAD 来获得最后一次的提交信息。 该钩子一般用于通知之类的事情。

电子邮件工作流钩子
你可以给电子邮件工作流设置三个客户端钩子。 它们都是由 git am 命令调用的，因此如果你没有在你的工作流中用到这个命令，可以跳到下一节。 如果你需要通过电子邮件接收由 git format-patch 产生的补丁，这些钩子也许用得上。

第一个运行的钩子是 applypatch-msg 。 它接收单个参数：包含请求合并信息的临时文件的名字。 如果脚本返回非零值，Git 将放弃该补丁。 你可以用该脚本来确保提交信息符合格式，或直接用脚本修正格式错误。

下一个在 git am 运行期间被调用的是 pre-applypatch 。 有些难以理解的是，它正好运行于应用补丁 之后，产生提交之前，所以你可以用它在提交前检查快照。 你可以用这个脚本运行测试或检查工作区。 如果有什么遗漏，或测试未能通过，脚本会以非零值退出，中断 git am 的运行，这样补丁就不会被提交。

post-applypatch 运行于提交产生之后，是在 git am 运行期间最后被调用的钩子。 你可以用它把结果通知给一个小组或所拉取的补丁的作者。 但你没办法用它停止打补丁的过程。

其它客户端钩子
pre-rebase 钩子运行于变基之前，以非零值退出可以中止变基的过程。 你可以使用这个钩子来禁止对已经推送的提交变基。 Git 自带的 pre-rebase 钩子示例就是这么做的，不过它所做的一些假设可能与你的工作流程不匹配。

post-rewrite 钩子被那些会替换提交记录的命令调用，比如 git commit --amend 和 git rebase（不过不包括 git filter-branch）。 它唯一的参数是触发重写的命令名，同时从标准输入中接受一系列重写的提交记录。 这个钩子的用途很大程度上跟 post-checkout 和 post-merge 差不多。

在 git checkout 成功运行后，post-checkout 钩子会被调用。你可以根据你的项目环境用它调整你的工作目录。 其中包括放入大的二进制文件、自动生成文档或进行其他类似这样的操作。

在 git merge 成功运行后，post-merge 钩子会被调用。 你可以用它恢复 Git 无法跟踪的工作区数据，比如权限数据。 这个钩子也可以用来验证某些在 Git 控制之外的文件是否存在，这样你就能在工作区改变时，把这些文件复制进来。

pre-push 钩子会在 git push 运行期间， 更新了远程引用但尚未传送对象时被调用。 它接受远程分支的名字和位置作为参数，同时从标准输入中读取一系列待更新的引用。 你可以在推送开始之前，用它验证对引用的更新操作（一个非零的退出码将终止推送过程）。

Git 的一些日常操作在运行时，偶尔会调用 git gc --auto 进行垃圾回收。 pre-auto-gc 钩子会在垃圾回收开始之前被调用，可以用它来提醒你现在要回收垃圾了，或者依情形判断是否要中断回收。

服务器端钩子
除了客户端钩子，作为系统管理员，你还可以使用若干服务器端的钩子对项目强制执行各种类型的策略。 这些钩子脚本在推送到服务器之前和之后运行。 推送到服务器前运行的钩子可以在任何时候以非零值退出，拒绝推送并给客户端返回错误消息，还可以依你所想设置足够复杂的推送策略。

pre-receive
处理来自客户端的推送操作时，最先被调用的脚本是 pre-receive。 它从标准输入获取一系列被推送的引用。如果它以非零值退出，所有的推送内容都不会被接受。 你可以用这个钩子阻止对引用进行非快进（non-fast-forward）的更新，或者对该推送所修改的所有引用和文件进行访问控制。

update
update 脚本和 pre-receive 脚本十分类似，不同之处在于它会为每一个准备更新的分支各运行一次。 假如推送者同时向多个分支推送内容，pre-receive 只运行一次，相比之下 update 则会为每一个被推送的分支各运行一次。 它不会从标准输入读取内容，而是接受三个参数：引用的名字（分支），推送前的引用指向的内容的 SHA-1 值，以及用户准备推送的内容的 SHA-1 值。 如果 update 脚本以非零值退出，只有相应的那一个引用会被拒绝；其余的依然会被更新。

post-receive
post-receive 挂钩在整个过程完结以后运行，可以用来更新其他系统服务或者通知用户。 它接受与 pre-receive 相同的标准输入数据。 它的用途包括给某个邮件列表发信，通知持续集成（continous integration）的服务器， 或者更新问题追踪系统（ticket-tracking system） —— 甚至可以通过分析提交信息来决定某个问题（ticket）是否应该被开启，修改或者关闭。 该脚本无法终止推送进程，不过客户端在它结束运行之前将保持连接状态， 所以如果你想做其他操作需谨慎使用它，因为它将耗费你很长的一段时间。



browserslist
指定了项目的目标浏览器的范围。这个值会被 @babel/preset-env 和 Autoprefixer 用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。

Polyfill
babel.config.js

现代模式
vue-cli-service build --modern
一个现代版的包，面向支持 ES modules 的现代浏览器，另一个旧版的包，面向不支持的旧浏览器。

最酷的是这里没有特殊的部署要求。其生成的 HTML 文件会自动使用 Phillip Walton 精彩的博文中讨论到的技术：

现代版的包会通过 <script type="module"> 在被支持的浏览器中加载；它们还会使用 <link rel="modulepreload"> 进行预加载。

旧版的包会通过 <script nomodule> 加载，并会被支持 ES modules 的浏览器忽略。

一个针对 Safari 10 中 <script nomodule> 的修复会被自动注入。


Index 文件
public/index.html 文件是一个会被 html-webpack-plugin 处理的模板。在构建过程中，资源链接会被自动注入。另外，Vue CLI 也会自动注入 resource hint (preload/prefetch、manifest 和图标链接 (当用到 PWA 插件时) 以及构建过程中处理的 JavaScript 和 CSS 文件的资源链接

插值
因为 index 文件被用作模板，所以你可以使用 lodash template 语法插入内容：

<%= VALUE %> 用来做不转义插值；
<%- VALUE %> 用来做 HTML 转义插值；
<% expression %> 用来描述 JavaScript 流程控制。
除了被 html-webpack-plugin 暴露的默认值之外，所有客户端环境变量也可以直接使用。例如，BASE_URL 的用法：




项目根目录中的下列文件来指定环境变量：

.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
一个环境文件只包含环境变量的“键=值”对：

FOO=bar
VUE_APP_SECRET=secret


Preload,Prefetch 增删
chainWebpack   config.plugin('prefetch')


处理静态资源：
在 JavaScript 被导入或在 template/CSS 中通过相对路径被引用。这类引用会被 webpack 处理。
放置在 public 目录下或通过绝对路径被引用。这类资源将会直接被拷贝，而不会经过 webpack 的处理。


何时使用 public 文件夹
你需要在构建输出中指定一个文件的名字。
你有上千个图片，需要动态引用它们的路径。
有些库可能和 webpack 不兼容，这时你除了将其用一个独立的 <script> 标签引入没有别的选择。










vue.config.js

pages 在 multi-page 模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件。其值应该是一个对象，对象的 key 是入口的名字
 {
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


    chainWebpack: config => {
    config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 10240 }))
  }


  大公司的资源优化方案
  1.配置超长时间的本地缓存 —— 节省带宽，提高性能
  2.采用内容摘要作为缓存更新依据 —— 精确的缓存控制
  3.静态资源CDN部署 —— 优化网络请求
  4.更资源发布路径实现非覆盖式发布 —— 平滑升级
  
Q:压缩打包资源要点
A:
  1.区分生产环境和开发环境(不同环境,引用的插件,资源打包方式有所不同,应区分对待)
  2.提取第3方库:为其单独打包(entry多加个入口)并压缩;externals: { 'react': 'React' } 将window.value变量require(key)
  3.代码分隔:加载所需
  4.设置缓存(MD5文件名)
  

Q: vue-cli的vendor不够小
A: DllPlugin和DllReferencePlugin:引用的依赖库提取出来到static,下次需要时直接去static复制到dist，无需重新编译(加快编译速度非包大小?)
步骤:
  1.新建build/webpack.dll.config.js
   const path = require('path')
   const webpack = require('webpack')
  /!-----------------------------------------分隔线-------------------------------------------------/
  const package = require('../package.json')
  const AssetsPlugin = require('assets-webpack-plugin')
  /#-----------------------------------------分隔线-------------------------------------------------/
  module.exports = {
    entry: {
      // 填写需要提取出来的依赖包
      // 如果有些依赖包在index.html页面引入了cdn了就无需再引入了，否则会打包进js文件中，在页面重复引入代码。
      vendor: ['vue','vue-router']
      /!-----------------------------------------分隔线-------------------------------------------------/
      //读取package.json里的依赖，normalize.css除外，打包会报错
      //如果使用了chrome的vue-devtool，那打包的时候把vue也排除掉，因为压缩过的vue是不能使用vue-devtool的
      vendor: Object.keys(package.dependencies).filter((item) => {
        return item.indexOf('normalize') < 0 && item != 'vue'
      })
      /#-----------------------------------------分隔线-------------------------------------------------/
    },
    output: {
      path: path.join(__dirname, '../static'),
      filename: 'dll.[name]_[hash:6].js',
      library: '[name]_[hash:6]'
    },
    plugins: [
      // 重点：这里引入的Dllplugin插件，该插件将生成一个manifest.json文件，该文件供webpack.config.js中加入的DllReferencePlugin使用，使我们所编写的源文件能正确地访问到我们所需要的静态资源（运行时依赖包）
      new webpack.DllPlugin({
        path: path.join(__dirname, '../', '[name]-manifest.json'),
        name: '[name]'
      }),
      new AssetsPlugin({
        filename: 'bundle-config.json',
        path: './'
      })
    ]
  }
  2.配置package.json 
  "scripts": {
    "dll": "webpack -p --progress --config build/webpack.dll.conf.js"
  }
  npm run dll 就可以在根目录下生成vendor-manifest.json,static下生成dll.vendor.js
  3.webpack.base.conf.js
  const manifest = require('../vendor-manifest.json')
  plugins: [
    //把dll的vendor-manifest.json引用到需要的预编译的依赖
    new webpack.DllReferencePlugin({
      manifest
    })
  ]
 * 之后index.html底部加上<script src="./static/dll.vendor.js"></script> //在bundle.js之前
 * 清除缓存:
 * npm install assets-webpack-plugin –save-dev  生成包含生成哈希的包（用于缓存清除）
 * /!-----------------------------------------分隔线-------------------------------------------------/
    const bundleConfig = require("../bundle-config.json")
    ...
    plugins: [
        new HtmlWebpackPlugin({
          // 加载dll文件
          vendorJsName: bundleConfig.vendor.js,
        }),
      ]
    index.html引入 <script src="./static/<%= htmlWebpackPlugin.options.vendorJsName %>"></script>

    const bundler = webpack(config)
    bundler.run((err, stats) => {
      let assets = stats.toJson().assets
      let name

      for (let i = 0; i < assets.length; i++) {
        if (assets[i].name.startsWith('main')) {
          name = assets[i].name
          break
        }
      }
      fs.stat(config.buildTemplatePath, (err, stats) => {
        if (err) {
          fs.mkdirSync(config.buildTemplatePath)
        }

        writeTemplate(name)
      })
    })

  我们每次上线的时候需要新建文件夹，然后把index.html复制粘贴进去，再把dist目录粘贴进去，还要把static粘贴进去再上线，我们不希望那么麻烦。
  npm install html-webpack-plugin copy-webpack-plugin clean-webpack-plugin --save-dev
  修改webpack.config:
   output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'build.[hash].js'
  },
  // publicPath: '/': 由于index.html需要打包到dist目录下，故'build.[hash].js'的引用路径由/dist/变为/

  添加plugin:
     new HtmlWebpackPlugin({
      inject: true,
      template: './index.html'
    }),
    new CopyWebpackPlugin([
      {from: 'static', to:'static'}
    ]),
    new CleanWebpackPlugin(['dist'])

    html-webpack-plugin：我们要index.html生成在dist目录里，故引用html-webpack-plugin，它默认将生成的index.html打包在output的文件夹下，由于index.html需要引用打包好的静态dll，且vue需要挂载在根组件div#app上，故需要引入模版，模版为根目录下index.html：
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>dll-test</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./static/js/vendor.dll.js"></script>
  </body>
</html>
inject:true：将打包好的js文件注入在该html的body底部，保证了script的加载顺序。
copy-webpack-plugin：由于我们要引入static/js/中的dll，且是在dist文件下，故用该插件将打包好的静态文件夹拷贝到打包目录dist下。
clean-webpack-plugin：打包前清除dist目录
差别三：

  devServer: {
    historyApiFallback: true,
    noInfo: true,
    contentBase: path.join(__dirname, 'dist')
  },
contentBase: path.join(__dirname, 'dist')，这是为了在dev环境下，提供index.html的目录改为dist，与生产环境的访问文件路径保持一致。
 */


当button组件的背景特效不能保留时,与a标签的优点就不多了
.ivu-input-group-append会额外添加以空div使得height:100%很心塞
watch兼听不到路由参数的变化 比不了对象,比得了数组 $route监听不了? 
新用法:监听对象:'obj.pro'   监听内容:{handler:func,deep:boolean,immediate:boolean} deep监听对象属性;immediate对监对象data时便触发
webpack打包,图片引用路径: assets文件夹会被打包,此时无法动态的使用该路径(注意是动态,静态访问没问题如css),此时可由:
1.换用静态路径static
2.使用模块加载的方式 require(path)

vue的router使用H5的history模式后,浏览器上的path的改变导致刷新页面,vuex的意义?

一旦出现 can`t read xxx property of undefined 就说明渲染挂了,必须等待再次响应式变化(这时放入nextTick的就苦逼了) 






CommonsChunk: 引入相同模块时,只单独打包一份
// 使用:去除残余文件
new CleanWebpackPlugin('build/*.*', {
  root: __dirname,
  verbose: true,
  dry: false
})
// 减少对npm包的打包
new webpack.DllPlugin({
	/**
     * path
     * 定义 manifest 文件生成的位置
     * [name]的部分由entry的名字替换
     */
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
      /**
       * name
       * dll bundle 输出到那个全局变量上
       * 和 output.library 一样即可。 
       */
      name: '[name]_library'
    })
html-webpack-plugin: 依据index.html模板，生成一个自动引用打包后的JS文件的新index.html
extract-text-webpack-plugin: 将所有被使用的.css模块打包成一个文件

new webpack.HotModuleReplacementPlugin()  // 热替换
    配置:
    1.在webpack配置文件中添加HMR插件；
    2.在Webpack下devServer项中添加“hot”参数；
    plugins: [ new webpack.HotModuleReplacementPlugin()//热加载插件 ]
    同时使用React API:
    npm install --save-dev babel-plugin-react-transform react-transform-hmr

    
new webpack.NoEmitOnErrorsPlugin()  // 在修改组件代码后，自动刷新实时预览修改后的效果

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),


仅正式环境:
	optimation: UglifyJsPlugin，OccurrenceOrderPlugin , DedupePlugin
new webpack.optimize.OccurrenceOrderPlugin(),
// 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块并为它们分配最小的ID	
	
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module, count) {
          // any required modules inside node_modules are extracted to vendor
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(
              path.join(__dirname, '../node_modules')
            ) === 0
          )
        }
      })
  // gzip模式下需要引入compression插件进行压缩
  if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')
   
    webpackConfig.plugins.push(
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          config.build.productionGzipExtensions.join('|') +
          ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
      })
    )
  }
  
  require('ora') // 一个很好看的 loading 插件
	
	
	
一段神奇的代码:
  HappyPack

   Cache:包括webpack.cache, babel-loader.cacheDirectory, HappyPack.cache

   fs;
   var MemoryFS = require("memory-fs");
var webpack = require("webpack");

var fs = new MemoryFS();
var compiler = webpack({ ... });
compiler.outputFileSystem = fs;
compiler.run(function(err, stats) {
  // ...
  var fileContent = fs.readFileSync("...");
});
当然，我们还可以通过 webpackDevMiddleware 更加无缝地就接入到 dev server 中，例如我们以 express 作为静态 server 的例子。

var compiler = webpack(webpackCfg);

var webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, {
   // webpackDevMiddleware 默认使用了 memory-fs
   publicPath: '/dist',
   aggregateTimeout: 300, // wait so long for more changes
   poll: true, // use polling instead of native watchers
   stats: {
       chunks: false
   }
});

var app = express();
app.use(webpackDevMiddlewareInstance);
app.listen(xxxx, function(err) {
   console.log(colors.info("dev server start: listening at " + xxxx));
   if (err) {
     console.error(err);
   }
}

webpack.DefinePlugin  定义编译时的全局变量
HotModuleReplacementPlugin 启用热替换模块
HtmlWebpackPlugin 生成html文件