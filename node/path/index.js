const path = require('path')
//  path.normalize：路径标准化函数，解析.及..,去除多余的/
let test1 = './/src/page/home'
let test2 = '\\src\\page\\home'
let test3 = '../src/page/home'

console.log(path.normalize(test1))
console.log(path.normalize(test2))
console.log(path.normalize(test3))
//  path.join：合并路径并标准化
let test4 = './src/page/home'
let test5 = './shop'
let test6 = '../public/http'

console.log(path.join(test6, test4, test5, 'config'))
//  path.extname：获取文扩展名
console.log(path.extname('config.svg'))

// 获取绝对路径 path.resolve(path1, [path2]..[pathn]);
// 获取相对路径 path.relative(from, to);   from :当前路径，并且方法返回值是基于from指定到to的相对路径; to:到哪路径
// path.dirname(p) 获取路径中目录名 
// path.basename(path, [ext])   获取路径中文件名,后缀是可选的，如果加，请使用'.ext'方式来匹配，则返回值中不包括后缀名；
// path.extname(path)  获取路径中的扩展名，如果没有'.'，则返回空
// path.sep属性  返回操作系统中文件分隔符； window是'\\', Unix是'/'
// path.delimiter属性  返回操作系统中目录分隔符，如window是';', Unix中是':'



// require路径解析  js,json,node文件
// '/'绝对路径,'./'当前路径,'../'上级路径,均无 核心模块或node_modules内(从当前路径一级级向上查找)
// 用require(X) 加载路径Y下的模块
// 1. 如果X是核心模块,
//    a. 加载并返回核心模块
//    b. 结束
// 2. 如果X以 './' or '/' or '../ 开始'
//    a. LOAD_AS_FILE(Y + X)
//    b. LOAD_AS_DIRECTORY(Y + X)
// 3. LOAD_NODE_MODULES(X, dirname(Y))
// 4. 抛出异常："not found"
// LOAD_AS_FILE(X)
// 1. 如果X是个文件，把 X作为JavaScript 脚本加载，加载完毕后结束
// 2. 如果X.js是个文件，把X.js 作为JavaScript 脚本加载，加载完毕后结束
// 3. 如果X.node是个文件，把X.node 作为Node二进制插件加载，加载完毕后结束
// LOAD_AS_DIRECTORY(X)
// 1. 如果 X/package.json文件存在,
//    a. 解析X/package.json, 并查找 "main"字段.
//    b. 另M = X + (main字段的值)
//    c. LOAD_AS_FILE(M)
// 2. 如果X/index.js文件存在，把 X/index.js作为JavaScript 脚本加载，加载完毕后结束
// 3. 如果X/index.node文件存在，把load X/index.node作为Node二进制插件加载，加载完毕后结束
// LOAD_NODE_MODULES(X, START)
// 1. 另DIRS=NODE_MODULES_PATHS(START)
// 2. 对DIRS下的每个目录DIR做如下操作:
//    a. LOAD_AS_FILE(DIR/X)
//    b. LOAD_AS_DIRECTORY(DIR/X)
// NODE_MODULES_PATHS(START)
// 1. 另PARTS = path split(START)
// 2. 另ROOT = index of first instance of "node_modules" in PARTS, or 0
// 3. 另I = count of PARTS - 1
// 4. 另DIRS = []
// 5. while I > ROOT,
//    a. 如果 PARTS[I] = "node_modules" 则继续后续操作，否则下次循环
//    c. DIR = path join(PARTS[0 .. I] + "node_modules")
//    b. DIRS = DIRS + DIR
//    c. 另I = I - 1
// 6.返回DIRS