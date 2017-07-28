import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'
let variables = require('../variables.js')

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    layout: 'list',
    isOnline: false,
    loginModalOpen: false,
    menuItems: [],
    frontpageSections: [],
    user: {id: null},
    auth_token: '',
    readingList: [],
    sources: [
      {
        title: 'Fox',
        switch: 1
      },
      {
        title: 'CNN',
        switch: 1
      },
      {
        title: 'Washington Post',
        switch: 1
      },
      {
        title: 'The Guardian',
        switch: 1
      }
    ]
  },
  getters: {
    getLayout: state => {
      return state.layout
    },
    getMenuItems: state => {
      return state.menuItems
    },
    getFrontpageSections: state => {
      return state.frontpageSections
    },
    getLoginModalOpen: state => {
      return state.loginModalOpen
    },
    getAuthToken: state => {
      return state.auth_token
    },
    getUser: state => {
      return state.user
    },
    getSources: state => {
      return state.sources
    },
    getReadingList: state => {
      return state.readingList
    },
    getIsOnline: state => {
      return state.isOnline
    }
  },
  mutations: {
    setLayout: (state, payload) => {
      state.layout = payload
    },
    setMenuItems: (state, payload) => {
      state.menuItems = payload
    },
    setFrontpageSections: (state, payload) => {
      state.frontpageSections = payload
    },
    setSources: (state, payload) => {
      state.sources = payload
    },
    setLoginModalOpen: (state, payload) => {
      state.loginModalOpen = payload
    },
    setAuthToken: (state, payload) => {
      state.auth_token = payload
    },
    setUser: (state, payload) => {
      state.user = payload
    },
    setReadingList: (state, payload) => {
      state.readingList = payload
    },
    setIsOnline: (state, payload) => {
      state.isOnline = payload
    }
  },
  actions: {
    loadMenuItems: (context) => {
      return axios.get(variables.host + '/contentapi.json?type=menu')
        .then((response) => {
          context.commit('setMenuItems', response.data)

          let frontpageSections = []
          _.each(response.data, function (item) {
            if (item.type === 'collection') {
              if (!item.hasOwnProperty('score')) {
                item.score = 5
              }
              frontpageSections.push(item)
            }
          })
          context.commit('setFrontpageSections', frontpageSections)
          return
        })
        .catch((error) => {
          throw error
        })
    },
    loadUser: (context, payload) => {
      return axios.get(variables.host + '/api/' + variables.api_ver + '/users/profile/' + payload.user_id,
        { 'headers': { 'Authorization': 'Basic ' + payload.auth_token } })
        .then((response) => {
          localStorage.setItem('user_id', response.data.id)
          context.commit('setUser', response.data)
          return
        })
        .catch((error) => {
          context.commit('setLoginModalOpen', true)
          throw error
        })
    },
    saveAuthToken: (context, payload) => {
      localStorage.setItem('auth_token', payload)
      context.commit('setAuthToken', payload)
    },
    saveUser: (context, payload) => {
      localStorage.setItem('user_id', payload.id)
      context.commit('setUser', payload)
    },
    loadConfig: (context) => {
      axios({
        method: 'get',
        url: variables.host + '/api/' + variables.api_ver + '/settings/',
        headers: { 'Authorization': 'Basic ' + context.getters.getAuthToken }
      })
      .then((response) => {
        let config = JSON.parse(response.data.user_private_preferences.value)
        let oriSections = JSON.parse(JSON.stringify(context.getters.getFrontpageSections))
        let merged = []
        // ----------- sections -----------
        // if oriSections (menu items) is same size or longer than config
        // nothing changed or element was added so we update oriSections with config values
        if (oriSections.length >= config.sections.length) {
          merged = _.unionBy(config.sections, oriSections, 'id')
        } else {
          // otheriwse we have to get rid of extra elements in config
          merged = _.intersectionBy(config.sections, oriSections, 'id')
        }
        context.commit('setFrontpageSections', merged)

        // ----------- sources -------------
        let oriSources = JSON.parse(JSON.stringify(context.getters.getSources))
        merged = []
        if (oriSources.length >= config.sources.length) {
          merged = _.unionBy(config.sources, oriSources, 'title')
        } else {
          merged = _.intersectionBy(config.sources, oriSources, 'title')
        }
        context.commit('setSources', merged)

        // ----------- readingList --------
        let readingList = JSON.parse(response.data.user_favourite_articles.value)
        context.commit('setReadingList', readingList)
      })
      .catch((error) => {
        context.commit('setLoginModalOpen', true)
        throw error
      })
    },
    saveFilters: (context, payload) => {
      let settingsObj = {
        settings: {
          name: 'user_private_preferences',
          value: JSON.stringify(payload)
        }
      }
      context.commit('setFrontpageSections', payload.sections)
      context.commit('setSources', payload.sources)
      axios({
        method: 'patch',
        url: variables.host + '/api/' + variables.api_ver + '/settings/',
        data: settingsObj,
        headers: { 'Authorization': 'Basic ' + context.getters.getAuthToken }
      })
      .catch((error) => {
        context.commit('setLoginModalOpen', true)
        throw error
      })
    },
    saveReadingList: (context, payload) => {
      let settingsObj = {
        settings: {
          name: 'user_favourite_articles',
          value: JSON.stringify(payload)
        }
      }
      context.commit('setReadingList', payload)
      axios({
        method: 'patch',
        url: variables.host + '/api/' + variables.api_ver + '/settings/',
        data: settingsObj,
        headers: { 'Authorization': 'Basic ' + context.getters.getAuthToken }
      })
      .catch((error) => {
        context.commit('setLoginModalOpen', true)
        throw error
      })
    },
    addToReadingList: (context, payload) => {
      let readingList = JSON.parse(JSON.stringify(context.getters.getReadingList))
      readingList.push(payload)
      // caching article for offline
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          'command': 'pleaseCache',
          'url': payload.url
        })
      }
      context.dispatch('saveReadingList', readingList)
    },
    removeFromReadingList: (context, payload) => {
      let readingList = JSON.parse(JSON.stringify(context.getters.getReadingList))
      _.pullAllBy(readingList, [payload], 'id')
      context.dispatch('saveReadingList', readingList)
    }
  }
})
export default store
