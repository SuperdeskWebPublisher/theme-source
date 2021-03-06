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
    sources: [],
    inactiveSources: []
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
    getInactiveSources: state => {
      return state.inactiveSources
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
    setInactiveSources: (state, payload) => {
      state.inactiveSources = payload
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
          let frontpageSections = []
          _.each(response.data, function (item) {
            if (!item.hasOwnProperty('score')) {
              item.score = 5
            }
            if (item.type === 'collection') {
              frontpageSections.push(item)
            }
          })
          context.commit('setMenuItems', response.data)
          context.commit('setFrontpageSections', frontpageSections)
          return
        })
        .catch((error) => {
          throw error
        })
    },
    loadSources: (context, payload) => {
      return axios.get(variables.host + '/api/' + variables.api_ver + '/content/sources/?limit=9999',
        { 'headers': { 'Authorization': 'Basic ' + payload.auth_token } })
        .then((response) => {
          let sources = []
          _.each(response.data._embedded._items, function (item) {
            if (!item.hasOwnProperty('switch')) {
              item.switch = 1
            }
            sources.push(item)
          })
          context.commit('setSources', sources)
          context.commit('setInactiveSources', _.filter(sources, {switch: 0}))
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
        // if oriSections is same size or longer than config
        // nothing changed or element was added so we update oriSections with config values
        if (oriSections.length >= config.sections.length) {
          merged = _.unionBy(config.sections, oriSections, 'id')
        } else {
          // otheriwse we have to get rid of extra elements in config
          merged = _.intersectionBy(config.sections, oriSections, 'id')
        }
        context.commit('setFrontpageSections', merged)
        context.dispatch('updateMenuWithFilters', merged)

        // ----------- sources -------------
        let oriSources = JSON.parse(JSON.stringify(context.getters.getSources))
        merged = []
        if (oriSources.length >= config.sources.length) {
          merged = _.unionBy(config.sources, oriSources, 'id')
        } else {
          merged = _.intersectionBy(config.sources, oriSources, 'id')
        }
        context.commit('setSources', merged)
        context.commit('setInactiveSources', _.filter(merged, {switch: 0}))

        // ----------- readingList --------
        let readingList = JSON.parse(response.data.user_favourite_articles.value)
        if (!Array.isArray(readingList)) {
          readingList = []
        }
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
      context.dispatch('updateMenuWithFilters', payload.sections)
      context.commit('setFrontpageSections', payload.sections)
      context.commit('setSources', payload.sources)
      context.commit('setInactiveSources', _.filter(payload.sources, {switch: 0}))
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
    updateMenuWithFilters: (context, payload) => {
      let oriMenu = JSON.parse(JSON.stringify(context.getters.getMenuItems))
      let merged = _.unionBy(payload, oriMenu, 'title')
      context.commit('setMenuItems', merged)
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
