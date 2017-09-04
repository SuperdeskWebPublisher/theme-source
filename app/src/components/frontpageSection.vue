<template>
  <div v-if="items.length">
    <h2 class="articleList__sectionHeadline">{{ section.title }}</h2>
    <div :class="['articleList__listSection', { 'articleList__listSection--gridView' : layout == 'grid' }]">
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
  name: 'frontpageSection',
  components: {
    articleItem,
    spinner
  },
  data: function () {
    return {
      items: [],
      busy: false,
      previousScore: 0
    }
  },
  props: ['section'],
  beforeMount () {
    this.getItems()
  },
  computed: {
    ...mapGetters({
      layout: 'getLayout',
      sources: 'getSources'
    })
  },
  methods: {
    getItems: function () {
      this.busy = true
      this.previousScore = this.section.score
      let limit = this.section.score === 10 ? 6 : 4
      axios.get(variables.host + '/contentapi.json?type=route&limit=' + limit + '&route=' + this.section.url)
        .then((response) => {
          this.items = response.data
          this.busy = false
        })
    }
  },
  watch: {
    section: function (val) {
      if (val.score !== this.previousScore) {
        this.getItems()
      }
    },
    sources: function (val) {
      this.getItems()
    }
  }
}
</script>
