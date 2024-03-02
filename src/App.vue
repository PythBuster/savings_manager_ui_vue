<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        <v-btn @click="goHome">Savings Manager</v-btn>
      </v-app-bar-title>
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props"><v-icon>mdi-theme-light-dark</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item
            class="d-flex justify-center"
            @click="themeSelected('dark')"
          >
            <v-icon>mdi-weather-night</v-icon>
          </v-list-item>
          <v-list-item
            class="d-flex justify-center"
            @click="themeSelected('light')"
          >
            <v-icon>mdi-white-balance-sunny</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props">{{ selectedLanguage }}</v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(language, index) in languages"
            :key="index"
            :value="language"
            class="d-flex justify-center"
            @click="languageSelected(language)"
            >{{ language }}</v-list-item
          >
        </v-list>
      </v-menu>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-app-bar-nav-icon v-bind="props"> </v-app-bar-nav-icon>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            @click="selectMenuItem(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer>
      <v-container class="fill-height">
        <v-row class="fill-height">
          <v-col class="d-flex flex-column">
            <v-list>
              <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                @click="selectMenuItem(item)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <div class="flex-grow-1"></div>
            <SavingsSettingsOverview />
            <TotalSavings :totalAmount="totalAmount" />
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <RouterLink to="/"></RouterLink>

    <RouterView />
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import router from '@/router'
import { useTheme } from 'vuetify'
import Cookies from 'js-cookie'

// t used for menuItems and languageSelected(), otherwise $t globally available
import { useI18n } from 'vue-i18n'

const theme = useTheme()

const savedTheme = Cookies.get('theme')
if (savedTheme) {
  theme.global.name.value = savedTheme
}

const { t, locale } = useI18n({})

const selectedLanguage = ref(
  import.meta.env.VITE_VUE_APP_I18N_LOCALE.toUpperCase()
)
const languages = [
  import.meta.env.VITE_VUE_APP_I18N_LOCALE.toUpperCase(),
  import.meta.env.VITE_VUE_APP_I18N_FALLBACK_LOCALE.toUpperCase()
]

const menuItems = computed(() => [
  { title: t('my-envelopes'), path: '/' },
  { title: t('priority-list'), path: '/priority' },
  { title: t('savings-settings'), path: '/savingssettings' }
])

const totalAmount = 2781.0

function languageSelected(language) {
  selectedLanguage.value = language
  locale.value = language.toLowerCase()
}

const selectMenuItem = (item) => {
  if (item.path) {
    router.push({
      path: item.path
    })
  }
}

function themeSelected(selectedTheme) {
  theme.global.name.value = selectedTheme
  Cookies.set('theme', selectedTheme)
}

function goHome() {
  router.push({
    path: '/'
  })
}
</script>
