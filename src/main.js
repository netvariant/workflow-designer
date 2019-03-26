// Vue plugins
import Vue from 'vue'
import VueSimpleSuggest from 'vue-simple-suggest'
import VueCodemirror from 'vue-codemirror'

// components
import App from './App.vue'
import router from './router'
import store from '@/store'
import filters from './filters'

// JavaScript libraries
import BootstrapVue from 'bootstrap-vue'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/matchtags.js'
import 'codemirror/addon/display/autorefresh.js'

// styles
import '@mdi/font/css/materialdesignicons.min.css'
import 'flag-icon-css/css/flag-icon.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/assets/scss/style.scss'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'

// use plugins
Vue.use(BootstrapVue)
Vue.use(VueCodemirror)
Vue.component('vue-simple-suggest', VueSimpleSuggest)
Vue.use(filters)

// disable Vue production tip
Vue.config.productionTip = false

// JavaScript globals
window.$ = require('jquery')
window.jQuery = require('jquery')
window.draw2d = require('draw2d')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
