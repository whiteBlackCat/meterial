// 2种
// Console 类；
// 全局console

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// 自定义的简单记录器。
const logger = new Console({ stdout: output, stderr: errorOutput });
// 像控制台一样使用它。
const count = 5;
logger.log('count: %d', count);
// 在 stdout.log 中: count 5
// 指定输出流

// 使用label计数
console.count([label])
console.countReset([label])

// console.table(tabularData[, properties])
// console.time([label])
// console.trace([message][, ...args])

// 需配合--inspect使用
console.profile([label])
console.timeStamp([label])