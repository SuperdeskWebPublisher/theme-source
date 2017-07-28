// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import infiniteScroll from 'vue-infinite-scroll'
import moment from 'moment'
import VeeValidate from 'vee-validate'
import VTooltip from 'v-tooltip'

Vue.config.productionTip = false

Vue.use(VTooltip)
Vue.use(VeeValidate, { inject: false })
Vue.use(infiniteScroll)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

Vue.filter('relativeDate', function (value) {
  if (value) {
    return moment(String(value)).fromNow()
  }
})

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('do MMMM YYYY')
  }
})
