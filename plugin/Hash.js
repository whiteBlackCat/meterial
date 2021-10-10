function HashMaker() {}
HashMaker.prototype = {
  constructor: HashMaker,
  // 已有的不在添加
  add(k, v) {
    if (!this.hasOwnProperty(k)) {
      this[k] = v;
    }
  },
  remove(k) {
    if (this.hasOwnProperty(k)) {
      delete this[k];
    }
  },
  update(k, v) {
    this[k] = v;
  },
  has(k) {
    let type = typeof k;
    if (type === 'string' || type === 'number') {
      return this.hasOwnProperty(k);
    } else if (type === 'function' && this.some(k)) {
      return true;
    }
    return false;
  },
  clear() {
    for (let k in this) {
      if (this.hasOwnProperty(k)) {
        delete this[k];
      }
    }
  },
  // 检测是否为空表
  empty() {
    for (let k in this) {
      if (this.hasOwnProperty(k)) {
        return false;
      }
    }
    return true;
  },
  // fn 分别接受 pro,key,表  不返回值
  each(fn) {
    for (let k in this) {
      if (this.hasOwnProperty(k)) {
        fn.call(this, this[k], k, this);
      }
    }
  },
  // 返回新表 
  map(fn) {
    let hash = new HashMaker;
    for (let k in this) {
      if (this.hasOwnProperty(k)) {
        hash.add(k, fn.call(this, this[k], k, this));
      }
    }
    return hash;
  },
  filter(fn) {
    let hash = new HashMaker;
    for (let k in this) {
      if (this.hasOwnProperty(k)) {
        if (fn.call(this, this[k], k, this)) {
          hash.add(k, fn.call(this, this[k], k, this));
        }
      }
    }
    return hash
  },
  // 以指定分隔符返回表内键集合字符串
  join(split) {
    split = typeof split !== 'undefined' ? split : ',';
    let rst = [];
    this.each(v => {
      rst.push(v);
    });
    return rst.join(split);
  },
  // 所有这类判断函数期望fn会返回boolean
  every(fn) {
    for (let k in this) {
      if (this.hasOwnProperty(k)) {
        if (!fn.call(this, this[k], k, this)) {
          return false;
        }
      }
    }
    return true;
  },
  some(fn) {
    for (let k in this) {
      if (this.hasOwnProperty(k)) {
        if (fn.call(this, this[k], k, this)) {
          return true;
        }
      }
    }
    return false;
  },
  find(k) {
    let type = typeof k;
    if (type === 'string' || type === 'number' && this.has(k)) {
      return this[k];
    } else if (type === 'function') {
      for (let _k in this) {
        if (this.hasOwnProperty(_k) && k.call(this, this[_k], _k, this)) {
          return this[_k];
        }
      }
    }
    return null;
  }
};

export default class Hash {
  constructor() {
    return new HashMaker()
  }
}