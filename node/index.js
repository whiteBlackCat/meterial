// 遍历目录；深度优先（先遍历子节点非邻节点）+先序遍历（访问时刻非最后返回时刻算遍历）
function travel(dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);

    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}

// node的Api写法分类：
// 1.Error-first Callback
// 	function(err, res) 非空的“err”相当于程序异常；而空的“err”相当于可以正常返回结果“res”，无任何异常。
// 2。EventEmitter 
// 	观察者模式“发布/订阅”（publish/subscribe）任意对象都可以发布指定事件，被 EventEmitter 实例的 on 方法监听到