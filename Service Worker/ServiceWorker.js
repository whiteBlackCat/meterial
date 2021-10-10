var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

// 当浏览器解析完ServiceWorker文件时，子线程内部触发install事件
self.addEventListener('install', function(event) {
  // Perform install steps
  // 打开一个缓存空间，将相关需要缓存的资源添加到缓存里面
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
// 这要求我们在与项目根目录下建立 main.js 和 main.css 空文件。我们可以在 Chrome 开发者工具里的“Application”菜单的“Cache Storage”中看到相应的缓存
// 这里使用了Cache API来将资源缓存起来，同时使用e.waitUntil接手一个Promise来等待资源缓存成功，
// 等到这个Promise状态成功后，ServiceWorker进入installed状态，意味着安装完毕。这时候主线程中返回的registration.waiting属性代表进入installed状态的ServiceWorker。