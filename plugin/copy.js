/** 
 * 深拷贝
 * @description: 将第一个参数属性拷贝到第二参数并返回二参 
 * @param {Object} target 拷贝对象
 */
const deepCopy = (target, copy = {}) => {
  Object.keys(target).forEach(key => {
    if (typeof target[key] === "object") {
      //先判断一下obj[pro]是不是一个对象 
      copy[key] = target[key].constructor === Array ? [] : {}; // 没有此句,copy[key]为undefined,调用时被替换成{}
      deepCopy(target[key], copy[key]);
    } else {
      copy[key] = target[key]; //如果不是对象，直接等于即可，不会发生引用。
    }
  })
  return copy; //然后在把复制好的对象给return出去
};

/**
 * 浅拷贝
 * @param {Object} target 拷贝对象
 * @return Object 拷贝
 */
const copy = (target, copy = {}) => {
  return Object.assign(copy, target)
}