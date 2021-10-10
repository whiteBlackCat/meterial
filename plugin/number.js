var Sakri = {}
//return number between 1 and 0    计算一维区间概率
Sakri.normalize = function (value, minimum, maximum) {
  return (value - minimum) / (maximum - minimum);
};

//map normalized number to values  将范围比例拉伸
Sakri.interpolate = function (normValue, minimum, maximum) {
  return minimum + (maximum - minimum) * normValue;
};

//map a value from one set to another
Sakri.map = function (value, min1, max1, min2, max2) {
  return Sakri.interpolate(Sakri.normalize(value, min1, max1), min2, max2);
};

Sakri.getRandomNumberInRange = function (min, max) {
  return min + Math.random() * (max - min);
};

Sakri.getRandomIntegerInRange = function (min, max) {
  return Math.round(Sakri.getRandomNumberInRange(min, max));
};

// 浮点数误差来源于小数转二进制
// IEEE制定的浮点数表示法，用符号、指数和尾数来表示，底数定为2——即把一个浮点数表示为尾数乘以2的指数次方再添上符号。下面是具体的规格： 
// 符号位 阶码 尾数 长度 
// float     1          8        23      32 
// double          1         11        52      64
// 以下通过几个例子讲解浮点数如何转换为二进制数
// 例一：
// 已知：double类型38414.4。
// 求：其对应的二进制表示。
// 分析：double类型共计64位，折合8字节。由最高到最低位分别是第63、62、61、……、0位： 
// 最高位63位是符号位，1表示该数为负，0表示该数为正； 
//     62-52位，一共11位是指数位； 
//     51-0位，一共52位是尾数位。 
// 步骤：按照IEEE浮点数表示法，下面先把38414.4转换为十六进制数。 
// 把整数部和小数部分开处理:整数部直接化十六进制：960E。小数的处理: 
// 0.4=0.5*0+0.25*1+0.125*1+0.0625*0+…… 
// 实际上这永远算不完！这就是著名的浮点数精度问题。所以直到加上前面的整数部分算够53位就行了。隐藏位技术：最高位的1不写入内存（最终保留下来的还是52位）。 
// 如果你够耐心，手工算到53位那么因该是：38414.4(10)=1001011000001110.0110011001100110011001100110011001100(2)

// 科学记数法为：1.001011000001110 0110011001100110011001100110011001100，右移了15位，所以指数为15。或者可以如下理解：

// 1.001011000001110 0110011001100110011001100110011001100×2^15 
// 于是来看阶码，按IEEE标准一共11位，可以表示范围是-1024 ~ 1023。因为指数可以为负，为了便于计算，规定都先加上1023(2^10-1)，在这里，阶码：15+1023=1038。二进制表示为：100 00001110； 
// 符号位：因为38414.4为正对应 为0； 
// 合在一起（注：尾数二进制最高位的1不要）： 
// 01000000 11100010 11000001 110 01100  11001100  11001100  11001100  11001100

// 转整数计算 运算同此
function division(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) {}
  with(Math) {
    r1 = Number(arg1.toString().replace(".", ""))
    r2 = Number(arg2.toString().replace(".", ""))
    return (r1 / r2) * pow(10, t2 - t1);
  }
}

function assembleFloat(sign, exponent, mantissa) {
  return (sign << 31) | (exponent << 23) | (mantissa);
}

function floatToNumber(flt) {
  if (isNaN(flt)) // Special case: NaN
    return assembleFloat(0, 0xFF, 0x1337); // Mantissa is nonzero for NaN

  var sign = (flt < 0) ? 1 : 0;
  flt = Math.abs(flt);
  if (flt == 0.0) // Special case: +-0
    return assembleFloat(sign, 0, 0);

  var exponent = Math.floor(Math.log(flt) / Math.LN2);
  if (exponent > 127 || exponent < -126) // Special case: +-Infinity (and huge numbers)
    return assembleFloat(sign, 0xFF, 0); // Mantissa is zero for +-Infinity

  var mantissa = flt / Math.pow(2, exponent);
  return assembleFloat(sign, exponent + 127, (mantissa * Math.pow(2, 23)) & 0x7FFFFF);
}