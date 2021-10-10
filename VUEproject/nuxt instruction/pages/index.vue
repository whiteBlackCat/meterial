<template>
  <h1 class="red">Hello {{ name }}!</h1>
</template>

<script>
  export default {
    asyncData(context) {
      // called every time before loading the component
      return {
        name: 'World'
      }
      // 异步数据  页面组件每次加载之前被调用  asyncData 返回的数据融合组件 data 方法返回的数据一并返回给当前组件  不能在methods内访问
      // 使用方法: 返回Promise;回调callback(err, data);返回对象
      // context像是请求对象:有req/res/params   通过params访问动态路由数据   error(params)返回错误信息
      // 猜测用户请求该页面时,将请求送至asyncData内先行处理
      // query变化不会主动调用该方法
    },
    fetch({
      store,
      params
    }) {
      // The fetch method is used to fill the store before rendering the page
      // 同asyncData,不会合并至data内    使用store.dispatch时似乎建议配合async/await
    },
    head() {
      // Set Meta Tags for this Page
      return {
        title: this.title,
        meta: [{
          hid: 'description', // 唯一标识符,避免覆盖不了父组件meta
          name: 'description',
          content: 'My custom description'
        }]
      }
    },
    // and more functionality to discover
    // ...
    watchQuery: Boolean, // [] 监听参数字符串更改并在更改时执行组件方法 (asyncData, fetch, validate, layout, ...)  数组内为指定参数字段
    layout:'', // 指定当前页面使用的布局
    loading:'', // 控制loading的使用   this.$nuxt.$loading.start()来启动加载条。使用this.$nuxt.$loading.finish()来使加载条结束
    transition:'',  // String 或 Object 或 Function   页面自定义过渡特效
    scrollToTop:Boolean,  // 面前是否需要将当前页面滚动至顶部
    validate:Function,  // 校验动态路由参数的有效性。 { params, query } 通过return true表示有效   支持Promise  throw new Error()导致500
    middleware:FUnction, // 
  }

  // 嵌套组件的处理
  // 父组件留出<nuxt-child/>为放置子组件
  // 子组件放入与父组件同名的文件夹内
</script>

<style>
  .red {
    color: red;
  }
</style>