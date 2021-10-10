// Uint8Array API的实现

// 数组转
// Buffer.from(array|arrayBuffer|buffer|string[,encoding]) 

//  返回一个指定大小的新建的的已初始化的 Buffer
// Buffer.alloc(size[, fill[, encoding]]) 

// 指定大小的新建的未初始化的
// Buffer.allocUnsafe(size) 

// Buffer.byteLength(string[, encoding])

// Buffer.compare(buf1, buf2)

// Buffer.concat(list[, totalLength])

// Buffer.isBuffer(obj)

// Buffer.poolSize

// buf[index]

// buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])

// buf.equals(otherBuffer)

// BE大端序 LE小端序
// buf.readUIntBE(offset, byteLength)  // 无符号的整数
// buf.readUInt32BE([offset])  // 无符号的 32 位整数值
// buf.readUInt16BE([offset])  //无符号的 16 位整数值
// buf.readUInt8([offset])  // 从 buf 中指定的 offset 读取一个无符号的 8 位整数值
// buf.readFloatBE([offset])  // 32 位浮点值
// buf.readDoubleBE([offset]) // 64 位双精度值
// buf.readBigUInt64BE([offset]) // 无符号的 64 位整数值

// 析成无符号的 16 位整数的数组,并且以字节顺序原地进行交换 2位一换
// buf.swap16()
// buf.swap32()
// buf.swap64()
// buf.toJSON()
// buf.toString([encoding[, start[, end]]])
// buf.write(string[, offset[, length]][, encoding])
// buf.writeBigInt64BE(value[, offset])  // 等各种格式