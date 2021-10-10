// 1. dns.lookup  使用底层操作系统工具执行名称解析但不一定执行任何网络通信的函数
// 2. dns.resolve4  连接到实际 DNS 服务器以执行名称解析并始终使用网络执行 DNS 查询的函数
// dns.Resolver  创建一个新的解析程序

// resolver.getServers()
// resolver.resolve()
// resolver.resolve4()
// resolver.resolve6()
// resolver.resolveAny()
// resolver.resolveCname()
// resolver.resolveMx()
// resolver.resolveNaptr()
// resolver.resolveNs()
// resolver.resolvePtr()
// resolver.resolveSoa()
// resolver.resolveSrv()
// resolver.resolveTxt()
// resolver.reverse()
// resolver.setServers()

// dns.lookup(hostname[, options], callback)
// family <integer> 记录的地址族。必须为 4、 6 或 0。0 值表示返回 IPv4 和 IPv6 地址。默认值: 0。
// hints <number> 一个或多个受支持的 getaddrinfo 标志。可以通过按位 OR 运算它们的值来传递多个标志。
// all <boolean> 当为 true 时，则回调将会返回数组中所有已解析的地址。否则，返回单个地址。默认值： false。
// verbatim <boolean> 当为 true 时，则回调按 DNS 解析器返回的顺序接收 IPv4 和 IPv6 地址。当为 false 时，则 IPv4 地址放在 IPv6 地址之前。 默认值: 当前为 false（地址已重新排序）但预计在不久的将来会发生变化。新代码应使用 { verbatim: true }。
// callback <Function>
// err <Error>
// address <string> IPv4 或 IPv6 地址的字符串表示形式。
// family <integer> 4 或 6，表示 address 的地址族，如果地址不是 IPv4 或 IPv6 地址，则为 0。0 可能是操作系统使用的名称解析服务中的错误的指示符。

const dns = require('dns');
const options = {
    family: 6,
    hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.com', options, (err, address, family) =>
    console.log('地址: %j 地址族: IPv%s', address, family));
// 地址: "2606:2800:220:1:248:1893:25c8:1946" 地址族: IPv6

// 当 options.all 为 true 时，则结果将会是一个数组。
options.all = true;
dns.lookup('example.com', options, (err, addresses) =>
    console.log('地址: %j', addresses));
// 地址: [{"address":"2606:2800:220:1:248:1893:25c8:1946","family":6}]

// dns.lookupService(address, port, callback)
// 使用操作系统的底层 getnameinfo 实现将给定的 address 和 port 解析为主机名和服务

// dns.resolve(hostname[, rrtype], callback)
// rrtype <string> 资源记录类型。默认值: 'A'。 决定records返回内容

// dns.resolve4、dns.resolve6 为lookupService特定类型

// dns.reverse(ip, callback)
// 反向 DNS 查询

// dns.setServers(servers)
// 设置执行 DNS 解析时要使用的服务器的 IP 地址和端口

// require('dns').promises
// promise风格