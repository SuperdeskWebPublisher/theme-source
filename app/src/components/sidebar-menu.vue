<template>
  <nav class="sidebar__nav">
    <ul>
      <li v-for="item in items" v-if="item.score">
        <router-link :to="{ path: item.url }" v-on:click.native="scrollTop">{{ item.title }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'sidebar-menu',
  computed: mapGetters({
    items: 'getMenuItems'
  }),
  methods: {
    scrollTop: function () {
      window.scrollTo(0, 0)
    }
  }
}
</script>
