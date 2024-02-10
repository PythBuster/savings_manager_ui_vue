<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        <v-btn @click="goHome">Savings Manager</v-btn>
      </v-app-bar-title>
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
import router from '@/router'

// t used for menuItems, otherwise $t globally available
import { useI18n } from 'vue-i18n'
import SavingsSettingsOverview from './components/SavingsSettingsOverview.vue'
const { t } = useI18n({})

const menuItems = [
  { title: t('my-envelopes'), path: '/' },
  { title: t('logs') },
  { title: t('priority-list'), path: '/priority' },
  { title: t('savings-settings') }
]

const totalAmount = 2781.0

const selectMenuItem = (item) => {
  if (item.path) {
    router.push({
      path: item.path
    })
  }
}

function goHome() {
  router.push({
    path: '/'
  })
}
</script>
