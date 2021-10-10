//node环境无window对象
//从指定节点开始，按HTML顺序访问该树的每节点
//并依此传递节点给一个函数
var walk_the_DOM = function walk(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
        walk(node, func);
        node = node.nextSibling;
    }
};
//仅是简单覆盖,并未进行冲突处理
Object.prototype.method = function(funcName,func){
  if(typeof funcName ==="string" && typeof func ==="function"){
    if(typeof this[funcName]==="function"){
      throw(funcName + "has been overrided,please find by 'old_' prefix");
      this["old_"+funcName] = this[funcName];
    }
    this[funcName] = func;
  }
}

// 定义柯里化方法
Function.method('curry', function(){
    var slice = Array.prototype.slice,
        args = slice.apply(arguments), //arguments转数组才能使用concat方法
        that = this;
    return function() {
        return that.apply(null, args.concat(slice.apply(arguments)));
    };
});

// 简单记忆函数，fibonacci   memo为数组记录n次结果
// formula 接受二参：递归函数recur 递归次数n
var memoizer = function(memo, formula) {
    var recur = function(n) {
        var result = memo[n];
        if (typeof result !== 'number') {
            result = formula(recur, n);
            memo[n] = result;
        }
        return result;
    };
    return recur;
}

Function.prototype.method = function(funcname, func) {
    this.prototype[funcname] = func;
    return this;
};
//数字
Number.method('integer', function() {
    return Math[this < 0 ? 'ceil' : 'floor'](this);
});
// 去除字符串首位空白
String.method('trim', function() {
    return this.replace(/^\s+|\s+$/g, '');
});
//hanoi
var hanoi = function(disc, src, aux, dst) {
    if (disc > 0) {
        hanoi(disc - 1, src, dst, aux);
        document.writeIn('Move disc' + disc + 'from' + src + ' to ' + dst);
        hanoi(disc - 1, aux, src, dst);
    }
};


// part  什么功能
var eventuality = function(that) {
    var registry = {};

    that.fire = function(event) {
        // 在一个对象上触发一个事件（包含事件的字符串，
        // 拥有事件名称的type属性对象）
        // 通过on方法注册的事件处理程序中匹配事件名称的函数将被调用

        var array,
            func,
            handler,
            i,
            type = typeof event === 'string' ? event : event.type;

        //如果该事件存在一组事件处理程序，那么遍历他们并依此执行

        if (registry.hasOwnProperty(type)) {
            array = registry[type];
            for (i = 0; i < array.length; i += 1) {
                handler = array[i];

                //每个处理程序一方法和一组可选参数
                //若该方法是字符串形式，找到该函数

                func = handler.method;
                if (typeof func === 'string') {
                    func = this[func];
                }

                // 调用一个处理程序，若该条目含参数就穿参否则传该事件对象

                func.apply(this, handler.parameters || [event]);

            }
        }
        return this;
    };
    that.on = function(type, method, parameters) {
        // 注册一个事件，构造一条处理程序条目，将其插入程序数组中
        //若此类型事件不存在，构造一个

        var handler = {
            method: method,
            parameters: parameters
        };
        if (registry.hasOwnProperty(type)) {
            registry[type].push(handler);
        } else {
            registry[type] = [handler];
        }
        return this;
    };
    return that;
};

// 判断数组
var is_array = function(value) {
    return Object.prototype.toString.apply(value) === '[object Array]';
};

// 初始一维数组
Array.dim = function(dimension, initial) {
        var a = [],
            i;
        for (i = 0; i < dimension; i += 1) {
            a[i] = initial;
        }
        return a;
    }
    // 初始二维数组
Array.matrix = function(m, n, initial) {
    var a, i, j, mat = [];
    for (i = 0; j < n; j += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
            a[j] = initial;
        }
        mat[i] = a;
    }
    return mat;
}

// 对象排序
var by = function(name) {
        return function(o, p) {
            if (typeof o === 'object' && typeof p === 'object' && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return 0;
                }
                if (typeof a === typeof b) {
                    return a < b ? -1 : 1;
                } else {
                    throw {
                        name: 'Error',
                        message: 'Execpted an object when sorting by' + name
                    };
                }
            };
        };
        var s = [{
            first: 'Joe',
            last: 'Howard'
        }, {
            first: 'Moe',
            last: 'Howard'
        }, {
            first: 'Joe',
            last: 'Howard'
        }, {
            first: 'Shemp',
            last: 'Howard'
        }, {
            first: 'Larry',
            last: 'Howard'
        }, {
            first: 'Curly',
            last: 'Howard'
        }];
        s.sort(by('first'));
    }
    // sort稳定性，排序后数组中相同值相对位置的变化

Function.method('bind', function(that) {
    var method = this,
        slice = Array.prototype.slice,
        args = slice.apply(arguments, [1]);
    return function() {
        return method.apply(that, args.concat(slice.apply(arguments, [0])));
    };
});

