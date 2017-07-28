<template>
<div>
<modal v-show="loginModalOpen" @close="setLoginModalOpen(false)">
  <h3 slot="header">Login</h3>
  <div slot="body">
    <form @submit="login">
      <p class="text-danger" v-if="loginError">Wrong credentials</p>
      <div class="form-group">
        <label for="username">Username</label>
        <input name="username" v-model="auth.username" type="text" class="form-control" @keyup.enter="login">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input name="password" v-model="auth.password" type="password" class="form-control" @keyup.enter="login">
      </div>
    </form>
  </div>
  <button slot="footer" v-on:click="login" class="button" v-bind:disabled="busy">Login</button>
</modal>
<modal v-show="registerModalOpen" @close="registerModalOpen = false">
  <h3 slot="header">Register</h3>
  <div slot="body" v-show="registerStep=='thankYou'">Thank you for registration. Confirmation email has been sent.</div>
  <div slot="body" v-show="registerStep=='error'">Error occured. Please try again later.</div>
  <div slot="body" v-show="registerStep=='register'">
    <form @submit.prevent="register()" data-vv-scope="registerForm">
      <div class="form-group" :class="{'has-error': errors.has('email') }" >
        <label for="email">Email</label>
        <input name="email" v-model="user_registration.email" 
          v-validate data-vv-rules="required|email" 
          type="email"
          v-bind:class="['form-control', {'has-error': errors.has('email')}]">
        <p class="text-danger help-block" v-if="errors.has('email')">{{ errors.first('email') }}</p>
      </div>
      <div class="form-group" :class="{'has-error': errors.has('username') }" >
        <label for="username">Username</label>
        <input name="username" v-model="user_registration.username" 
          v-validate data-vv-rules="required" 
          type="text" 
          v-bind:class="['form-control', {'has-error': errors.has('username')}]">
        <p class="text-danger help-block" v-if="errors.has('username')">{{ errors.first('username') }}</p>
      </div>
      <div class="form-group" :class="{'has-error': errors.has('password') }" >
        <label for="password">Password</label>
        <input name="password" v-model="user_registration.plainPassword.first" 
          v-validate data-vv-rules="required|min:5|confirmed:pw_confirm" type="password"
          v-bind:class="['form-control', {'has-error': errors.has('password')}]">
        <p class="text-danger help-block" v-if="errors.has('password')">{{ errors.first('password') }}</p>
      </div>
      <div class="form-group">
        <label for="pw_confirm">Confirm password</label>
        <input name="pw_confirm" v-model="user_registration.plainPassword.second" 
          type="password" v-bind:class="['form-control', {'has-error': errors.has('password')}]">
      </div>
    </form>
  </div>
  <button slot="footer" v-on:click="register" class="button" v-bind:disabled="busy">Register</button>
</modal>
  <div class="sidebar__user" v-if="user.id">
    <span class="sidebar__user__info">
      <img class="sidebar__user__avatar" src="../assets/user2.png">
      <a href="/#/my-profile" class="sidebar__user__name" v-if="user.lastName" v-tooltip.top-center="editProfileMsg">{{user.firstName}} {{user.lastName}}</a>
      <a href="/#/my-profile" class="sidebar__user__name" v-if="!user.lastName" v-tooltip.top-center="editProfileMsg">{{user.username}}</a>
      <a class="sidebar__user__type cursorPointer hoverUnderline" @click="logout">Logout</a>
    </span>
    <a href="/#/reading-list" class="sidebar__readLater cursorPointer" v-tooltip.top-center="readingListMsg">
      <span class="sidebar__readLaterNumber">{{readingList.length}}</span>
    </a>
  </div>

  <div class="sidebar__user" v-if="!user.id">
    <span class="sidebar__user__info sidebar__user__info--login">
      <img class="sidebar__user__avatar" src="../assets/user2.png">
      <span class="sidebar__user__name cursorPointer hoverUnderline" v-on:click="setLoginModalOpen(true)">Login</span>
      <span class="sidebar__user__type cursorPointer hoverUnderline" v-on:click="registerModalOpen=true">Register</span>
    </span>
  </div>
</div>
</template>

<script>
import modal from '@/components/modal.vue'
import axios from 'axios'
import { mapGetters, mapMutations, mapActions } from 'vuex'
let variables = require('../variables.js')

export default {
  name: 'userBar',
  inject: ['$validator'],
  components: {
    modal
  },
  data: function () {
    return {
      registerModalOpen: false,
      registerStep: 'register',
      loginError: false,
      busy: false,
      readingListMsg: 'Reading List',
      editProfileMsg: 'Edit Profile',
      user_registration: {
        email: '',
        username: '',
        plainPassword: {
          first: '',
          second: ''
        }
      },
      auth: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      loginModalOpen: 'getLoginModalOpen',
      user: 'getUser',
      readingList: 'getReadingList'
    })
  },
  methods: {
    ...mapMutations([
      'setLoginModalOpen'
    ]),
    ...mapActions([
      'saveAuthToken',
      'saveUser',
      'loadConfig'
    ]),
    register: function () {
      this.$validator.validateAll('registerForm').then(result => {
        if (!result) {
          return
        }
        this.busy = true
        let _self = this
        axios.post(variables.host + '/api/' + variables.api_ver + '/users/register/', {user_registration: this.user_registration})
        .then(function (response) {
          _self.registerStep = 'thankYou'
          _self.busy = false
        })
        .catch(function (error) {
          console.log(error)
          _self.registerStep = 'error'
          _self.busy = false
        })
      })
    },
    login: function () {
      let _self = this
      _self.busy = true
      axios.post(variables.host + '/api/' + variables.api_ver + '/auth/', {auth: this.auth})
      .then(function (response) {
        _self.setLoginModalOpen(false)
        _self.loginError = false
        _self.busy = false
        _self.saveAuthToken(response.data.token.api_key)
        _self.saveUser(response.data.user)
        _self.loadConfig()
      })
      .catch(function (error) {
        console.log(error)
        _self.loginError = true
        _self.busy = false
      })
    },
    logout: function () {
      this.saveUser({id: null})
      this.saveAuthToken('')
      window.location.reload()
    }
  }
}
</script>
