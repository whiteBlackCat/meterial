/**
 * 每次用户导航至使用 Service Worker 的站点时，浏览器会尝试在后台重新下载该脚本文件。
 * 这时新的 Service Worker 将会在后台安装，并在第二次访问时获取控制权，为了不与新的 Service Worker 缓存的文件冲突，
 * 我们可以使用类似 caches.open('v2') 语句来创建新的缓存目录。
 */

this.addEventListener('install', function(event) {
  event.waitUntil(
    // 创建新的缓存目录，并指定
    caches.open('v2').then(function(cache) {
      return cache.addAll([
        '/sw-test/',
        '/sw-test/index.html'
      ]);
    })
  )
})

// 当新的 Service Worker 激活，记得删除 v1 缓存目录
this.addEventListener('activate', function(event) {
  // 声明缓存白名单，该名单内的缓存目录不会被生成
  var cacheWhitelist = ['v2'];
  event.waitUntil(
    // 传给 waitUntil() 的 promise 会阻塞其他的事件，直到它完成
    // 确保清理操作会在第一次 fetch 事件之前完成
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// // 如果当前浏览器没有激活的service worker或者已经激活的worker被解雇，
// // 新的service worker进入active事件
// self.addEventListener('activate', function(e) {
//   console.log('Activate event');
//   console.log('Promise all', Promise, Promise.all);
//   // active事件中通常做一些过期资源释放的工作
//   var cacheDeletePromises = caches.keys().then(cacheNames => {
//     console.log('cacheNames', cacheNames, cacheNames.map);
//     return Promise.all(cacheNames.map(name => {
//       if (name !== cacheStorageKey) { // 如果资源的key与当前需要缓存的key不同则释放资源
//         console.log('caches.delete', caches.delete);
//         var deletePromise = caches.delete(name);
//         console.log('cache delete result: ', deletePromise);
//         return deletePromise;
//       } else {
//         return Promise.resolve();
//       }
//     }));
//   });

//   console.log('cacheDeletePromises: ', cacheDeletePromises);
//   e.waitUntil(
//     Promise.all([cacheDeletePromises]
//     )
//   )
// })

// ServiceWorker正式进入激活状态，可以拦截网络请求了。如果主线程有fetch方式请求资源，那么就可以在ServiceWorker代码中触发fetch事件
self.addEventListener('fetch', function(e) {
  console.log('Fetch event ' + cacheStorageKey + ' :', e.request.url);
  e.respondWith( // 首先判断缓存当中是否已有相同资源
    caches.match(e.request).then(function(response) {
      if (response != null) { // 如果缓存中已有资源则直接使用
        // 否则使用fetch API请求新的资源
        console.log('Using cache for:', e.request.url)
        return response
      }
      console.log('Fallback to fetch:', e.request.url)
      return fetch(e.request.url);
    })
  )
})
// 那么如果在install或者active事件中失败，ServiceWorker则会直接进入Redundant状态，浏览器会释放资源销毁ServiceWorker。

// 当浏览器解析完sw文件时，serviceworker内部触发install事件
self.addEventListener('install', function(e) {
  debugger;
  console.log('Cache event!')
  // 打开一个缓存空间，将相关需要缓存的资源添加到缓存里面
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      console.log('Adding to Cache:', cacheList)
      return cache.addAll(cacheList)
    }).then(function() {
      console.log('install event open cache ' + cacheStorageKey);
      console.log('Skip waiting!')
      return self.skipWaiting();
    })
  )
})

// 　那么如果我们在新版本中更新了ServiceWorker子线程代码，当访问网站页面时浏览器获取了新的文件，逐字节比对 /sw.js 文件发现不同时它会认为有更新启动 更新算法open_in_new，于是会安装新的文件并触发 install 事件。但是此时已经处于激活状态的旧的 Service Worker 还在运行，新的 Service Worker 完成安装后会进入 waiting 状态。直到所有已打开的页面都关闭，旧的 Service Worker 自动停止，新的 Service Worker 才会在接下来重新打开的页面里生效。如果想要立即更新需要在新的代码中做一些处理。首先在install事件中调用self.skipWaiting()方法，然后在active事件中调用self.clients.claim()方法通知各个客户端。
// 如果当前浏览器没有激活的service worker或者已经激活的worker被解雇，
// 新的service worker进入active事件
self.addEventListener('activate', function(e) {
  debugger;
  console.log('Activate event');
  console.log('Promise all', Promise, Promise.all);
  // active事件中通常做一些过期资源释放的工作
  var cacheDeletePromises = caches.keys().then(cacheNames => {
    console.log('cacheNames', cacheNames, cacheNames.map);
    return Promise.all(cacheNames.map(name => {
      if (name !== cacheStorageKey) { // 如果资源的key与当前需要缓存的key不同则释放资源
        console.log('caches.delete', caches.delete);
        var deletePromise = caches.delete(name);
        console.log('cache delete result: ', deletePromise);
        return deletePromise;
      } else {
        return Promise.resolve();
      }
    }));
  });

  console.log('cacheDeletePromises: ', cacheDeletePromises);
  e.waitUntil(
    Promise.all([cacheDeletePromises]
    ).then(() => {
      console.log('activate event ' + cacheStorageKey);
      console.log('Clients claims.')
      return self.clients.claim();
    })
  )
})
// 如果浏览器本身对sw.js进行缓存的话，也不会得到最新代码，所以对sw文件最好配置成cache-control: no-cache或者添加md5。


// 　实际过程中像我们刚才把index.html也放到了缓存中，而在我们的fetch事件中，如果缓存命中那么直接从缓存中取，这就会导致即使我们的index页面有更新，浏览器获取到的永远也是都是之前的ServiceWorker缓存的index页面，所以有些ServiceWorker框架支持我们配置资源更新策略，比如我们可以对主页这种做策略，首先使用网络请求获取资源，如果获取到资源就使用新资源，同时更新缓存，如果没有获取到则使用缓存中的资源。代码如下：
// self.addEventListener('fetch', function(e) {
//   console.log('Fetch event ' + cacheStorageKey + ' :', e.request.url);
//   e.respondWith( // 该策略先从网络中获取资源，如果获取失败则再从缓存中读取资源
//     fetch(e.request.url)
//     .then(function (httpRes) {

//       // 请求失败了，直接返回失败的结果
//       if (!httpRes || httpRes.status !== 200) {
//           // return httpRes;
//           return caches.match(e.request)
//       }

//       // 请求成功的话，将请求缓存起来。
//       var responseClone = httpRes.clone();
//       caches.open(cacheStorageKey).then(function (cache) {
//           return cache.delete(e.request)
//           .then(function() {
//               cache.put(e.request, responseClone);
//           });
//       });

//       return httpRes;
//     })
//     .catch(function(err) { // 无网络情况下从缓存中读取
//       console.error(err);
//       return caches.match(e.request);
//     })
//   )
// })


// 需要尝试,在微信上可用???