// 创建服务器
function create_server() {
    var http = require('http');
    http.createServer(function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Hello World\n');
    }).listen(80, "127.0.0.1");

    var hostRequest = http.request(requestOptions, function(response) {
        var reponseHTML = '';
        respnse.on('data', function(chunk) {
            responseHTML = responseHTML + chunk;
        });
        response.on('end', function() {
            console.log(responseHTML);
        });
    });
};

// 解析url
function url_encode(url) {
    var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))(?:#(.*))?$/;
    var url = url || "http://www.ora.com:80/goodparts?q#fragment";
    var result = parse_url.exec(url);
    var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
    var blanks = '      ';
    var i;

    for (i = 0; i < names.length; i += 1) {
        document.writeln(names[i] + ":" + blanks.substring(names[i].length), result[i]);
    }
}

// 强制要求穿参
function param_require() {
    function mandatory() {
        throw new Error('Missing parameter');
    }

    function foo(mustBeProvided = mandatory()) {
        return mustBeProvided;
    }
    foo("123");
}


// 面向对象：封装、继承、多态
function object_oriented() {
    var Book = function(id, name, price) {
        // 私有属性
        var num = 1;
        // 私有方法
        function checkId() {};
        // 私有表示实例化后不能通过 实例[属性]方式访问
        // 特权方法  能访问私有
        this.getName = function() {};
        this.getPrice = function() {};
        this.setName = function() {};
        this.setPrice = function() {};
        // 共有属性
        this.id = id;
        // 共有方法
        this.copy = function() {};
        // 构造器
        this.setName(name);
        this.setPrice(price);
    }
}

// 每个类有3个部分：1,是构造函数内的，是供实例化对象复制用的。2,是构造函数外的，直接通过点语法添加的，这是供类使用的，实例化对象是访问不到的。3,是类的原型中的，实例化对象可以通过其原型链简介地访问到，也是为供所有实例化对象所共有的。
function inheritance() {
    // 类继承   这么说我一用的就是这个了  缺点：子类实例 从父类继承的属性会 相互影响
    function SuperClass() {};
    SuperClass.prototype.getSuperValue = function() {};

    function SubClass() {};
    SubClass.prototype = new SuperClass();
    SubClass.prototype.getSuperValue = function() {};

    // 构造函数
    function SperClass(id) {
        this.books = ['JavaScript', 'html', 'css'];
        this.id = id;
    }
    SuperClass.prototype.showBooks = function() {};

    function subClass(id) {
        superClass.call(this, id);
    }


    // 组合式
    function SuperClass(name) {
        this.name = name;
        this.books = ['html', 'css', 'JavaScript'];
    }
    SuperClass.prototype.getName = function() {};

    function SubClass(name, time) {
        superClass.call(this, name);
        this.time = time;
    }
    subClass.prototype = new SuperClass();
    SubClass.prototype.getTime = function() {};

    // 原型式
    function inheritObject(o) {
        function F() {};
        F.prototype = o;
        return new F();
    }

    // 寄生式 原型式后与添加属性过程封装


    // 对象冒充
    function ClassA(paramColor) {
        this.color = paramColor;
        this.sayColor = function() {};
    }

    function ClassB(paramColor, name) {
        //冒充并实现classA中的成员  借用其函数字面量，当然不会使用new，this指向ClassB
        this.newMethod = ClassA;
        this.newMethod(paramColor);
        //删除掉对ClassA类冒充所使用的函数对象。
        delete this.newMethod;

        this.name = name;
        this.sayName = function() {
            alert(this.name);
        }
    }
    // 子类ClassB定义的对象并不同属其父类的实例，这种方式实现的继承并不是实际意义上的继承， 此外，这种方式只能模仿实现父类构造函数中定义的成员，对于父类中通过prototype定义的成员将不能继承。
    //通过反射机制和prototype实现继承
    //遍历基类的原型对象来给自己的原型赋值
    // for (var p in ClassA.prototype) {
    //     ClassB.prototype[p] = ClassA.prototype[p];
    // } 
    // 不能继承基类构造函数中定义的成员  for in访问不到内置属性
    // 
    // 
    // 多态
    //抽象类
    //面向对象编程中的多态主要是通过抽象类和抽象函数实现的，js中也可以从这两个方面实现多态。传统意义上的多态，是通过派生类继承并实现基类中的抽象（虚）函数来实现的，含有抽象函数的类是抽象类，抽象类是不能够实例化的，同时，抽象函数没有函数体，也不能够直接调用，只能有派生类继承并实现。在高级程序语言中，上述这些检测均在程序编译时进行，不符合要求的程序编译将不通过，但是在js中，有了些许变化：

    // 1.　js是解释性语言，不需要进行预编译，所以js中抽象类和抽象函数的使用并没有那么严格的要求。

    // 2.　js中可以对未定义的方法进行调用，当然这一过程会报错，而检测时在执行调用时进行的。
    // function ClassA() { throw new Error("can't instantiate abstract classes."); }
    // ClassA.prototype = {
    //     initial: function() { throw new Error("can't call abstract methods."); }
    // }

    // //ClassA作为基类派生出ClassB
    // var ClassB = ClassA.extend(function(name) {
    //     this.name = name;
    // }, {
    //     //实现基类中的抽象方法
    //     initial: function() {
    //         console.log(this.name);
    //     }
    // },
    // {
    //     //无静态成员
    // });
}


