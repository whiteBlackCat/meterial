const async_hooks = require('async_hooks');

// Return the ID of the current execution context.
const eid = async_hooks.executionAsyncId();

// Return the ID of the handle responsible for triggering the callback of the
// current execution scope to call.
const tid = async_hooks.triggerAsyncId();

// Create a new AsyncHook instance. All of these callbacks are optional.
const asyncHook =  async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Disable listening for new asynchronous events.
asyncHook.disable();

// 在异步钩子回调中打印日志
// console是个异步操作，会触发无限回掉
const fs = require('fs');
const util = require('util');

function debug(...args) {
  // Use a function like this one when debugging inside an AsyncHooks callback
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}