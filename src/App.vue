<template>
  <v-app>
    <v-app-bar :density="display.smAndDown ? 'compact' : ''">
      <v-app-bar-title>
        <v-btn v-if="!display.xs" @click="goHome">
          <v-icon size="x-large" class="mr-2">mdi-home</v-icon>
          {{ appName }} v{{ appVersion }}</v-btn
        >
        <v-btn v-if="display.xs" @click="goHome">
          <v-icon size="x-large">mdi-home</v-icon></v-btn
        >
      </v-app-bar-title>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="mr-2"
            ><v-icon size="x-large">mdi-theme-light-dark</v-icon></v-btn
          >
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
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="mr-2">{{ selectedLanguage }}</v-btn>
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
          <v-btn v-bind="props"><v-icon size="x-large">mdi-menu</v-icon></v-btn>
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
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <RouterLink to="/"></RouterLink>

    <RouterView />
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import router from '@/router/index.js'
import { useTheme } from 'vuetify'
import Cookies from 'js-cookie'
import { fetchOrCreateSettings } from '@/utils.js'
import { useDisplay } from 'vuetify'
import { getAppMetadata  } from "@/api.js";
import global from './global'

const display = ref(useDisplay())

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


const menuItems = computed(() => {

  const items = [
    { title: t('my-envelopes'), path: '/' },
    { title: t('settings'), path: '/settings' }
  ];

  if (
    global.settings.value !== null &&
    global.settings.value.isAutomatedSavingActive
  ) {
    items.splice(1, 0, { title: t('priority-list'), path: '/prioritylist' });
  }

  return items;
});

function languageSelected(language) {
  selectedLanguage.value = language
  Cookies.set('locale', language)
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

const appName = ref("")
const appVersion = ref("")
  
onMounted(async () => {
  const appData = await getAppMetadata()
  appName.value = appData.appName
  appVersion.value = appData.appVersion

  fetchOrCreateSettings();

  const savedLocale = Cookies.get('locale')
  if (savedLocale) {
    locale.value = savedLocale.toLowerCase()
    selectedLanguage.value = savedLocale
  }
})

</script>