// 简化输出
function log() {
    console.log.apply(console, arguments);
};

function log_app() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('(app)');

    console.log.apply(console, args);

    //  var foo = {
    //    bar : 1,
    //    eventBind: function(){
    //        $('.someClass').on('click',function(event) {
    //            /* Act on the event */
    //            console.log(this.bar);      //1
    //        }.bind(this));
    //    }
    // }
    // bind还是挺神奇的 注意不会立即执行！
};

// 滚轮兼容
// Mousewheel：wheeldelta   +/-120
// DOMmouseScroll:   detail   -/+3   (firefox)
var EventUtil = {   
    getWheelDelta: function(event) {       
        if (event.wheelDelta) {           
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);       
        } else {           
            return -event.detail * 40;       
        }   
    }
};
// 检查浏览器
function checkbrowse() { 
    var ua = navigator.userAgent.toLowerCase(); 
    var is = (ua.match(/\b(chrome|opera|safari|msie|firefox)\b/) || ['', 'mozilla'])[1]; 
    var r = '(?:' + is + '|version)[\\/: ]([\\d.]+)'; 
    var v = (ua.match(new RegExp(r)) || [])[1]; 
    jQuery.browser.is = is; 
    jQuery.browser.ver = v; 
    return { 
        'is': jQuery.browser.is,
         
        'ver': jQuery.browser.ver 
    } 
};

// 创建XHR对象
function createXHR() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != 'undefined') {
        if (typeof arguments.callee.activeXString != 'string') {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                i, len;
            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                } catch (ex) {}
            }
            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Error("No XHR object available.");
        }
    }
}
// open('method','url',bool) send abort

// 事件处理函数
// 在调用open()方法之前指定onreadystatechange事件处理函数才能确保跨浏览器兼容性
var complete = function() {
    if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            if (params.success) {
                params.success(xhr.responseText); //执行调用ajax时指定的success函数
            }
        } else {
            if (params.fail) {
                params.fail(); //执行调用ajax时指定的fail函数
            } else {
                throw new Error("Request was unsucessful:" + xhr.status);
            }
        }
    }
};

//浏览器检测
var agent = '',opera = {}, document={};
var browser = {                
  ie:/(msie\s|trident.*rv:)([\w.]+)/.test(agent),
  opera:(!!opera && opera.version),
  webkit:(agent.indexOf('applewebkit/') > -1),
  mac:(agent.indexOf('macintosh') > -1),
  quirks:(document.compatMode == 'BackCompat')          
};   

// //瀑布流插件  使用 new Waterfall(options)
// //options = {
// //   containerSelector:'.wf-container',//瀑布流容器
// //   boxSelector:'.wf-box',  //子项
// //   minBoxWidth:250,  //盒子宽度
// //}
// //列类名:'.wf-column';
// (function() {
//   var Waterfall = function(opts) {
//     var minBoxWidth;
//     Object.defineProperty(this, 'minBoxWidth', {
//       get: function() { return minBoxWidth; },
//       set: function(value) {
//         if(value < 100) value = 100;
//         if(value > 1000) value = 1000;
//         minBoxWidth = value;
//       }
//     });
  
//     opts = opts || {};
//     var containerSelector = opts.containerSelector || '.wf-container';
//     var boxSelector = opts.boxSelector || '.wf-box';
  
//     // init properties
//     this.minBoxWidth = opts.minBoxWidth || 250;
//     this.columns = [];
//     this.container = document.querySelector(containerSelector);
//     this.boxes = this.container ? 
//       Array.prototype.slice.call(this.container.querySelectorAll(boxSelector)) : [];
  
//     // compose once in constructor
//     this.compose();
  
//     // handle the image or something which might change size after loaded
//     var images = this.container.querySelectorAll('img'), that = this;
//     var clr;
//     for (var i = 0,imgLen = images.length; i < imgLen; i++) {
//       images[i].onload = function() {
//         if(clr) clearTimeout(clr);//所有图片加载完进行一次重绘 .5s为判断
//         clr = setTimeout(function() {
//           that.compose(true);
//         }, 500);
//       }
//     }
  
//     window.addEventListener('resize', function() {
//       that.compose();
//     });
//   }
  
