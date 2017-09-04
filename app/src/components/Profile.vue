<template>
  <div class="articleList col-lg-8">
    <div>
      <h2 class="articleList__sectionHeadline">Edit profile</h2>
      <div class="articleList__listSection articleList__listSection--listView">
        <article class="articleList__item articleList__item--noHover">
          <div class="articleList__item__content">
            <div class="articleList__info">
              <h3 class="articleList__headline">{{user.firstName}} {{user.lastName}} ({{user.username}})</h3>
              <p>{{user.about}}</p>
              <div class="articleList__metadata">
                <span class="articleList__metadata__item">User since: {{user.createdAt | formatDate}}</span>
              </div>
            </div>
          </div>
        </article>
        <article class="articleList__item articleList__item--noHover">
          <div class="articleList__info articleList__info--bottomMargin">
            <form class="form" @submit.prevent="update()" data-vv-scope="userUpdateForm">
              <div class="form__item">
                <label for="email">Email</label>
                <input type="email" name="email" class="form-control" v-model="user_profile.email" v-validate data-vv-rules="required|email">
              </div>
              <div class="form__item">
                <label for="firstName">First name</label>
                <input type="text" name="firstName" class="form-control" v-model="user_profile.firstName">
              </div>
              <div class="form__item">
                <label for="lastName">Last name</label>
                <input type="lastName" class="form-control" v-model="user_profile.lastName">
              </div>
              <div class="form__item">
                <label for="password">Change Password</label>
                <input name="password" v-model="user_profile.plainPassword.first" 
                  v-validate data-vv-rules="min:5|confirmed:pw_confirm_profile" type="password"
                  :class="['form-control', {'has-error': errors.has('password')}]">
                <p class="text-danger help-block" v-if="errors.has('password')">{{ errors.first('password') }}</p>
              </div>
              <div class="form__item">
                <label for="pw_confirm_profile">Confirm password</label>
                <input name="pw_confirm_profile" v-model="user_profile.plainPassword.second" 
                  type="password" :class="['form-control', {'has-error': errors.has('password')}]">
              </div>
              <div class="form__item">
                <label for="about">About</label>
                <textarea class="form-control" rows="4" v-model="user_profile.about"></textarea>
              </div>
              <button type="submit" class="button btn btn-default" :disabled="busy || !isOnline">Save</button>
            </form>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

let variables = require('../variables.js')

export default {
  name: 'profile',
  inject: ['$validator'],
  data: () => {
    return {
      busy: false,
      user_profile: {
        email: null,
        firstName: null,
        lastName: null,
        about: null,
        plainPassword: {
          first: null,
          second: null
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      auth_token: 'getAuthToken',
      isOnline: 'getIsOnline'
    })
  },
  mounted: function () {
    if (!this.user.id) {
      this.$router.push('/')
    }
    // clone vuex user object values
    this.user_profile.email = JSON.parse(JSON.stringify(this.user.email))
    this.user_profile.firstName = JSON.parse(JSON.stringify(this.user.firstName))
    this.user_profile.lastName = JSON.parse(JSON.stringify(this.user.lastName))
    this.user_profile.about = JSON.parse(JSON.stringify(this.user.about))
  },
  methods: {
    ...mapActions([
      'saveUser'
    ]),
    update: function () {
      this.$validator.validateAll('userUpdateForm').then(result => {
        if (!result) {
          return
        }
        let cleanUser = JSON.parse(JSON.stringify(this.user_profile))
        this.removeEmpty(cleanUser)
        this.busy = true
        let _self = this
        axios({
          method: 'patch',
          url: variables.host + '/api/' + variables.api_ver + '/users/profile/' + this.user.id,
          data: {user_profile: cleanUser},
          headers: { 'Authorization': 'Basic ' + _self.auth_token }
        })
          .then(function (response) {
            _self.saveUser(response.data)
            _self.busy = false
            window.scrollTo(0, 0)
          })
          .catch(function (error) {
            console.log(error)
            _self.busy = false
          })
      })
    },
    removeEmpty: function (obj) {
      let _self = this
      Object.keys(obj).forEach(function (k) {
        if (obj[k] && typeof obj[k] === 'object') {
          _self.removeEmpty(obj[k])
        }
        if (!obj[k] || obj[k] === undefined || (typeof obj[k] === 'object' && Object.keys(obj[k]).length === 0)) {
          delete obj[k]
        }
      })
      return obj
    }
  }
}
</script>
