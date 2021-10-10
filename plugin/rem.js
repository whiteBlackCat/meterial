(function (doc, win) {
  var docEl = doc.documentElement,
    isIOS = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    dpr = isIOS ? Math.min(win.devicePixelRatio, 3) : 1,
    dpr = window.top === window.self ? dpr : 1, //被iframe引用时，禁止缩放
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  docEl.dataset.dpr = dpr;
  var recalc = function () {
    var width = docEl.clientWidth;
    if (width / dpr > 640) {
      width = 640 * dpr;
    }
    docEl.dataset.width = width;
    docEl.dataset.percent = 100 * (width / 640);
    docEl.style.fontSize = 100 * (width / 640) + 'px';
  };
  // recalc()
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
// 比起一般的多出了识别IOS设备及横屏事件   对于android高分辨率设备不管?
// 增加iframe情况处理
// 640为设计稿大小