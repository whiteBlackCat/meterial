// 在context中,Vue实例，甚至可能在Vuex store中，您可以使用inject方法，这个方法接受两个参数，$将自动添加到该函数中。
export default ({ app }, inject) => {
  inject('myInjectedFunction', (string) => console.log('That was easy!', string))
}