// 获取绘图上下文 context
var context = wx.createContext();


// 绘制折线图
// 设置描边颜色
context.setStrokeStyle("#7cb5ec");
// 设置线宽
context.setLineWidth(4);
context.moveTo(50, 70);
context.lineTo(150, 150);
context.lineTo(250, 30);
context.lineTo(350, 120);
context.lineTo(450, 150);
context.lineTo(550, 95);
// 对当前路径进行描边
context.stroke();


// 绘制每个数据点的标识图案
context.beginPath();
// 设置描边颜色
context.setStrokeStyle("#ffffff");
// 设置填充颜色
context.setFillStyle("#7cb5ec");
context.moveTo(50 + 7, 70);
// 绘制圆形区域
context.arc(50, 70, 8, 0, 2 * Math.PI, false);
context.moveTo(150 + 7, 150);
context.arc(150, 150, 8, 0, 2 * Math.PI, false);
context.closePath();
// 填充路径
context.fill();
context.stroke();

// 参数
opts = {
    width: 640,    // 画布区域宽度
    height: 400,   // 画布区域高度
    categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2017']
}

// 我们根据参数中的categories来绘制横坐标
// 稍微整理下思路：
// 1、根据categories数均分画布宽度
// 2、计算出横坐标中每个分类的起始点
// 3、绘制文案（这儿会多一些代码，后面会具体提到）
var eachSpacing = Math.floor(opts.width / opts.categories.length);
var points = [];
// 起始点x坐标
var startX = 0;
// 起始点y坐标
var startY = opts.height - 30;
// 终点x坐标
var endX = opts.width;
// 终点y坐标
var endY = opts.height;

// 计算每个分类的起始点x坐标
opts.categories.forEach(function(item, index) {
    points.push(startX + index * eachSpacing);
});
points.push(endX);

// 绘制横坐标
context.beginPath();
context.setStrokeStyle("#cccccc");
context.setLineWidth(1);

// 绘制坐标轴横线
context.moveTo(startX, startY);
context.lineTo(endX, startY);
// 绘制坐标轴各区块竖线
points.forEach(function(item, index) {
    context.moveTo(item, startY);
    context.lineTo(item, endY);
});
context.closePath();
context.stroke();

context.beginPath();
// 设置字体大小
context.setFontSize(20);
// 设置字体填充颜色
context.setFillStyle('#666666');
opts.categories.forEach(function(item, index) {
    var offset = eachSpacing / 2 - mesureText(item) / 2;
    context.fillText(item, points[index] + offset, startY + 28);
});
context.closePath();
context.stroke();


// 计算不同字符宽度实现居中
// 这里分别处理了字母, 数字, ., -, 汉字这几个常用字符
function mesureText (text) {
    var text = text.split('');
    var width = 0;
    text.forEach(function(item) {
        if (/[a-zA-Z]/.test(item)) {
            width += 14;
        } else if (/[0-9]/.test(item)) {
            width += 11;
        } else if (/\./.test(item)) {
            width += 5.4;
        } else if (/-/.test(item)) {
            width += 6.5;
        } else if (/[\u4e00-\u9fa5]/.test(item)) {
            width += 20;
        }
    });
    return width;
}


//确定纵坐标的范围并绘制
//最简单模式:为了避免纵坐标的刻度出现小数的情况，我们把纵坐标分为5个区块，我们取最小单位刻度为例如10（能够被5整除） 

// 确定Y轴取值范围
function findRange (num, type, limit) {
    limit = limit || 10;
    
    // upper向上查找，lower向下查找
    type = type ? type : 'upper';

    // 进行取整操作，避免while时进入死循环
    if (type === 'upper') {
        num = Math.ceil(num);
    } else {
        num = Math.floor(num);
    }
    while (num % limit !== 0) {
        if (type === 'upper') {
            num++;
        } else {
            num--;
        }
    }
    return num;
}

// 动态获取参数决定y轴范围
// 预期参数
// opts = {
//     ...
//     series: [{
//             ...
//             data: [15, 20, 45, 37, 4, 80]
//         }, {
//             ...
//             data: [70, 40, 65, 100, 34, 18]
//         }
//     ]
// }

// 合并数据，将series中的每项data整合到一个数组当中
function dataCombine(series) {
    return series.reduce(function(a, b) {
        return (a.data ? a.data : a).concat(b.data);
    }, []);
}

