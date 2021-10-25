# Webpack

## 示例

package.josn

1. `"build": "cross-env NODE_ENV=production webpack --config webpack.config.js"`
2. `"dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"`

解释:

1. `cross-env NODE_ENV=production` : 设置环境
2. `webpack-dev-server` : 启用sever开发服务
3. `--config webpack.config.js` : 指定配置文件
4. `--progress` 显示进度  
5. `--display-module` 显示模块
6. `--module-bind 'css=style-loader!css-loader!'` 绑定指定文件解析器

## 主流打包工具区别

Grunt和Gulp的工作方式是：在一个配置文件中，指明对某些文件进行类似编译，组合，压缩等任务的具体步骤，工具之后可以自动替你完成这些任务。
Webpack的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件。
