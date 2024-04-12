import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import {
  getMoneyboxes,
  getMoneybox,
  getTransactionLogs,
  addMoneybox
} from '@/api.js'
import global from '@/global.js'
import { APIError } from '@/customerrors'

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
            global.moneyboxesLoaded = true

            const overflowExists = global.moneyboxes.some(
              (moneybox) => moneybox.is_overflow === true
            )

            if (!overflowExists) {
              await addMoneybox({
                name: 'OVERFLOW',
                isOverflow: true,
                goal: 0,
                increment: 0
              })
            }

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
        if (!global.findMoneyboxById(id)) {
          try {
            const moneybox = await getMoneybox(id)
            if (moneybox.is_overflow) {
              throw new APIError('Overflow moneybox cannot be accessed by id')
            }
            global.addMoneybox(moneybox)
            await getTransactionLogs(global.findMoneyboxById(id))
            next()
          } catch (error) {
            console.error(`Failed to fetch moneybox with id ${id}:`, error)
            // TODO: Show error message to user or redirect to error page
            next(false)
          }
        } else if (global.findMoneyboxById(id).transactionLogs === null) {
          try {
            if (global.findMoneyboxById(id).is_overflow) {
              throw new APIError('Overflow moneybox cannot be accessed by id')
            }
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
      path: '/logs/:id',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Logs.vue'),
      beforeEnter: async (to, _from, next) => {
        const id = Number(to.params.id)
        if (!global.findMoneyboxById(id)) {
          try {
            const moneybox = await getMoneybox(id)
            if (moneybox.is_overflow) {
              throw new APIError('Overflow moneybox cannot be accessed by id')
            }
            global.addMoneybox(moneybox)
            await getTransactionLogs(global.findMoneyboxById(id))
            next()
          } catch (error) {
            console.error(`Failed to fetch moneybox with id ${id}:`, error)
            // TODO: Show error message to user or redirect to error page
            next(false)
          }
        } else if (global.findMoneyboxById(id).transactionLogs === null) {
          try {
            if (global.findMoneyboxById(id).is_overflow) {
              throw new APIError('Overflow moneybox cannot be accessed by id')
            }
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
      path: '/logs/overflow',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/LogsOverflow.vue'),
      beforeEnter: async (_to, _from, next) => {
        try {
          if (!global.moneyboxesLoaded) {
            await getMoneyboxes()
            global.moneyboxesLoaded = true
          }

          let overflowMoneybox = global.moneyboxes.find(
            (moneybox) => moneybox.is_overflow === true
          )

          if (!overflowMoneybox) {
            overflowMoneybox = await addMoneybox({
              name: 'OVERFLOW',
              isOverflow: true,
              goal: 0,
              increment: 0
            })
          }

          if (overflowMoneybox.transactionLogs === null) {
            await getTransactionLogs(overflowMoneybox)
          }

          next()
        } catch (error) {
          console.error('Error handling overflow moneybox:', error)
          next(false)
        }
      }
    },
    {
      path: '/priority',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Priority.vue'),
      beforeEnter: async (_to, _from, next) => {
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
      path: '/savingssettings',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Savings.vue'),
      beforeEnter: async (_to, _from, next) => {
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
    },
    {
      path: '/overflow',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Overflow.vue'),
      beforeEnter: async (_to, _from, next) => {
        try {
          if (!global.moneyboxesLoaded) {
            await getMoneyboxes()
            global.moneyboxesLoaded = true
          }

          let overflowMoneybox = global.moneyboxes.find(
            (moneybox) => moneybox.is_overflow === true
          )

          if (!overflowMoneybox) {
            await addMoneybox({
              name: 'OVERFLOW',
              isOverflow: true,
              goal: 0,
              increment: 0
            })
          }

          if (overflowMoneybox.transactionLogs === null) {
            await getTransactionLogs(overflowMoneybox)
          }

          next()
        } catch (error) {
          console.error('Error handling overflow moneybox:', error)
          next(false)
        }
      }
    },
    {
      path: '/editoverflow',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/EditOverflow.vue'),
      beforeEnter: async (_to, _from, next) => {
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
    }
  ]
})

export default router
