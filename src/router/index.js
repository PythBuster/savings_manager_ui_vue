import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { getMoneyboxes } from '@/api.js'
import global from '@/global.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      beforeEnter: async (to, from, next) => {
        if (!global.moneyboxesLoaded) {
          try {
            await getMoneyboxes()
            global.moneyboxesLoaded = true
            next()
          } catch (error) {
            console.error('Failed to fetch moneyboxes:', error)
            // TODO: Show error message to user or redirect to error page
            next(false)
          }
        } else {
          next()
        }
      }
    },
    {
      path: '/envelope/:id',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Envelope.vue')
    },
    {
      path: '/priority',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Priority.vue')
    },
    {
      path: '/savingssettings',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Savings.vue')
    },
    {
      path: '/createenvelope',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/CreateEnvelope.vue')
    },
    {
      path: '/editenvelope/:id',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/EditEnvelope.vue')
    },
    {
      path: '/overflow',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Overflow.vue')
    },
    {
      path: '/editoverflow',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/EditOverflow.vue')
    }
  ]
})

export default router
