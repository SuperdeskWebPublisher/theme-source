<template>
  <div>
    <h2 class="articleList__sectionHeadline">Top news</h2>
    <div v-bind:class="['articleList__listSection', { 'articleList__listSection--gridView' : layout == 'grid' }]">
      <article-item v-for="item in items" :key="item.id" :item="item"></article-item>
    </div>
    <spinner v-if="busy"></spinner>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import articleItem from '@/components/article-item.vue'
import spinner from '@/components/spinner.vue'
let variables = require('../variables.js')

export default {
  name: 'topNews',
  components: {
    articleItem,
    spinner
  },
  data: function () {
    return {
      items: [],
      busy: false
    }
  },
  computed: mapGetters({
    layout: 'getLayout'
  }),
  beforeMount () {
    this.getItems()
  },
  methods: {
    getItems: function () {
      this.busy = true
      axios.get(variables.host + '/contentapi.json?type=topNews')
        .then((response) => {
          this.items = response.data
          this.busy = false
        })
    }
  }
}
</script>