//   // compute the number of columns under current setting
//   Waterfall.prototype.computeNumberOfColumns = function() {
//     var num = Math.floor(this.container.clientWidth / this.minBoxWidth);
//     return num || 1;
//   }
  
//   // init enough columns and set the width
//   Waterfall.prototype.initColumns = function(num) {
//     if(num > 0) {
//       // create column div
//       this.columns = [];
//       var width = (100 / num) + '%';
//       while(num--) {
//         var column = document.createElement('div');
//         column.className = 'wf-column';
//         column.style.width = width;
//         this.columns.push(column);
//         this.container.appendChild(column);
//       }
//     }
//   }
  
//   // get the index of shortest column
//   Waterfall.prototype.getMinHeightIndex = function() {
//     //由于空数组为真,判断无意义
//     if(this.columns.length > 0) {
//       var min = this.columns[0].clientHeight, index = 0, len = this.columns.length;
//       var columnElem;
//       for (var i = 1; i < len; i++) {
//         columnElem = this.columns[i];
//         if(columnElem.clientHeight < min) {
//           min = columnElem.clientHeight;
//           index = i;
//         }
//       }
//       return index;
//     }
//     else return -1;//记得给出异常code
//   }
  
//   // compose core
//   Waterfall.prototype.compose = function(force) {
//     var num = this.computeNumberOfColumns();
//     var cols = this.columns.length,
//       colEle, boxEle, i = 0;
      
//     if(force || num != cols) {
//       // remove old column
//       // for (var i = 0; i < this.columns.length; i++) {
//       //   var columnElem = this.columns[i];
//       //   columnElem.remove();
//       // }
//       while(colEle = this.columns.shift()){
//         colEle.remove();
//       }
  
//       // init new column
//       this.initColumns(num);
  
//       // compose
//       // for (var i = 0, l = this.boxes.length; i < l; i++) {
//       //   // var box = this.boxes[i];
//       //   this.addBox(this.boxes[i]);
//       // }
//       while(boxEle = this.boxes[i++]){
//         this.addBox(boxEle);
//       }
//     }
//   }
  
//   // add a new box to grid
//   Waterfall.prototype.addBox = function(elem) {
//     // push if new box
//     if(this.boxes.indexOf(elem) < 0) this.boxes.push(elem);
//     var columnIndex = this.getMinHeightIndex();
//     if(columnIndex > -1) {
//       var column = this.columns[columnIndex];
//       column.appendChild(elem);
//     }
//   }
//   window.Waterfall = Waterfall;
// })();


// 增加样式表
function addCSSRule(sheet, selector, rules, index) {
    if (sheet.insertRule) {
        sheet.insertRule(selector + "{" + rules + "}", index);
    } else {
        sheet.addRule(selector, rules, index);
    }
}
// Use it!
// addCSSRule(document.styleSheets[0], "header", "float: left");
 

// 分离查询参数
// 方法一：正则分析法
function getQueryString(name) {
var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
var r = window.location.search.substr(1).match(reg);
if (r != null) return unescape(r[2]); return null;
}

// 方法二：采用split拆成数组
function GetRequest() {
   var url = location.search; 
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}


