/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from '@/App.vue'
import i18n from '@/i18n'
import router from '@/router'
import vClickOutside from 'v-click-outside'

// Composables
import { createApp } from 'vue'

const app = createApp(App).use(i18n).use(router)

registerPlugins(app)

app.directive('click-outside', vClickOutside.directive)

app.mount('#app')
