import Vue from 'vue'
import Router from 'vue-router'
import Frontpage from '@/components/Frontpage'
import Section from '@/components/Section'
import Profile from '@/components/Profile'
import ReadingList from '@/components/ReadingList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Frontpage',
      component: Frontpage
    },
    {
      path: '/my-profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/reading-list',
      name: 'ReadingList',
      component: ReadingList
    },
    {
      path: '/:name',
      name: 'Section',
      component: Section,
      props: true
    }
  ]
})