// (function(global) { 
//     // 判断是否具有宿主属性 
//     function areHostMethods(object) { 
//         var methodNames = Array.prototype.slice.call(arguments, 1),
//              
//             t, i, len = methodNames.length; 
//         for (i = 0; i < len; i++) { 
//             t = typeof object[methodNames[i]]; 
//             if (!(/^(?:function|object|unknown)$/).test(t)) return false; 
//         } 
//         return true; 
//     } 
//     // 获取唯一ID 
//     var getUniqueId = (function() { 
//         if (typeof document.documentElement.uniqueID !== 'undefined') { 
//             return function(element) { 
//                 return element.uniqueID; 
//             }; 
//         } 
//         var uid = 0; 
//         return function(element) { 
//             return element.__uniqueID || (element.__uniqueID = 'uniqueID__' + uid++); 
//         }; 
//     })(); 
//     // 获取/设置元素标志 
//     var getElement, setElement; 
//     (function() { 
//         var elements = {}; 
//         getElement = function(uid) { 
//             return elements[uid]; 
//         }; 
//         setElement = function(uid, element) { 
//             elements[uid] = element; 
//         }; 
//     })(); 
//     // 独立创建监听 
//     function createListener(uid, handler) { 
//         return { 
//             handler: handler,
//             wrappedHandler: createWrappedHandler(uid, handler) 
//         }; 
//     } 
//     // 事件句柄包装函数 
//     function createWrappedHandler(uid, handler) { 
//         return function(e) { 
//             handler.call(getElement(uid), e || window.event); 
//         }; 
//     } 
//     // 分发事件 
//     function createDispatcher(uid, eventName) { 
//         return function(e) { 
//             if (handlers[uid] && handlers[uid][eventName]) { 
//                 var handlersForEvent = handlers[uid][eventName]; 
//                 for (var i = 0, len = handlersForEvent.length; i < len; i++) { 
//                     handlersForEvent[i].call(this, e || window.event); 
//                 } 
//             } 
//         } 
//     } 
//     // 主函数体 
//     var addListener, removeListener,  
//         shouldUseAddListenerRemoveListener = ( 
//             areHostMethods(document.documentElement, 'addEventListener', 'removeEventListener') &&  
//             areHostMethods(window, 'addEventListener', 'removeEventListener')),
//          
//         shouldUseAttachEventDetachEvent = ( 
//             areHostMethods(document.documentElement, 'attachEvent', 'detachEvent') &&  
//             areHostMethods(window, 'attachEvent', 'detachEvent')),
//          
//         // IE branch 
//         listeners = {},
//          
//         // DOM L0 branch 
//         handlers = {}; 
//     if (shouldUseAddListenerRemoveListener) { 
//         addListener = function(element, eventName, handler) { 
//             element.addEventListener(eventName, handler, false); 
//         }; 
//         removeListener = function(element, eventName, handler) { 
//             element.removeEventListener(eventName, handler, false); 
//         }; 
//     } 
//     else if (shouldUseAttachEventDetachEvent) { 
//         addListener = function(element, eventName, handler) { 
//             var uid = getUniqueId(element); 
//             setElement(uid, element); 
//             if (!listeners[uid]) { 
//                 listeners[uid] = {}; 
//             } 
//             if (!listeners[uid][eventName]) { 
//                 listeners[uid][eventName] = []; 
//             } 
//             var listener = createListener(uid, handler); 
//             listeners[uid][eventName].push(listener); 
//             element.attachEvent('on' + eventName, listener.wrappedHandler); 
//         }; 
//         removeListener = function(element, eventName, handler) { 
//             var uid = getUniqueId(element),
//                 listener; 
//             if (listeners[uid] && listeners[uid][eventName]) { 
//                 for (var i = 0, len = listeners[uid][eventName].length; i < len; i++) { 
//                     listener = listeners[uid][eventName][i]; 
//                     if (listener && listener.handler === handler) { 
//                         element.detachEvent('on' + eventName, listener.wrappedHandler); 
//                         listeners[uid][eventName][i] = null; 
//                     } 
//                 } 
//             } 
//         }; 
//     } 
//     else { 
//         addListener = function(element, eventName, handler) { 
//             var uid = getUniqueId(element); 
//             if (!handlers[uid]) { 
//                 handlers[uid] = {}; 
//             } 
//             if (!handlers[uid][eventName]) { 
//                 handlers[uid][eventName] = []; 
//                 var existingHandler = element['on' + eventName]; 
//                 if (existingHandler) { 
//                     handlers[uid][eventName].push(existingHandler); 
//                 } 
//                 element['on' + eventName] = createDispatcher(uid, eventName); 
//             } 
//             handlers[uid][eventName].push(handler); 
//         }; 
//         removeListener = function(element, eventName, handler) { 
//             var uid = getUniqueId(element); 
//             if (handlers[uid] && handlers[uid][eventName]) { 
//                 var handlersForEvent = handlers[uid][eventName]; 
//                 for (var i = 0, len = handlersForEvent.length; i < len; i++) { 
//                     if (handlersForEvent[i] === handler) { 
//                         handlersForEvent.splice(i, 1); 
//                     } 
//                 } 
//             } 
//         }; 
//     } 
//     global.addListener = addListener; 
//     global.removeListener = removeListener; 
// })(this);


// 事件节流:避免连续重复触发
function throttle(fn, interval) {   
    var doing = false;   
    return function() {    
        if (doing) {     
            return;    
        }    
        doing = true;    
        fn.apply(this, arguments);    
        setTimeout(function() {     
            doing = false;    
        }, interval);   
    }  
}


