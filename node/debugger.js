// node inspect myscript.js 启用调试器
// watch('my_expression')  添加监视器
// 在每个断点处，监视器列表中的每个表达式将在当前上下文中进行运行，并在断点的源代码列表之前立即显示

// 步进
// cont, c - 继续执行。
// next, n - 下一步。

// step, s - 步进。
// out, o - 步出。
// pause - 暂停正在运行的代码（类似开发者工具中的暂停按钮）。

// 添加断点
// setBreakpoint(), sb() - 在当前行上设置断点。
// setBreakpoint(line), sb(line) - 在特定行上设置断点。
// setBreakpoint('fn()'), sb(...) - 在函数体的第一个语句上设置断点。
// setBreakpoint('script.js', 1), sb(...) - 在 script.js 的第一行设置断点。
// clearBreakpoint('script.js', 1), cb(...) - 清除 script.js 中第一行的断点

// 信息
// backtrace, bt - 打印当前执行帧的回溯。
// list(5) - 列出具有 5 行上下文的脚本源代码（前后各 5 行）。
// watch(expr) - 将表达式添加到监视列表。
// unwatch(expr) - 从监视列表中移除表达式。
// watchers - 列出所有监视器及其值（在每个断点上自动列出）。
// repl - 在调试脚本的上下文中打开调试器的 repl 以进行运行。
// exec expr - 在调试脚本的上下文中执行表达式。

// 执行控制
// run - 运行脚本（在调试器启动时自动运行）。
// restart - 重启脚本。
// kill - 杀死脚本。

// node --inspect index.js  V8检查器