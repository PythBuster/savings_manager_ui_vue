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
      component: Home
    },
    {
      path: '/envelope/:id',
      component: () => import('@/views/Envelope.vue'),
      beforeEnter: async (to, _from, next) => {
        const id = Number(to.params.id)
        const moneybox = global.findMoneyboxById(id)
        if (moneybox) {
          try {
            await getTransactionLogs(moneybox)
            next()
          } catch (error) {
            console.error(`Failed to fetch transaction logs for moneybox ${id}:`, error)
            global.moneyboxesLoaded = false
            window.location.href = '/'
          }
        } else {
          next()
        }
      }
    },
    {
      path: '/logs/:id',
      component: () => import('@/views/Logs.vue'),
      beforeEnter: async (to, _from, next) => {
        const id = Number(to.params.id)
        const moneybox = global.findMoneyboxById(id)
        if (moneybox && (!('transactionLogs' in moneybox) || moneybox.transactionLogs === null)) {
          try {
            await getTransactionLogs(global.findMoneyboxById(id))
            next()
          } catch (error) {
            console.error(`Failed to fetch transaction logs for moneybox ${id}:`, error)
            global.moneyboxesLoaded = false
            window.location.href = '/'
          }
        } else {
          next()
        }
      }
    },
    {
      path: '/prioritylist',
      component: () => import('@/views/Priority.vue')
    },
    {
      path: '/settings',
      component: () => import('@/views/Settings.vue')
    },
    {
      path: '/createenvelope',
      component: () => import('@/views/CreateEnvelope.vue')
    },
    {
      path: '/editenvelope/:id',
      component: () => import('@/views/EditEnvelope.vue'),
      beforeEnter: async (to, _from, next) => {
        const id = Number(to.params.id)
        if (!global.findMoneyboxById(id)) {
          try {
            global.addMoneybox(await getMoneybox(id))
            next()
          } catch (error) {
            console.error(`Failed to fetch moneybox with id ${id}:`, error)
            global.moneyboxesLoaded = false
            window.location.href = '/'
          }
        } else {
          next()
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})


router.beforeEach(async (_to, _from, next) => {
  if (!global.moneyboxesLoaded) {
    try {
      await getMoneyboxes()
      await getMoneyboxesSavingsForecast()
      global.moneyboxesLoaded = true
      next()
    } catch (error) {
      console.error('Failed to fetch moneyboxes:', error)
      if (error.response?.status === 404) {
        global.moneyboxesLoaded = false
        window.location.href = '/'
        return
      }
      next(false)
    }
  } else {
    next()
  }
})

export default router