function rangChange() {
    var sel = window.getSelection() || window.document.selection;//selection对象
    var range = sel.getRangeAt(0) || sel.createRange();//获取range对象
    if (range.startContainer) { // DOM下 
        sel.removeAllRanges();  // 删除Selection中的所有Range 
        range.deleteContents(); // 清除Range中的内容 
                                
        var container = range.startContainer; // 获得Range中的第一个html结点  
        
        var pos = range.startOffset;  // 建一个空Range 
         
        range = document.createRange();  // 插入内容 
         
        var cons = document.createTextNode(",:),"); 
        if (container.nodeType == 3) { // 如是一个TextNode 
             
            container.insertData(pos, cons.nodeValue);  // 改变光标位置 
             
            range.setEnd(container, pos + cons.nodeValue.length); 
            range.setStart(container, pos + cons.nodeValue.length); 
        } else { // 如果是一个HTML Node 
             
            var afternode = container.childNodes[pos]; 
            container.insertBefore(cons, afternode); 
            range.setEnd(cons, cons.nodeValue.length); 
            range.setStart(cons, cons.nodeValue.length); 
        } 
        sel.addRange(range);
    } else { // IE下 
         
        var cnode = range.parentElement(); 
        while (cnode.tagName.toLowerCase() != 'body') { 
            cnodecnode = cnode.parentNode; 
        } 
        if (cnode.id && cnode.id == 'rich_txt_editor') { 
            range.pasteHTML(",:),"); 
        }
    }
    window.focus();

    // innerHTML 和 pasteHTML 区别
    // innerHTML 是一个属性，可以取得或者设定该元素内的 HTML 内容，可以是任意能包含 HTML 子节点的元素都使用它
    // pasteHTML()是一个方法，在指定的文字区域内替换该区域内的文本或者HTML，该方法必须应用于一个 createTextRange() 或者 document.selection.createRange() 创建的区域上


    // 2个步骤：
    // ① 获取DIV中的光标位置
    // ② 改变光标位置
    var cursor = 0; // 光标位置  
    document.onselectionchange = function() {
        var range = document.selection.createRange();
        var srcele = range.parentElement(); //获取到当前元素
        var copy = document.body.createTextRange();
        copy.moveToElementText(srcele);
        for (cursor = 0; copy.compareEndPoints("StartToStart", range) < 0; cursor++) { 
            copy.moveStart("character", 1); //改变光标位置，实际上我们是在记录cursor的数量.
        }
    }

    // 给document绑定光标变化事件。用来记录光标位置.
    // 这样就可以拿到DIV的光标位置了.
    function moveEnd(obj) {
        lyTXT1.focus();
        var r = document.selection.createRange();
        //因为这里死从当前光标开始移动的(好像文本框的是从0算起.)所以我们需要拿到当前光标位置，然后就可以计算出要移动多少位了，这样就可以把光标移动到想要的位置了
        r.moveStart('character', lyTXT1.innerText.length - cursor);
        r.collapse(true);
        r.select();
    }
}


// 自定义事件
var EventTarget = function() {
    this._listener = {};
};
EventTarget.prototype = {
    constructor: this,
    //将某个事件添加至事件池
    addEvent: function(type, fn) {
        if (typeof type === "string" && typeof fn === "function") {
            if (typeof this._listener[type] === "undefined") {
                this._listener[type] = [fn];
            } else {
                this._listener[type].push(fn);    
            }
        } else if(typeof type === "object"){
            var evtType;
            for (evtType in type) {
            // 若定义了Object.prototype.method会失败 无法push 为此
                if ( type.hasOwnProperty(evtType) && typeof type[evtType] === "function") {
                    this.addEvent(evtType, type[evtType]);    
                }
            }
        }
        return this;
    },
    //触发事件池内某类所有事件
    fireEvent: function(type) {
        if (type && this._listener[type]) {
            var events = {
                type: type,
                target: this    
            };
            for (var length = this._listener[type].length, start=0; start<length; start+=1) {
                this._listener[type][start].call(this, events);
            }
        }else if(type instanceof Array){    //触发事件数组
          for (var i=0, length = type.length; i<length; i+=1) {
                this.fireEvent(type[i]);
            }
        }
        return this;
    },
    //积极使用已定义的方法递归
    removeEvent: function(type, key) {
        var listeners = this._listener[type];
        if (listeners instanceof Array) {
            if (typeof key === "function") {
                for (var i=0, length=listeners.length; i<length; i+=1){
                    if (listeners[i] === key){
                        listeners.splice(i, 1);
                        break;
                    }
                }
            } else if (key instanceof Array) {
                for (var lis=0, lenkey = key.length; lis<lenkey; lis+=1) {
                    this.removeEvent(type, key[lenkey]);
                }
            } else {
                delete this._listener[type];
            }
        }
        return this;
    }
};

// 简化打印
function log(){
  console.log.apply(null, arguments);
}


// 装饰器函数(Decorator)：给对象动态添加某功能，较原型灵活（无众多子类，仅扩展一功能浪费）
// 观察:必有一参数为函数,并由此函数接受处理其余参数
// 1 动态添加onload监听函数
function addLoadEvent(fn) {
    var oldEvent = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = fn;
    } else {
        window.onload = function() {
            oldEvent();
            fn();
        };
    }
}
// 2 前置执行函数
Function.prototype.before = function(beforfunc) {
    var self = this;
    var outerArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
        var innerArgs = Array.prototype.slice.call(arguments);
        beforfunc.apply(this, innerArgs);
        self.apply(this, outerArgs);
    };
};
// 3 函数执行时间计算
function logfunc(func) {
    return function(...args) {
        const start = Date.now();
        let result = func(...args);
        const used = Date.now() - start;
        log(`call ${func.name} (${args}) used ${used} ms.`);
        return result;
    };
}
function calculate(times) {
    let sum = 0;
    let i = 1;
    while (i < times) {
        sum += i;
        i++;
    }
    return sum;
}
log(logfunc(calculate)(100000));

