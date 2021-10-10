self.addEventListener('fetch', function(event) {
  event.respondWith(
    // 以下方法检视请求，并从服务工作线程所创建的任何缓存中查找缓存的结果。
    caches.match(event.request)
      .then(function(response) {
        console.log(event.request)
        console.log(caches)
        // 如果发现匹配的响应，则返回缓存的值
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
// 我们可以告诉 Service Worker 如何使用这些缓存文件，并通过 fetch 事件来捕获。
// fetch 事件只会在浏览器准备请求 Service Worker 控制的资源时才会被触发。
// 这些资源包括了指定的 scope 内的文档，和这些文档内引用的其他任何资源