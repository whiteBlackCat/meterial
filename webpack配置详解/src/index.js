import Vue from 'Vue'
import App from './app.vue'

import './assets/styles/global.styl'

const root = document.createElement('div')
document.body.appendChild(root)
new Vue({
    render: (h) => h(App)
}).$mount(root)

