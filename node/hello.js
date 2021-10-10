// console.log('hello ', process.argv[2]);

// 通过 child_process 模块新建子进程，从而执行 Unix 系统命令
// var name = process.argv[2];
// var exec = require('child_process').exec;

// var child = exec('echo hello ' + name, function(err, stdout, stderr) {
//   if (err) throw err;
//   console.log(stdout);
// });

// shelljs 模块重新包装了 child_process，调用系统命令更加方便。它需要安装后使用
// 本地模式
// var name = process.argv[2];
// var shell = require("shelljs");

// shell.exec("echo hello " + name);

// 全局模式
// require('shelljs/global');

// if (!which('git')) {
//   echo('Sorry, this script requires git');
//   exit(1);
// }

// mkdir('-p', 'out/Release');
// cp('-R', 'stuff/*', 'out/Release');

// cd('lib');
// ls('*.js').forEach(function(file) {
//   sed('-i', 'v0.1.2', 'v0.1.2', file);
//   sed('-i', /.*REMOVE_THIS_LINE.*\n/, '', file);
//   sed('-i', /.*REPLACE_LINE_WITH_MACRO.*\n/, cat('macro.js'), file);
// });
// cd('..');

// if (exec('git commit -am "Auto-commit"').code !== 0) {
//   echo('Error: Git commit failed');
//   exit(1);
// }

// yargs 模块能够解决如何处理命令行参数。它也需要安装
// 获取参数: var argv = require('yargs').argv;
// 传递: hello --name=tom  或者  hello --name tom
// 指定别名: var argv = require('yargs').alias('n', 'name').argv;
// argv 对象有一个下划线（_）属性，可以获取非连词线开头的参数。例:
// var argv = require('yargs').argv;
// console.log('hello ', argv.n);
// console.log(argv._);
// 输出:
// $ hello A -n tom B C
// hello  tom
// [ 'A', 'B', 'C' ]

// 参数配置方法: demand：是否必选; default：默认值; describe：提示
// var argv = require('yargs')
//   .demand(['n'])
//   .default({n: 'tom'})
//   .describe({n: 'your name'})
//   .argv;

// options 方法允许将所有这些配置写进一个对象。
// var argv = require('yargs')
//   .option('n', {
//     alias : 'name',
//     demand: true,
//     default: 'tom',
//     describe: 'your name',
//     type: 'string'
//   })
//   .argv;

// 有时，某些参数不需要值，只起到一个开关作用，这时可以用 boolean 方法指定这些参数返回布尔值。
// var argv = require('yargs')
//   .boolean(['n'])
//   .argv;

// 帮助信息:  usage：用法格式; example：提供例子; help：显示帮助信息; epilog：出现在帮助信息的结尾
// var argv = require('yargs')
//   .option('f', {
//     alias : 'name',
//     demand: true,
//     default: 'tom',
//     describe: 'your name',
//     type: 'string'
//   })
//   .usage('Usage: hello [options]')
//   .example('hello -n tom', 'say hello to Tom')
//   .help('h')
//   .alias('h', 'help')
//   .epilog('copyright 2015')
//   .argv;

// Git 风格的子命令
// require('shelljs/global');
// var argv = require('yargs')
//   .command("morning", "good morning", function (yargs) {  
//     echo("Good Morning");
//     var argv = yargs.reset()
//       .option("m", {
//         alias: "message",
//         description: "provide any sentence"
//       })
//       .help("h")
//       .alias("h", "help")
//       .argv;

//     echo(argv.m);
//   })
//   .argv;
// 每个子命令往往有自己的参数，这时就需要在回调函数中单独指定。回调函数中，要先用 reset 方法重置 yargs 对象。
// 使用:
// $ hello morning -m "Are you hungry?"
// Good Morning
// Are you hungry?

// 返回值: 据 Unix 传统，程序执行成功返回 0，否则返回 1
// if (err) {
//   process.exit(1);
// } else {
//   process.exit(0);
// }

// 程序之间使用管道重定向数据
// $ ps aux | grep 'node'
// 脚本可以通过监听标准输入的data 事件，获取重定向的数据。
// process.stdin.resume();
// process.stdin.setEncoding('utf8');
// process.stdin.on('data', function(data) {
//   process.stdout.write(data);
// });
// 下面是用法。
// $ echo 'foo' | ./hello
// hello foo

// 操作系统可以向执行中的进程发送信号，process 对象能够监听信号事件。
// process.on('SIGINT', function () {
//   console.log('Got a SIGINT');
//   process.exit(0);
// });
// 发送信号的方法如下。
// $ kill -s SIGINT [process_id]