// 靠谱的延迟函数?
 

// 滚动条
// Firefox：DOMMouseScroll，需用监听事件 event.detail:向下 3
// 其他：onmousewheel event.wheelDelta:向下 -120
// 兼容部分：event.type|screenX/Y|clientX/Y|altKey|shiftKey|cancelBubble
// 不兼容的部分:IE6-8的event.srcElement与其他浏览器的event.target
/**
 * 简易的事件添加方法
 */
// define(function(require, exports, module) {
//     exports.addEvent = (function(window, undefined) {   
//         //对event对象兼容处理 
//         var _eventCompat = function(event) {
//             var type = event.type;
//             if (type == 'DOMMouseScroll' || type == 'mousewheel') {
//                 event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
//             }
//             if (event.srcElement && !event.target) {
//                 event.target = event.srcElement;    
//             }
//             if (!event.preventDefault && event.returnValue !== undefined) {
//                 event.preventDefault = function() {
//                     event.returnValue = false;
//                 };
//             }
//             /* 
//                ......其他一些兼容性处理 */
//             return event;
//         };
//         if (window.addEventListener) {
//             return function(el, type, fn, capture) {
//                 if (type === "mousewheel" && document.mozFullScreen !== undefined) {
//                     type = "DOMMouseScroll";
//                 }
//                 el.addEventListener(type, function(event) {
//                     fn.call(this, _eventCompat(event));
//                 }, capture || false);
//             }
//         } else if (window.attachEvent) {
//             return function(el, type, fn, capture) {
//                 el.attachEvent("on" + type, function(event) {
//                     event = event || window.event;
//                     fn.call(el, _eventCompat(event));    
//                 });
//             }
//         }
//         return function() {};    
//     })(window);        
// });
// // 使用mousewheel:
// addEvent(dom, "mousewheel", function(event) {
//     if (event.delta < 0) { alert("鼠标向上滚了！"); }
// });


// /**
//  * 简易的列表左右滑动切换效果
//  * 鼠标事件是关键，因此，一些数值写死在方法中，纯测试用
//  */
// define(function(require, exports, module) {
//     var Event = require("/study/201304/addEvent.js");
//     var _move = function(ele, to, from) {
//         // 动画实现
//         // ...
//     };
//     return {
//         index: 0,
//         visible: 4,
//         init: function(box) {
//             // box指滚动的列表容器
//             var self = this
//               , length = box.getElementsByTagName("li").length;
//             Event.addEvent(box.parentNode, "mousewheel", function(event) {
//                  if (event.delta > 0 && self.index > 0) {
//                     // 往上滚
//                     self.index--;
//                  } else if (event.delta < 0 && self.index < length - self.visible) {
//                      // 往下
//                      self.index++;                     
//                  } else {
//                     return; 
//                  }
//                  _move(box, -1 * self.index * 140);    
             
//                  event.preventDefault();
//             });
//         }
//     };
// });

// //页面位置及窗口大小  
// function getPageSize(){
//   var  scrW,  scrH;
//     if (window.innerHeight && window.scrollMaxY) { // Mozilla      
//       scrW = window.innerWidth + window.scrollMaxX;      
//       scrH = window.innerHeight + window.scrollMaxY;   
//     }else if(document.body.scrollHeight > document.body.offsetHeight) { // all but IE Mac      
//       scrW = document.body.scrollWidth;      
//       scrH = document.body.scrollHeight;   
//     }else if(document.body){  // IE Mac      
//       scrW  =  document.body.offsetWidth;        
//       scrH  =  document.body.offsetHeight;  
//     }
//     var  winW,  winH; 
//     if(window.innerHeight){  // all except IE      
//       winW = window.innerWidth;   
//       winH = window.innerHeight;   
//     }else if(document.documentElement && document.documentElement.clientHeight) { //IE 6 Strict Mode      
//       winW = document.documentElement.clientWidth;       
//       winH = document.documentElement.clientHeight;   
//     }else if(document.body){
//       winW  =  document.body.clientWidth;      
//       winH  =    document.body.clientHeight;   
//     }// for small pages with total size less   
//     // then  the  viewport   
//     var pageW  =   (scrW < winW)  ?  winW  :  scrW;   
//     var pageH  =     (scrH < winH)  ?  winH  :  scrH;      
//     return {
//       PageW: pageW,
//       PageH: pageH,
//       WinW: winW,
//       WinH: winH
//     };   
// }; //滚动条位置  
// function GetPageScroll() {   
//     var  x,  y;   
//     if(window.pageYOffset) { // all except IE      
//       y =    window.pageYOffset;      
//       x =  window.pageXOffset;   
//     }else if(document.documentElement && document.documentElement.scrollTop) { // IE 6 Strict      
//       y =  document.documentElement.scrollTop;      
//       x =  document.documentElement.scrollLeft;   
//     }else if(document.body){ // all   
//       y =  document.body.scrollTop;      
//       x =  document.body.scrollLeft;     
//     }   
//     return  {
//       X: x,
//       Y: y
//     };    
// };

