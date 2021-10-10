// 获取相对目标元素的鼠标位置
document.body.onclick = function (e) {
  e = e || window.event;

  var target = e.target || e.srcElement,
    style = target.currentStyle || window.getComputedStyle(target, null),
    borderLeftWidth = parseInt(style['borderLeftWidth'], 10),
    borderTopWidth = parseInt(style['borderTopWidth'], 10),
    rect = target.getBoundingClientRect(),
    offsetX = e.clientX - borderLeftWidth - rect.left,
    offsetY = e.clientY - borderTopWidth - rect.top;

  console.log([offsetX, offsetY]);
};