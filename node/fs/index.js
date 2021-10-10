var fs = require('fs');
fs.createReadStream(src).pipe(fs.createWriteStream(dst)); //读一点写一点  有防止写入速度不及读取致爆仓
// 读取文件  
fs.readFile(filename, [options], callback);
// 写文件  data, 字符或一个Buffer对象  Buffer对象用例:new Buffer(‘这是一段通过fs.writeFile函数写入的内容；\r\n’);
fs.writeFile(filename, data, [options], callback);
// 写文件，将缓冲区内数据写入使用fs.open打开的文件  
fs.write(fd, buffer, offset, length, position, callback);
// 追加方式写文件  
fs.appendFile(filename, data, [options], callback);
// 打开文件  
fs.open(filename, flags, [mode], callback);
// 读文件  offset 整数，向缓存区中写入时的初始位置，以字节为单位;length, 整数，读取文件的长度;position, 整数，读取文件初始位置；文件大小以字节为单位 fd, 使用fs.open打开成功后返回的文件描述符
fs.read(fd, buffer, offset, length, position, callback);
// 刷新缓存区 
fs.fsync(fd, [callback])
// 创建目录 
fs.mkdir(path, [mode], callback);
// 读取目录 
fs.readdir(path, callback);
// 查看文件与目录的信息;
fs.stat(path, callback);
// 查看符号链接文件 
fs.lstat(path, callback);
// 修改文件访问时间与修改时间,目录的操作权限  
fs.utimes(path, atime, mtime, mode, callback);
// 移动/重命名文件或目录  
fs.rename(oldPath, newPath, callback);
// 删除空目录  
fs.rmdir(path, callback);
// 监视文件   [options], persistent true表示持续监视，不退出程序；interval 单位毫秒，表示每隔多少毫秒监视一次文件
// listener, 文件发生变化时回调，有两个参数：curr为一个fs.Stat对象，被修改后文件，prev,一个fs.Stat对象，表示修改前对象
fs.watchFile(filename, [options], listener);
// 取消监视文件  
fs.unwatchFile(filename, [listener]);
// 监视文件或目录 
// fs.watch返回一个fs.FSWatcher对象，拥有一个close方法，用于停止watch操作；当fs.watch有文件变化时，会触发fs.FSWatcher对象的change(err, filename)事件，err错误对象，filename发生变化的文件名
// [listener(event, filename], 监听器事件，有两个参数：event 为rename表示指定的文件或目录中有重命名、删除或移动操作或change表示有修改，filename表示发生变化的文件路径
fs.watch(filename, [options], [listener]);
// 截取文件 
fs.ftruncate(fd, len, callback)
// 删除文件 
fs.unlink(path, callback)

// 流: 应用程序中表示一组有序的、有起点有终点的字节数据的传输手段
// 流读取:fs.ReadStream 读取文件;  http.IncomingMessage 客户端请求或服务器端响应;
// process.stdin 用于创建进程标准输入流;  Gzip、Deflate、DeflateRaw  数据压缩;

// 读取数据的对象操作方法: read 读取数据方法; setEncoding 设置读取数据的编码;
// pause 通知对象众目停止触发data事件; resume  通知对象恢复触发data事件;
// pipe  设置数据通道，将读入流数据接入写入流；unpipe  取消通道;
// unshift   当流数据绑定一个解析器时，此方法取消解析器

// 流写入:
// 写数据对象: fs.WriteStream  写入文件对象; http.clientRequest  写入HTTP客户端请求数据;
// http.ServerResponse  写入HTTP服务器端响应数据;
// net.Socket  读写TCP流或UNIX流，需要connection事件传递给用户;
// child.stdout  子进程标准输出;child.stdin 子进程标准入;Gzip、Deflate、DeflateRaw  数据压 * 写入数据触发事件：drain  当write方法返回false时，表示缓存区中已经输出到目标对象中，可以继续写入数据到缓存区;   finish  当end方法调用，全部数据写入完成;
// pipe 当用于读取数据的对象的pipe方法被调用时; unpipe  当unpipe方法被调用;
// error 当发生错误; 
// 写入数据方法： write 用于写入数据; end  结束写入，之后再写入会报错；

// 创建读取流  fs.createReadStream(path, [options])
// [options] flags:指定文件操作，默认'r',读操作；encoding,指定读取流编码；autoClose, 是否读取完成后自动关闭，默认true；start指定文件开始读取位置；end指定文件开始读结束位置

// 创建写入流  fs.createWriteStream(path, [options]); ws.write(chunk, [encoding], [callback]);
// ws.end([chunk], [encoding], [callback]);

// 管道pipe实现流读写 rs.pipe(destination, [options]);    destination 必须一个可写入流数据对象  [opations] end 默认为true，表示读取完成立即关闭文件；


// options:
//   flag: 'w'
//   encoding: 'utf8'
//   mode: 0666

// flags一览:
// r	以读取模式打开文件。如果文件不存在抛出异常。
// r+	以读写模式打开文件。如果文件不存在抛出异常。
// rs	以同步的方式读取文件。
// rs+	以同步的方式读取和写入文件。
// w	以写入模式打开文件，如果文件不存在则创建。
// wx	类似 ‘w'，但是如果文件路径存在，则文件写入失败。
// w+	类似 ‘w+'， 但是如果文件路径存在，则文件读写失败。
// wx+	类似 ‘w+'， 但是如果文件路径存在，则文件读写失败。
// a 	以追加模式打开文件，如果文件不存在则创建。
// ax	类似 ‘a'， 但是如果文件路径存在，则文件追加失败。
// a+	以读取追加模式打开文件，如果文件不存在则创建。
// ax+	类似 ‘a+'， 但是如果文件路径存在，则文件读取追加失败。