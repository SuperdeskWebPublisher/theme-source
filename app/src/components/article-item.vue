<template>
<article class="articleList__item">
  <a v-bind:href="item.url">
    <figure class="articleList__image" v-if="item.image && item.image.length">
      <img v-bind:src="item.image">
    </figure>
    <div class="articleList__info">
      <h3 class="articleList__headline">{{item.title}}</h3>
      <p class="articleList__text">{{item.lead}}</p>
      <div class="articleList__metadata">
        <!--  <img class="articleList__metadata__logo" src="../public/img/article_img/articleLogo.png"> -->
        <span class="articleList__metadata__item" v-if="item.source">{{item.source}}</span>
        <span class="articleList__metadata__item">{{item.date | relativeDate}}</span>
        <span 
          v-bind:class="['articleList__metadata__item articleList__metadata__item--readLater', { 'articleList__metadata__item--readLater--active' : isInReadingList, 'articleList__metadata__item--readLater--offline' : !isOnline }]"
          v-on:click.stop.prevent="toggleReadingList()"
          v-tooltip.top-center="readingListTooltip">
          Read later
        </span>
      </div>
    </div>
  </a>
</article>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import _ from 'lodash'

export default {
  name: 'articleItem',
  props: ['item'],
  computed: {
    ...mapGetters({
      readingList: 'getReadingList',
      user: 'getUser',
      isOnline: 'getIsOnline'
    }),
    isInReadingList: function () {
      let _self = this
      let result = _.some(this.readingList, function (el) {
        return el.id === _self.item.id
      })
      return result
    },
    readingListTooltip: function () {
      if (!this.isOnline) {
        return 'You are offline'
      }
      if (this.isInReadingList) {
        return 'Remove from reading list'
      } else {
        return 'Add to reading list'
      }
    }
  },
  methods: {
    ...mapActions([
      'addToReadingList',
      'removeFromReadingList'
    ]),
    ...mapMutations([
      'setLoginModalOpen'
    ]),
    toggleReadingList: function () {
      if (!this.isOnline) {
        return false
      }
      if (!this.user.id) {
        this.setLoginModalOpen(true)
        return false
      }
      if (this.isInReadingList) {
        this.removeFromReadingList(this.item)
      } else {
        this.addToReadingList(this.item)
      }
    }
  }
}
</script>
