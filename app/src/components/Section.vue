<template>
  <div class="articleList col-lg-8">
    <div>
      <h2 class="articleList__sectionHeadline">{{sectionName}}</h2>
      <div :class="['articleList__listSection', { 'articleList__listSection--gridView' : layout == 'grid' }]" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <article-item v-for="item in items" :key="item.id" :item="item"></article-item>
      </div>
      <div class="grayInfo" v-if="!items.length && !busy && !showOfflineMessage">
        No Articles yet :(
      </div>
      <div class="grayInfo" v-if="showOfflineMessage">
        You are offline :(
      </div>
      <spinner v-if="busy"></spinner>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
let variables = require('../variables.js')
import articleItem from '@/components/article-item.vue'
import spinner from '@/components/spinner.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'section',
  components: {
    articleItem,
    spinner
  },
  props: ['name'],
  data: () => {
    return {
      items: [],
      sectionName: this.name,
      page: 1,
      end: false,
      busy: false,
      showOfflineMessage: false
    }
  },
  computed: mapGetters({
    layout: 'getLayout',
    isOnline: 'getIsOnline'
  }),
  beforeRouteUpdate: function (to, from, next) {
    this.sectionName = to.params.name
    this.reset()
    this.getItems()
    localStorage.setItem('lastPage', '/#/' + this.sectionName)
    next()
  },
  beforeMount: function () {
    this.sectionName = this.name
    this.reset()
    this.getItems()
    sessionStorage.setItem('lastPage', '/#/' + this.sectionName)
  },
  methods: {
    reset: function () {
      this.items = []
      this.page = 1
      this.end = false
      this.busy = false
      this.showOfflineMessage = false
    },
    getItems: function () {
      let _self = this
      this.busy = true
      axios.get(variables.host + '/contentapi.json?type=route&limit=12&route=/' + this.sectionName + '&page=' + this.page)
        .then((response) => {
          this.items = this.items.concat(response.data)
          this.page++
          this.busy = false
          if (!response.data.length) {
            this.end = true
          }
        })
        .catch(function (error) {
          console.log(error)
          _self.busy = false
          _self.end = true
          if (!_self.isOnline) {
            _self.showOfflineMessage = true
          }
        })
    },
    loadMore: function () {
      if (!this.end) {
        this.getItems()
      }
    }
  }
}
</script>
