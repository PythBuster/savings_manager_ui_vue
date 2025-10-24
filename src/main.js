/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins/index.js'

// Components
import App from '@/App.vue'
import i18n from '@/i18n.js'
import router from '@/router/index.js'
import vClickOutside from 'v-click-outside'

// Composables
import { createApp } from 'vue'

const app = createApp(App).use(i18n).use(router)
registerPlugins(app)

app.directive('click-outside', vClickOutside.directive)

app.mount('#app')

app.config.errorHandler = (err, instance, info) => {
  console.error('Global error caught:', err, info)

  // Wenn es ein Navigations- oder API-Fehler ist:
  if (err?.response?.status === 404) {
    // 💡 komplette App + Router-Historie zurücksetzen:
    window.location.href = '/'
    return
  }

  // oder (wenn du nur innerhalb der SPA redirecten willst):
  router.replace('/')
}