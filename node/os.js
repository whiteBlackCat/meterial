const os = require('os');
// 与操作系统相关的实用方法和属性

// os.EOL
// 操作系统特定的行末标志。
// 在 POSIX 上是 \n。
// 在 Windows 上是 \r\n

// os.arch()
// CPU 架构。 可能的值有：'arm'、 'arm64'、 'ia32'、 'mips'、 'mipsel'、 'ppc'、 'ppc64'、 's390'、 's390x'、 'x32' 和 'x64'。

// os.constants

// os.cpus()
// 对象数组，其中包含有关每个逻辑 CPU 内核的信息


// os.endianness()
// CPU 的字节序  BE' 用于大端字节序， 'LE' 用于小端字节序。

// os.freemem()
// 空闲的系统内存量

// os.getPriority([pid])
//  pid 指定的进程的调度优先级

// os.homedir()
// 返回当前用户的主目录的字符串路径。
// 在 POSIX 上，使用 $HOME 环境变量（如果有定义）。 否则，使用有效的 UID 来查找用户的主目录。
// 在 Windows 上，使用 USERPROFILE 环境变量（如果有定义）。 否则，使用当前用户的配置文件目录的路径

// os.hostname()

// os.loadavg()
// 返回一个数组，包含 1、5 和 15 分钟的平均负载。

// os.networkInterfaces()
// 对象包含已分配了网络地址的网络接口
// address <string> 分配的 IPv4 或 IPv6 地址。
// netmask <string> IPv4 或 IPv6 的子网掩码。
// family <string> IPv4 或 IPv6。
// mac <string> 网络接口的 MAC 地址。
// internal <boolean> 如果网络接口是不可远程访问的环回接口或类似接口，则为 true，否则为 false。
// scopeid <number> 数值型的 IPv6 作用域 ID（仅当 family 为 IPv6 时指定）。
// cidr <string> 以 CIDR 表示法分配的带有路由前缀的 IPv4 或 IPv6 地址。如果 netmask 无效，则此属性会被设为 null。

// os.platform()
// 有 'aix'、 'darwin'、 'freebsd'、 'linux'、 'openbsd'、 'sunos' 和 'win32'。

// os.release()
// 以字符串的形式返回操作系统。
// 在 POSIX 系统上，操作系统的发行版是通过调用 uname(3) 判断的。 在 Windows 上, 则使用 GetVersionExW()

// os.setPriority([pid, ]priority)

// os.tmpdir()
// 以字符串的形式返回操作系统的默认临时文件目录。


// os.totalmem()

// os.uptime()
// 正常运行时间

// os.userInfo([options])