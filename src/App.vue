<template>
  <v-app>
    <v-app-bar :density="display.smAndDown ? 'compact' : undefined">
      <v-app-bar-title>
        <v-btn v-if="!display.xs" @click="goHome">
          <v-icon size="x-large" class="mr-2">mdi-home</v-icon>
          {{ appName }} v{{ appVersion }}
        </v-btn>
        <v-btn v-else @click="goHome">
          <v-icon size="x-large">mdi-home</v-icon>
        </v-btn>
      </v-app-bar-title>

      <!-- Theme toggle -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" class="mr-2">
            <v-icon size="x-large">mdi-theme-light-dark</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item class="justify-center" @click="themeSelected('dark')">
            <v-icon>mdi-weather-night</v-icon>
          </v-list-item>
          <v-list-item class="justify-center" @click="themeSelected('light')">
            <v-icon>mdi-white-balance-sunny</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Language switch -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" class="mr-2">{{ selectedLanguage }}</v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="language in languages"
            :key="language"
            class="justify-center"
            @click="languageSelected(language)"
          >
            {{ language }}
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Navigation menu -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props">
            <v-icon size="x-large">mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="item in menuItems"
            :key="item.path"
            @click="selectMenuItem(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Drawer for larger screens -->
    <v-navigation-drawer>
      <v-container class="fill-height">
        <v-row class="fill-height">
          <v-col class="d-flex flex-column">
            <v-list>
              <v-list-item
                v-for="item in menuItems"
                :key="item.path"
                @click="selectMenuItem(item)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <div class="flex-grow-1" />
            <SavingsSettingsOverview />
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <RouterLink to="/" />
    <RouterView />
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import router from '@/router/index.js'
import { useTheme, useDisplay } from 'vuetify'
import Cookies from 'js-cookie'
import { fetchOrCreateSettings } from '@/utils.js'
import { getAppMetadata } from '@/api.js'
import global from '@/global.js'
import { useI18n } from 'vue-i18n'

const display = useDisplay()
const theme = useTheme()
const { t, locale } = useI18n({})

// --- Theme setup ---
const savedTheme = Cookies.get('theme')
if (savedTheme) theme.global.name.value = savedTheme

// --- Language setup ---
const selectedLanguage = ref(import.meta.env.VITE_VUE_APP_I18N_LOCALE.toUpperCase())
const languages = [
  import.meta.env.VITE_VUE_APP_I18N_LOCALE.toUpperCase(),
  import.meta.env.VITE_VUE_APP_I18N_FALLBACK_LOCALE.toUpperCase()
]

function languageSelected(language) {
  selectedLanguage.value = language
  Cookies.set('locale', language)
  locale.value = language.toLowerCase()
}

// --- Menu setup ---
const menuItems = computed(() => {
  const base = [
    { title: t('my-envelopes'), path: '/' },
    { title: t('settings'), path: '/settings' }
  ]

  const settings = global.settings.value
  if (settings?.isAutomatedSavingActive) {
    base.splice(1, 0, { title: t('priority-list'), path: '/prioritylist' })
  }
  return base
})

function selectMenuItem(item) {
  if (item.path) router.push({ path: item.path })
}

function themeSelected(selectedTheme) {
  theme.global.name.value = selectedTheme
  Cookies.set('theme', selectedTheme)
}

function goHome() {
  router.push({ path: '/' })
}

// --- App metadata ---
const appName = ref('')
const appVersion = ref('')

onMounted(async () => {
  try {
    const appData = await getAppMetadata()
    appName.value = appData.appName || ''
    appVersion.value = appData.appVersion || ''
  } catch (error) {
    console.error('Failed to fetch app metadata:', error)
  }

  fetchOrCreateSettings()

  const savedLocale = Cookies.get('locale')
  if (savedLocale) {
    locale.value = savedLocale.toLowerCase()
    selectedLanguage.value = savedLocale
  }
})
</script>
