import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import * as api from '@/api.js'
import global from '@/global.js'

async function handleCriticalError(error, context, router) {
  console.error(`Failed during ${context}:`, error)
  global.moneyboxesLoaded = false
  try {
    await router.replace('/')
  } catch (fallbackError) {
    console.error('Router replacement failed, falling back to hard reload:', fallbackError)
    window.location.href = '/'
  }
}

async function loadMoneyboxes() {
  if (!global.moneyboxesLoaded) {
    await api.getMoneyboxes()
    await api.getMoneyboxesSavingsForecast()
    global.moneyboxesLoaded = true
  }
}

async function ensureTransactionLogs(id) {
  const box = global.findMoneyboxById(id)
  if (box && (!('transactionLogs' in box) || box.transactionLogs === null)) {
    await api.getTransactionLogs(box)
  }
}

async function ensureMoneyboxFetched(id) {
  if (!global.findMoneyboxById(id)) {
    const newBox = await api.getMoneybox(id)
    if (newBox?.id) global.addMoneybox(newBox)
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', component: Home
    },
    {
      path: '/envelope/:id',
      component: () => import('@/views/Envelope.vue'),
      beforeEnter: async (to, _from, next) => {
        const id = Number(to.params.id)
        if (isNaN(id)) return next('/')

        const box = global.findMoneyboxById(id)
        if (!box) {
          console.warn(`Moneybox with ID ${id} not found — redirecting to root.`)
          try {
            await router.replace('/')
          } catch (error) {
            console.error('Router replace failed, falling back to hard reload:', error)
            window.location.href = '/'
          }
          return
        }

        try {
          await api.getTransactionLogs(box)
          next()
        } catch (error) {
          await handleCriticalError(error, `fetching transaction logs for ${id}`, router)
        }
      }
    },
    {
      path: '/logs/:id',
      component: () => import('@/views/Logs.vue'),
      beforeEnter: async (to, _from, next) => {
        const id = Number(to.params.id)
        try {
          await ensureTransactionLogs(id)
          next()
        } catch (error) {
          await handleCriticalError(error, `fetching transaction logs for ${id}`, router)
        }
      }
    },

    { path: '/prioritylist', component: () => import('@/views/Priority.vue') },
    { path: '/settings', component: () => import('@/views/Settings.vue') },
    { path: '/createenvelope', component: () => import('@/views/CreateEnvelope.vue') },

    {
      path: '/editenvelope/:id',
      component: () => import('@/views/EditEnvelope.vue'),
      beforeEnter: async (to, _from, next) => {
        const id = Number(to.params.id)
        try {
          await ensureMoneyboxFetched(id)
          next()
        } catch (error) {
          await handleCriticalError(error, `fetching moneybox ${id}`, router)
        }
      }
    },

    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach(async (_to, _from, next) => {
  try {
    await loadMoneyboxes()
    next()
  } catch (error) {
    console.error('Failed to fetch moneyboxes:', error)
    if (error.response?.status === 404) {
      global.moneyboxesLoaded = false
      try {
        await router.replace('/')
      } catch {
        window.location.href = '/'
      }
      return
    }
    next(false)
  }
})

export default router