// 注意禁止缩放和滚动
// var slider = {
//     //判断设备是否支持touch事件
//     touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
//     slider: document.getElementById('slider'),
//     //事件
//     events: {
//         index: 0, //显示元素的索引
//         slider: this.slider, //this为slider对象
//         icons: document.getElementById('icons'),
//         icon: this.icons.getElementsByTagName('span'),
//         handleEvent: function(event) {
//             var self = this; //this指events对象
//             if (event.type == 'touchstart') {
//                 self.start(event);
//             } else if (event.type == 'touchmove') {
//                 self.move(event);
//             } else if (event.type == 'touchend') {
//                 self.end(event);
//             }
//         },
//         //滑动开始
//         start: function(event) {
//             var touch = event.targetTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
//             startPos = {
//                 x: touch.pageX,
//                 y: touch.pageY,
//                 time: +new Date
//             }; //取第一个touch的坐标值
//             isScrolling = 0; //这个参数判断是垂直滚动还是水平滚动
//             this.slider.addEventListener('touchmove', this, false);
//             this.slider.addEventListener('touchend', this, false);
//         },
//         //移动
//         move: function(event) {
//             //当屏幕有多个touch或者页面被缩放过，就不执行move操作
//             if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
//             var touch = event.targetTouches[0];
//             endPos = {
//                 x: touch.pageX - startPos.x,
//                 y: touch.pageY - startPos.y
//             };
//             isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
//             if (isScrolling === 0) {
//                 event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
//                 this.slider.className = 'cnt';
//                 this.slider.style.left = -this.index * 600 + endPos.x + 'px';
//             }
//         },
//         //滑动释放
//         end: function(event) {
//             var duration = +new Date - startPos.time; //滑动的持续时间
//             if (isScrolling === 0) { //当为水平滚动时
//                 this.icon[this.index].className = '';
//                 if (Number(duration) > 10) {
//                     //判断是左移还是右移，当偏移量大于10时执行
//                     if (endPos.x > 10) {
//                         if (this.index !== 0) this.index -= 1;
//                     } else if (endPos.x < -10) {
//                         if (this.index !== this.icon.length - 1) this.index += 1;
//                     }
//                 }
//                 this.icon[this.index].className = 'curr';
//                 this.slider.className = 'cnt f-anim';
//                 this.slider.style.left = -this.index * 600 + 'px';
//             }
//             //解绑事件
//             this.slider.removeEventListener('touchmove', this, false);
//             this.slider.removeEventListener('touchend', this, false);
//         }
//     },
//     //初始化
//     init: function() {
//         var self = this; //this指slider对象
//         if (!!self.touch) self.slider.addEventListener('touchstart', self.events, false); //addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性
//     }
// };
// slider.init();

// Duff device：大数据效果显著（去掉多余的7次判断）
function duff(array, mapper) {
  var n = Math.floor(array.length / 8);
  var l = array.length % 8;
  var i = 0;
  if (l > 0) {
    do {
      mapper(array[i++]);
    } while (--l > 0);
  }
  do {
    mapper(array[i++]);
    mapper(array[i++]);
    mapper(array[i++]);
    mapper(array[i++]);
    mapper(array[i++]);
    mapper(array[i++]);
    mapper(array[i++]);
    mapper(array[i++]);
  } while (--n > 0);
}


// 科里化应用：多用于伪数组（arguments，JQ对象）使用原生数组方法。
// 柯里化思想：首先形成一个不销毁的作用域，再把需预处理的内容都储存在这个不销毁的作用域中，并且返回一个小函数。
// 柯里化是把接受多个参数的函数变换成接受一个单一参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术
// 而反柯里花化顾名思义:obj.foo(arg1, arg2)转换成另外一个签名如下的函数: foo(obj, arg1, arg2)
Function.prototype.uncurry = function() { 
    var f = this; 
    return function() { 
        return f.call.apply(f, arguments) 
    }; 
}; 
// 高阶函数是实现currying的基础, 所谓高阶函数至少满足这2个特性：
// 1，函数可以当作参数传递; 2，函数可以作为返回值。
// Q:如何理解?
// A:反科里化是个无参函数,返回一个函数(return func),该函数接受参数    call,apply如何理解?


function aaa(){}
Function.method('func1',function(){log("i'm "+'func1');return this});
Function.method('func2',function(){log("i'm "+'func2');return this});
aaa.func1.func2();