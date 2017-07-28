<template>
  <div class="boxSidebar__item boxSidebar__mostRead">
    <h2 class="boxSidebar__item__headline">Most read</h2>
    <ul>
      <li v-for="item in items" class="boxSidebar__mostReadItem">
        <a v-bind:href="item.url">
          {{ item.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
let variables = require('../variables.js')

export default {
  name: 'mostRead',
  data: function () {
    return {
      items: []
    }
  },
  beforeMount () {
    this.getItems()
  },
  methods: {
    getItems: function () {
      axios.get(variables.host + '/contentapi.json?type=mostRead')
        .then((response) => {
          this.items = response.data
        })
    }
  }
}
</script>
