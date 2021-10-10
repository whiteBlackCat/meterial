// 异步子进程
// child_process.spawn()

// 在shell中运行命令
// child_process.exec()

// 直接执行命令
// child_process.execFile():

// 衍生进程
// child_process.fork()
// 以上方法均能创建ChildProcess实例

const {
  exec,
  spawn
} = require('child_process');
exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// 文件名中包含空格的脚本：
const bat = spawn('"my script.cmd"', ['a', 'b'], {
  shell: true
});
// 或：
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});

/**
 * @description 衍生一个 shell 然后在该 shell 中执行 command，并缓冲任何产生的输出
 * @param command {string} 运行的命令，空格分隔参数
 * @param options {object}
 * cwd {string} 子进程当前工作目录 null
 * env {object} 环境变量  process.env
 * encoding {string}
 * shell {string} 执行命令的shell; '/bin/sh'  或者 process.env.comSpec
 * timeout {number}
 * maxBuffer {number}
 * killSignal {string|integer} 'SIGTERM'
 * uid {number} 进程用户标识
 * gid {number} 进程的群组标识
 * windowsHide {boolean} 隐藏子进程的控制窗口
 * @param callback {Function} 进程终止时调用并带上输出
 * error
 * stout
 * sterr
 * @return childProcess
 */

// child_process.exec(command[, options][, callback])
// child_process.execFile(file[, args][, options][, callback])

/**
 * @param cwd {string} 子进程的当前工作目录
 * @param detached {boolean} 子进程独立于其父进程运行
 * @param env {Object}
 * @param execPath {string} 创建子进程的可执行文件
 * @param execArgv {string[]} 可执行文件的字符串参数的列表 process.execArgv
 * @param silent {boolean} 如果为 true，则子进程的 stdin、stdout 和 stderr 将会被输送到父进程，否则它们将会继承自父进程
 * @param stdio ｛Array | string｝配置在父进程和子进程之间建立的管道,默认'pipe'
 */
// child_process.fork(modulePath[, args][, options])

// 参数同fork.  argv0, stdio ,uid ,gid ,shell
// child_process.spawn(command[, args][, options])

// 各种事件
const {
  spawn
} = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdin.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stdout: ${data}`);
});
ls.on('close', (code) => {
  console.log(`子进程使用代码 ${code} 关闭所有 stdio`);
});

ls.on('exit', (code) => {
  console.log(`子进程使用代码 ${code} 退出`);
});

// 子进程属性
// channel，connected，disconnect()，kill([signal]) 发送kill的信号，killed：子进程是否收到kill消息， pid
// send()