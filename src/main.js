/**
 * main.js
 *
 * Bootstraps Vuetify, i18n, Router, and custom directives, then mounts the App.
 */

import { createApp } from 'vue'
import App from '@/App.vue'

// --- Plugins & setup ---
import { registerPlugins } from '@/plugins/index.js'
import i18n from '@/i18n.js'
import router from '@/router/index.js'
import vClickOutside from 'v-click-outside'

// --- Create app instance ---
const app = createApp(App)

// --- Register plugins ---
app.use(i18n)
app.use(router)
registerPlugins(app)

// --- Custom directives ---
app.directive('click-outside', vClickOutside.directive)

// --- Global error handler ---
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error caught:', err, info)

  // Handle 404 or navigation-related errors
  if (err?.response?.status === 404) {
    // Full reload to reset all state (matches intended behavior)
    window.location.replace('/')
    return
  }

  // Fallback redirect for unexpected errors within the SPA
  if (router && router.replace) {
    router.replace('/').catch(() => {
      // swallow redundant navigation errors
    })
  }
}

// --- Mount app ---
app.mount('#app')
