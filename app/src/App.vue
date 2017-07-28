<template>
  <div id="app">
    <offline-indicator></offline-indicator>
    <div class="topBar visible-xs-block">
      <a href="/#/" class="topBar__logo visible-xs-block"><img src="./assets/logo_small.svg"></a>

      <div class="bt-menu-trigger" v-on:click="toggleSidebar()">
        <img src="./assets/hamburger_menu.png">
      </div>
    </div>

    <main class="container-fluid">
      <div class="row">
        <div v-bind:class="['sidebar', { 'open' : sidebarOpen }]">
          <a href="/#/" class="sidebar__logo hidden-xs"><img src="./assets/logo.svg"></a>
          <span @click="personalize" class="button button--personalize cursorPointer">Personalize</span>
          <personalize v-if="personalizeOpen" @close="personalizeOpen=false"></personalize>
          <sidebar-menu v-if="!personalizeOpen"></sidebar-menu>
          <user-bar></user-bar>
        </div>

        <div class="contentPush col-md-12 col-sm-12 col-xs-12">
          <div class="row">
            <div class="col-xs-12 dropdown--wrap">
              <div class="select-style">
                <select class="dropdown">
                  <option value="world">World edition</option>
                  <option value="uk">UK edition</option>
                  <option value="us">US edition</option>
                </select>
              </div>
              <div class="select-style">
                <select class="dropdown" v-model="layoutLocal" v-on:change="pickLayout">
                  <option value="list">List view</option>
                  <option value="grid">Grid view</option>
                </select>
              </div>
            </div>
            <router-view></router-view>
            <div class="boxSidebar col-lg-4 visible-lg">
              <most-read></most-read>
              <editors-picks></editors-picks>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import editorsPicks from '@/components/editorsPicks.vue'
import mostRead from '@/components/mostRead.vue'
import sidebarMenu from '@/components/sidebar-menu.vue'
import userBar from '@/components/userBar.vue'
import personalize from '@/components/personalize.vue'
import offlineIndicator from '@/components/offlineIndicator.vue'
import { mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    editorsPicks,
    mostRead,
    sidebarMenu,
    userBar,
    personalize,
    offlineIndicator
  },
  data: function () {
    return {
      layoutLocal: null,
      sidebarOpen: false,
      personalizeOpen: false
    }
  },
  beforeMount () {
    let _self = this
    this.layoutLocal = this.$store.state.layout
    this.loadMenuItems()
    .then(function () {
      let authToken = localStorage.getItem('auth_token')
      let userId = localStorage.getItem('user_id')
      if (authToken) {
        _self.setAuthToken(authToken)
        _self.loadUser({auth_token: authToken, user_id: userId}).then(_self.loadConfig())
      }
    })

    this.updateOnlineStatus()
    window.addEventListener('online', _self.updateOnlineStatus)
    window.addEventListener('offline', _self.updateOnlineStatus)
  },
  computed: mapGetters({
    user: 'getUser'
  }),
  methods: {
    ...mapMutations([
      'setLayout',
      'setAuthToken',
      'setLoginModalOpen',
      'setIsOnline'
    ]),
    ...mapActions([
      'loadUser',
      'loadMenuItems',
      'loadConfig',
      'saveReadingList'
    ]),
    pickLayout: function () {
      this.setLayout(this.layoutLocal)
    },
    toggleSidebar: function () {
      this.sidebarOpen = !this.sidebarOpen
    },
    personalize: function () {
      if (!this.user.id) {
        this.setLoginModalOpen(true)
      } else {
        this.personalizeOpen = true
      }
    },
    updateOnlineStatus: function () {
      this.setIsOnline(window.navigator.onLine)
    }
  }
}
</script>

<style>
  @import "../../public/dist/style.css";
  .router-link-exact-active {
    text-decoration: underline !important;
  }

  input.has-error{
    border: 1px solid red;
  }
</style>
