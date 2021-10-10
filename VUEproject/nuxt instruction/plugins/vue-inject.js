// 通过插件的方式注入,客户端内组价可以访问

import Vue from 'vue'

Vue.prototype.$myInjectedFunction = (string) => console.log("This is an example", string)