<template>
  <transition name="slideup">
    <div class="offline-indicator" v-if="!isOnline">You are offline</div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'offlineIndicator',
  computed: {
    ...mapGetters({
      isOnline: 'getIsOnline'
    })
  }
}
</script>

<style>
  .offline-indicator {
    position: fixed;
    top: 0;
    left: 50%;
    z-index: 999;
    width: 150px;
    margin-left: -75px;
    background: #0299ff;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
    padding: 5px;
    text-align: center;
    color: #fff;
  }
  .slideup-enter-active, .slideup-leave-active {
    transition: transform .2s, opacity .2s;
    transform: none;
    opacity: 1;
  }
  .slideup-enter, .slideup-leave-active {
    opacity: 0;
    transform: translateY(-100%);
  }
</style>
