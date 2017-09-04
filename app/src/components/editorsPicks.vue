<template>
  <div class="boxSidebar__item boxSidebar__editorsPicks">
    <h2 class="boxSidebar__item__headline">Editors' picks</h2>
    <ul>
      <li v-for="item in items" class="boxSidebar__editorsPicksItem">
        <a :href="item.url"><span class="boxSidebar__editorsPicks__headline">{{ item.title }}</span> 
        <span class="boxSidebar__editorsPicks__info">{{ item.source }}</span> 
        <span class="boxSidebar__editorsPicks__info">{{ item.date | relativeDate }}</span></a>
      </li>
    </ul>
  </div>
</template>


<script>
import axios from 'axios'
let variables = require('../variables.js')

export default {
  name: 'editorsPicks',
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
      axios.get(variables.host + '/contentapi.json?type=editorsPicks')
        .then((response) => {
          this.items = response.data
        })
    }
  }
}
</script>
