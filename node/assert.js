// import { AssertionError } from "assert";
const assert = require('assert').strict
/**
 * @params options
 * message <string>    错误消息
 * actual <any> 实例属性
 * expected <any> 实例属性
 * operator <string> 实例属性
 * stackStartFn <Function> 生成的堆栈跟踪将移除所有帧直到提供的函数
 */
const message = new assert.AssertionError({
    actual: 1,
    expected: 2,
    operator: 'strictEqual'
})
// 生成断言错误实例，包含message，name，actual，expected，generatedMessage，code，operator
console.log(message)

// assert.ok别名
assert(false,'看到此错误，说明值为false')

// assert.deepStrictEqual(actual, expected[, message])

// 抛出简单错误
// assert.fail([message])

// 判断value是否为UNdefine或null，多用于测试error
// assert.ifError(value)

// 检测promise状态是否为rejected
// assert.rejects(asyncFn[, error][, message])

// assert.strictEqual(actual, expected[, message])

// 检测函数是否抛出错误
// assert.throws(fn[, error][, message])