// 根据数据范围确定最小单位刻度
function findRange (num, type, limit) {
    limit = limit || 10;
    type = type ? type : 'upper';
    var multiple = 1;
    while (limit < 1) {
        limit *= 10;
        multiple *= 10;
    }
    if (type === 'upper') {
        num = Math.ceil(num * multiple);
    } else {
        num = Math.floor(num * multiple);
    }
    while (num % limit !== 0) {
        if (type === 'upper') {
            num++;
        } else {
            num--;
        }
    }

    return num / multiple;
}

var dataList = dataCombine(opts.series);
// 获取传入数据的最小值
var minData = Math.min.apply(this, dataList);
// 获取传入数据的最大值
var maxData = Math.max.apply(this, dataList);

var limit = getLimit(maxData, minData);

var minRange = findRange(minData, 'lower', limit);
var maxRange = findRange(maxData, 'upper', limit);



// 根据真实数据绘制折线
config = {
    xAxisHeight: 30, // X轴高度
    yAxisWdith: 30   // Y轴宽度
}
var data = [15, 20, 45, 37, 4, 80];
var xPoints = [];
var validWidth = opts.width - config.yAxisWidth;
var eachSpace = validWidth / opts.categories.length;
var start = config.yAxisWidth;

data.forEach(function (item, index) {
    xPoints.push(start + (index + 0.5) * eachSpace);
});

var data = [15, 20, 45, 37, 4, 80];
var yPoints = [];
var validHeight = opts.height - config.xAxisHeight;
data.forEach(function(item) {
    var y = validHeight * (item - min) / (max - min);
    y = validHeight - y;

    yPoints.push(y);
}

// calPieData.js
export function calPieAngle (series, process = 1) {
    // 计算数据总和
    let count = 0;
    series.forEach((item) => {
        count += item.data;
    });

    // 计算出开始的弧度和所占比例
    let startAngle = 0;
    return series.map((item) => {
        // 计算出当前动画进度的比例
        item.proportion = item.data / count * process;
        item.startAngle = startAngle;
        startAngle += 2 * Math.PI * item.proportion;
        return item;
    });
}
// drawPieChart.js
import { calPieAngle } from 'calPieData'

export default function drawPieChart (series, process = 1)) {
    ...

    // 将process传入给calPieAngle，计算出对应进度下的图表角度数据
    let pieSeries = calPieAngle(series, process);
    pieSeries.forEach((item) => {
        context.beginPath();
        // 设置填充颜色
        context.setFillStyle(item.color);
        // 移动到原点
        context.moveTo(100, 100);    
        // 绘制弧度
        context.arc(100, 100, 80, item.startAngle, item.startAngle + 2 * Math.PI * item.proportion);
        context.closePath();
        context.fill();
    });

    ...

}

// 添加白线
...

context.setLineWidth(2);
context.setStrokeStyle('#ffffff');
pieSeries.forEach((item) => {
    context.beginPath();
    context.setFillStyle(item.color);
    context.moveTo(100, 100);    
    context.arc(100, 100, 80, item.startAngle, item.startAngle + 2 * Math.PI * item.proportion);
    context.closePath();
    context.fill();
    context.stroke();
})

...

// animation.js
export default function Animation (opts) {
    // 处理用户传入的动画时间，默认为1000ms
    // 因为用户有可能传入duration为0，所以不能用opts.duration = opts.duration || 1000 来做默认值处理
    // 否则用户传入0也会处理成默认值1000
    opts.duration = typeof opts.duration === 'undefined' ? 1000 : opts.duration;
    
    let startTimeStamp = null;

    function step (timestamp) {
        if (startTimeStamp === null) {
            startTimeStamp = timestamp;
        } 
        if (timestamp - startTimeStamp < opts.duration) {
            // 计算出动画的进度
            let process = (timestamp - startTimeStamp) / opts.duration;
            // 触发动画每一步的回调，传入进度process
            opts.onProcess && opts.onProcess(process);
            // 动画进行中，执行下一次动画
            requestAnimationFrame(step);
        } else {
            // 动画结束
            opts.onProcess && opts.onProcess(1);
            // 触发动画结束回调
            opts.onAnimationFinish && opts.onAnimationFinish();
        }
    }

    requestAnimationFrame(step);
}


wx.drawCanvas({
    canvasId: 'testCanvas',
    actions: context.getActions()
});