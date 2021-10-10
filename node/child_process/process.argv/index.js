// 命令行参数
// 子进程执行命令
// require('child_process').exec(str,callback)

// yargs 处理命令行参数
// 传递: hello --name=tom  或者  hello --name tom
// 配置
var argv = require('yargs')
  .option('n', {
    alias: 'name',
    demand: true,
    default: 'tom',
    describe: 'your name',
    type: 'string'
  })
  .boolean(['m'])
  .usage('Usage: hello [options]')
  .example('hello -n tom', 'say hello to Tom')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2015')
  .argv;