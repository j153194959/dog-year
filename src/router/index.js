import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Activity 2/Home'
import Measuring from '@/components/Activity 2/Measuring'
import Fortune from '@/components/Activity 2/Fortune-sign'
import Selection from '@/components/Activity 2/Selection'
import Drawable from '@/components/Activity 3/Drawable'
import Home3 from '@/components/Activity 3/Home'
import Center from '@/components/Center/Center'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '主页',
      component: Home
    },
    {
      path: '/Measuring',
      name: '测财运',
      component: Measuring
    },
    {
      path: '/Fortune-sign',
      name: '财运签',
      component: Fortune
    },
    {
      path: '/Selection',
      name: '评选',
      component: Selection
    },
    {
      path: '/Home3',
      name: '套牛主页面',
      component: Home3
    },
    {
      path: '/Drawable',
      name: '套牛抽奖页面',
      component: Drawable
    },
    {
      path: '/Center',
      name: '起始页面',
      component: Center
    }
  ]
})
