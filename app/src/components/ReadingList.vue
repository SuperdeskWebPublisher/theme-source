<template>
  <div class="articleList col-lg-8">
    <div>
      <h2 class="articleList__sectionHeadline">Reading List</h2>
      <div :class="['articleList__listSection', { 'articleList__listSection--gridView' : layout == 'grid' }]">
        <article-item v-for="item in items" :key="item.id" :item="item"></article-item>
      </div>
      <div class="grayInfo" v-if="!items.length">
        Your Reading List is empty :(
      </div>
    </div>
  </div>
</template>

<script>
import articleItem from '@/components/article-item.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'readingList',
  components: {
    articleItem
  },
  beforeMount: function () {
    window.scrollTo(0, 0)
    sessionStorage.setItem('lastPage', '/#/reading-list')
  },
  computed: mapGetters({
    layout: 'getLayout',
    items: 'getReadingList'
  }),
  methods: {
  }
}
</script>
