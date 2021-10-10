export default ({ app }, inject) => {
  // Set the function directly on the context.app object
  app.myInjectedFunction = (string) => console.log('Okay, another function', string)
}
//将内容注入context，避免重复引入，在app上挂载注入一个函数，所有组件内都可以访问(不包含客户端)。