<template>
  <div class="articleList col-lg-8">
    <top-news></top-news>
    <frontpage-section v-for="section in sections" :key="section.id" :section="section"></frontpage-section>
  </div>
</template>

<script>
import topNews from '@/components/topNews.vue'
import frontpageSection from '@/components/frontpageSection.vue'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'frontpage',
  components: {
    topNews,
    frontpageSection
  },
  beforeMount: function () {
    window.scrollTo(0, 0)
  },
  computed: {
    ...mapGetters({
      storeSections: 'getFrontpageSections'
    }),
    sections: function () {
      return _.orderBy(_.filter(this.storeSections, 'score'), 'score', 'desc')
    }
  }
}
</script>
