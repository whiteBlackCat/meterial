!function(w,d){
	function Z(){
		this.len = 1;
		this.dom = d.querySelectorAll(arguments[0][0]);
		if(arguments[0][1]){
			this.len = this.dom.length;
		};
		// console.log(arguments,arguments[0],arguments[0][0]);
	};
  //这里说说arguments控制台输出，arguments、callee、symbol的数组，这里callee为Z（）且第一个
  //arguments在输出显示“.classname”、callee（z函数）、symbol
  //猜测构造函数及其实例参数关系为二维数组  使用时注意控制台输出


	Z.prototype = {
		//检测this。dom     执行load
		init : function(o){
			if(!this.dom[0]){alert('Error：not find this dom');return}
			this.type =o>3 ? 0 : ( o ? o : 0);
			this.load();
		},
		//放大镜特效  遍历添加move，leave事件
		load : function(){
			var _t = this;
			for(var i=0;i<_t.len;i++){
				_t.dom[i].off = false;//加载中
				_t.dom[i].onmousemove = _t.dom[i].ontouchmove = function(ev){
					var e = ev || event;
					var dom = this;
					if(this.querySelector('.imgLoad')){return false};//找到.imgLoad  return？？？
					//第一次加载  加载中动画   
					if(!this.off){
						var img = this.querySelector('.zoom-img');
						if(!img){alert('error not find class "zoom-img"');return}
						var _lo = d.createElement('span');
						_lo.innerHTML = '加载中...';
						_lo.className = 'imgLoad';
						this.appendChild(_lo);
						//创建图片
						var _img = new Image();//image对象onload事件
						//type3创建2个？？
						_img.onload = function(){
							if(_t.type==2){
								dom.cz = d.createElement('div');
								dom.cz.className = 'cloudZoom';
								dom.cz.style.background = 'url('+ img.getAttribute('src') +')  no-repeat';
								dom.appendChild(dom.cz);
							};
							dom.w1 = this.width,dom.h1 = this.height;
							dom.w2 = img.width,dom.h2 = img.height;
							dom.scale = _t.type>= 1 ? (dom.w1 - dom.w2)/dom.w2 : dom.w1/dom.w2;
							//这里为何又不检测  onload触发图片已加载
							dom.removeChild(_lo);
							dom.off = true;
							dom.zoom = d.createElement('div');
							dom.zoom.className = _t.type==2 ? 'imgZoom3' :  (_t.type== 1 ? 'imgZoom2':  'imgZoom');
							dom.zoom.style.background =_t.type<=1 ? 'url('+ img.getAttribute('src') +')  no-repeat' : ''
							dom.appendChild(dom.zoom);
						};
						_img.src = img.src;
					}else{//移动效果部分
						var l = _t._gt(dom).left;
						var t = _t._gt(dom).top;
						this.zoom.style.display = 'block';
						if(_t.type==2){
							this.cz.style.display = 'block';
						};
						var top = document.documentElement.scrollTop || document.body.scrollTop ;
						var _bor =_t.type== 1 ? 0 : (this.zoom.offsetWidth - this.zoom.clientWidth)/2;
						var _zw = _t.type== 1 ? 0 : this.zoom.offsetWidth/2;
						var _zh = _t.type== 1 ? 0 : this.zoom.offsetHeight/2;
						var l1 = (e.clientX) - l -(_t.type== 2 ? 0 : _zw);//距中轴线的x偏移
						var t1 = (e.clientY+top) - t -(_t.type== 2 ? 0 : _zw);//这里不是_zh吗？
						if(_t.type == 0 || _t.type == 2){
							if(l1+(_t.type== 2 ? 0 : _zw)<=(_t.type== 2 ? _zw : 0)){
								l1 =(_t.type== 2 ? _zw : -_zw);
							}else if(l1+_zw>=this.w2){
								l1=this.w2-_zw;
							};
							if(t1+(_t.type== 2 ? 0 : _zw)<=(_t.type== 2 ? _zw : 0)){
								t1 =(_t.type== 2 ? _zw : -_zw);
							}else if(t1+_zw>=this.h2){
								t1=this.h2-_zw;
							};
							this.zoom.style.left = (_t.type == 2 ? (l1-_zw) : l1)+'px';
							this.zoom.style.top = (_t.type == 2 ? (t1-_zw) : t1)+'px';
						};
						if(_t.type==2){
							var px  = (l1 - _zw) /(this.w2 -  this.zoom.offsetWidth);
							var py  = (t1 - _zh) /(this.h2 -  this.zoom.offsetHeight);
							this.cz.style.backgroundPosition = (-px*(this.w1 -this.cz.offsetWidth ) -_bor)+"px "+ (-py*(this.h1 -this.cz.offsetHeight )-_bor)+"px";
						}else{
							this.zoom.style.backgroundPosition = (-(l1+_zw)*this.scale + _zw-_bor)+"px "+ (-(t1+_zw)*this.scale+_zw-_bor)+"px";
						};
					};
					if(e.preventDefault) e.preventDefault();
					else e.returnValue = false; 
					return false;
				};
				_t.dom[i].onmouseleave =_t.dom[i].ontouchend = function(){
					if(_t.type==2){
						this.off = false;
						this.querySelector('.cloudZoom') ? this.removeChild(this.querySelector('.cloudZoom')) :'';
						this.querySelector('.imgZoom3') ? this.removeChild(this.querySelector('.imgZoom3')) : '';
						this.cz ? this.cz.style.display = 'none' : '';
					};
					this.zoom ? this.zoom.style.display = 'none' : '';
				};
			};
		},
		//取得左上偏移距
		_gt : function(obj){
			var t = 0,l = 0;    
		    while(obj){    
		        t+=obj.offsetTop;    
		        l+=obj.offsetLeft;    
		        obj = obj.offsetParent;    
		    };    
		    return {top:t,left:l}; 
		}
	};
	function z(){return new Z(arguments)};
	window.zoom = z;//这一步应该是简化代码书写，也便于修改调用名
}(window,document);
//此插件为放大镜三中效果：放大镜   移动    淘宝
//调用方式 zoom('.zoomItem2').init(1);  1为type