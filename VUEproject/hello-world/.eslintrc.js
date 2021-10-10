module.exports = {
  root: true,
  env: {
    node: true,
    "es6": true   // es6新的全局变量 
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended", // 推荐的规则
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020, // 支持es2020
    sourceType: 'script',  // 模块类型
    ecmaFeatures: {
      globalReturn: false, // 允许在全局作用域下使用 return 语句
      impliedStrict: false,   // 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
      jsx: true, // 启用 JSX
    }
  },
  rules: {
    // 对各项单独设置
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  "parser": "Espree",  // 解析器
  // "plugins": ["a-plugin"],
  // "processor": "a-plugin/a-processor",  // 制定文件的处理器  启用插件 a-plugin 提供的处理器 a-processor
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};

/**
 * env：
 * 不同的环境决定不同的全局变量
 * browser - 浏览器环境中的全局变量。
node - Node.js 全局变量和 Node.js 作用域。
commonjs - CommonJS 全局变量和 CommonJS 作用域 (用于 Browserify/WebPack 打包的只在浏览器中运行的代码)。
shared-node-browser - Node.js 和 Browser 通用全局变量。
es6 - 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
worker - Web Workers 全局变量。
amd - 将 require() 和 define() 定义为像 amd 一样的全局变量。
mocha - 添加所有的 Mocha 测试全局变量。
jasmine - 添加所有的 Jasmine 版本 1.3 和 2.0 的测试全局变量。
jest - Jest 全局变量。
phantomjs - PhantomJS 全局变量。
protractor - Protractor 全局变量。
qunit - QUnit 全局变量。
jquery - jQuery 全局变量。
prototypejs - Prototype.js 全局变量。
shelljs - ShellJS 全局变量。
meteor - Meteor 全局变量。
mongo - MongoDB 全局变量。
applescript - AppleScript 全局变量。
nashorn - Java 8 Nashorn 全局变量。
serviceworker - Service Worker 全局变量。
atomtest - Atom 测试全局变量。
embertest - Ember 测试全局变量。
webextensions - WebExtensions 全局变量。
greasemonkey - GreaseMonkey 全局变量。

globals：
手动指定全局变量

 */