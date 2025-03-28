import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import {
  getMoneyboxes,
  getMoneyboxesSavingsForecast,
  getMoneybox,
  getTransactionLogs
} from '@/api.js'
import global from '@/global.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      beforeEnter: async (_to, _from, next) => {
        if (!global.moneyboxesLoaded) {
          try {
            await getMoneyboxes()
            await getMoneyboxesSavingsForecast()

            global.moneyboxesLoaded = true
<
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
      component: () => import('@/views/Envelope.vue'),
      beforeEnter: async (to, _from, next) => {
        const id = Number(to.params.id)
        const moneybox = global.findMoneyboxById(id)
        
        if (moneybox) {
          try {
            await getTransactionLogs(moneybox)
            next()
          } catch (error) {
            console.error(
              `Failed to fetch transaction logs for moneybox with id ${id}:`,
              error
            )
            // TODO: Show error message to user or redirect to error page
            next(false)
          }
        } else {
          next()
        }
      }
    },
    {
      path: '/logs/:id',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Logs.vue'),
      beforeEnter: async (to, _from, next) => {
        const id = Number(to.params.id)
        const moneybox = global.findMoneyboxById(id)

      

        if (moneybox && (!("transactionLogs" in moneybox) || moneybox.transactionLogs === null)) {
          try {
            await getTransactionLogs(global.findMoneyboxById(id))
            next()
          } catch (error) {
            console.error(
              `Failed to fetch transaction logs for moneybox with id ${id}:`,
              error
            )
            // TODO: Show error message to user or redirect to error page
            next(false)
          }
        } else {
          next()
        }
      }
    },
    {
      path: '/prioritylist',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Priority.vue'),
      beforeEnter: async (_to, _from, next) => {
        try {
          next()
        } catch (error) {
          console.error('Failed to fetch moneyboxes:', error)
          // TODO: Show error message to user or redirect to error page
          next(false)
        }
      }
    },
    {
      path: '/settings',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Settings.vue'),
      beforeEnter: async (_to, _from, next) => {
        if (!global.moneyboxesLoaded) {
          try {
            await getMoneyboxes()
            await getMoneyboxesSavingsForecast()
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
      component: () => import('@/views/EditEnvelope.vue'),
      beforeEnter: async (to, _from, next) => {
        const id = Number(to.params.id)
        if (!global.findMoneyboxById(id)) {
          try {
            global.addMoneybox(await getMoneybox(id))
            next()
          } catch (error) {
            console.error(`Failed to fetch moneybox with id ${id}:`, error)
            // TODO: Show error message to user or redirect to error page
            next(false)
          }
        } else {
          next()
        }
      }
    }
  ]
})

export default router
