//.fire{display:block; overflow:hidden; font-size:12px; position:absolute};
// body{overflow:hidden; background:#000}
// html{overflow:hidden; background:#000}


//Fire构造函数  参数  r 大小 ,color 颜色
function Fire(r = 12, color = '#fff') {
  this.radius = r;
  this.color = color;
  this.xpos = this.ypos = this.zpos = 0;
  this.vx = this.vy = this.vz = 0;
  this.mass = 1;
  this.x = this.y = 0;

  //公共方法应放在prototype中（节省内存），但对于那些每次实例化都必须调用的方法有必要吗？？
  this.p = document.createElement("span");
  this.p.className = "fire";
  this.p.innerHTML = "*";
  this.p.style.fontSize = this.radius + "px";
  this.p.style.color = "#" + this.color;
}

Fire.prototype = {
  append: function (parent) {
    parent.appendChild(this.p);
  },
  setSize: function (scale) {
    this.p.style.fontSize = this.radius * scale + "px";
  },
  setPosition: function (x, y) {
    this.p.style.left = x + "px";
    this.p.style.top = y + "px";
  },
  setVisible: function (b) {
    this.p.style.display = b ? "block" : "none";
  }
}


var fireworks = function () {
  var fires = new Array();
  var count = 150;
  // var fl = 250;
  // var vpx = 500;
  // var vpy = 300;
  var gravity = .5; //重力
  // var floor = 200;
  // var bounce = -.8;
  var timer;
  //随机.3,.4,.5  随机乘除.25
  var wind = ((Math.floor(Math.random() * 3) + 3) / 10) * (Math.random() * 2 - 1 > 0 ? 1 : -1) * .25;
  var wpos = 0;
  var wcount;
  return {
    init: function () {
      //wount 随机50~150 整数
      wcount = 50 + Math.floor(Math.random() * 100);
      for (var i = 0; i < count; i++) {
        //color十六进制随机颜色  值得一学
        var color = 0xFF0000;
        color = (Math.random() * 0xFFFFFF).toString(16).toString().split(".")[0];
        while (color.length < 6) {
          color = "0" + color;
        }
        var fire = new Fire(12, color);
        //推入数组时间与属性修改时间无关 
        fires.push(fire);
        fire.ypos = -100;
        fire.vz = Math.random() * 6 - 3; //-3~3
        fire.vx = (Math.random() * 2 - 1) * 2; //-2~2
        fire.vy = Math.random() * -15 - 15; //-30~-15
        fire.x = 500
        fire.y = 600;
        fire.append(document.body);
      }
      var that = this;
      timer = setInterval(function () {
        wpos++;
        //wpos 与 wcount共同决定风持续时间 ，wind风的大小
        if (wpos >= wcount) {
          wpos = 0;
          wcount = 50 + Math.floor(Math.random() * 100);
          wind = ((Math.floor(Math.random() * 3) + 3) / 10) * (Math.random() * 2 - 1 > 0 ? 1 : -1) * .25;
        }
        for (var i = 0; i < count; i++) {
          that.move(fires[i]);
        }
      }, 30);
    },
    move: function (fire) {
      fire.vy += gravity;
      fire.x += fire.vx;
      fire.y += fire.vy;
      fire.vx += wind;
      fire.setPosition(fire.x, fire.y);
      //超界则回归初始
      if (fire.x < 0 || fire.x > 1000 || fire.y < 0 || fire.y > 600) {
        fire.vx = (Math.random() * 2 - 1) * 2;
        fire.vy = Math.random() * -15 - 15;
        fire.x = 500;
        fire.y = 600;
        fire.setPosition(fire.x, fire.y);
      }
    }
  }
}

fireworks().init();