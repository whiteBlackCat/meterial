// const dir = fs.opendir()
// close、read
// fs.WriteStream 
// close、open、ready

// fs.appendFile(path, data[, options], callback)
// encoding <string> | <null> 默认值: 'utf8'。
// mode <integer> 默认值: 0o666。
// flag <string> 参阅支持的文件系统标志。默认值: 'a'。
// 异步地将数据追加到文件，如果文件尚不存在则创建该文件。 data 可以是字符串或 Buf

// fs.chmod(path, mode, callback)
// 异步地更改文件的权限。 除了可能的异常，完成回调没有其他参数

// fs.copyFile(src, dest[, flags], callback)

// fs.createReadStream(path[, options])
// flags <string> 参阅支持的文件系统标志。默认值: 'r'。
// encoding <string> 默认值: null。
// fd <integer> 默认值: null。
// mode <integer> 默认值: 0o666。
// autoClose <boolean> 默认值: true。
// emitClose <boolean> 默认值: false。
// start <integer>
// end <integer> 默认值: Infinity。
// highWaterMark <integer> 默认值: 64 * 1024。


// fs.createWriteStream(path[, options])

// fs.mkdir(path[, options], callback)
// 异步地创建目录

// fs.mkdtemp(prefix[, options], callback)
// 创建一个唯一的临时目录
// fs.mkdtemp() 方法将六位随机选择的字符直接附加到 prefix 字符串。 例如，给定目录 /tmp，如果打算在 /tmp 中创建临时目录，则 prefix 必须在尾部加上特定平台的路径分隔符（require('path').sep）
// 新的临时目录的父目录。
const tmpDir = os.tmpdir();

const {
    sep
} = require('path');
fs.mkdtemp(`${tmpDir}${sep}`, (err, folder) => {
    if (err) throw err;
    console.log(folder);
    // 输出类似 `/tmp/abc123`。
    // 新的临时目录会被创建在 /tmp 目录中。
});


// fs.open(path[, flags[, mode]], callback)
// fs.opendir(path[, options], callback)

// fs.read(fd, buffer, offset, length, position, callback)
// 从 fd 指定的文件中读取数据。

// fs.readdir(path[, options], callback)

// fs.readFile(path[, options], callback)

// fs.realpath(path[, options], callback)

// fs.rename(oldPath, newPath, callback)

// fs.rmdir(path[, options], callback)

// fs.utimes(path, atime, mtime, callback)
// 更改事件戳

// fs.watch(filename[, options][, listener])
// options <string> | <Object>
// persistent <boolean> 指示如果文件已正被监视，进程是否应继续运行。默认值: true。
// recursive <boolean> 指示应该监视所有子目录，还是仅监视当前目录。这适用于监视目录时，并且仅适用于受支持的平台（参阅注意事项）。默认值: false。
// encoding <string> 指定用于传给监听器的文件名的字符编码。默认值: 'utf8'。
// listener <Function> | <undefined> 默认值: undefined。
// eventType <string>
// filename <string> | <Buffer></Buffer>
// 监视 filename 的更改