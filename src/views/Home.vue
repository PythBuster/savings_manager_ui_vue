<template>
  <v-app-bar>
    <v-app-bar-title>Savings Manager</v-app-bar-title>
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
    <v-list>
      <v-list-item
        v-for="(item, index) in menuItems"
        :key="index"
        @click="selectMenuItem(item)"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <Overview />
  </v-main>
</template>

<script setup>
// t used for menuItems, otherwise $t globally available
import { useI18n } from 'vue-i18n'
const { t } = useI18n({})

const menuItems = [
  { title: t('my-envelopes') },
  { title: t('logs') },
  { title: t('priority-list') },
  { title: t('savings-settings') }
]

const selectMenuItem = (item) => {
  console.log('Selected:', item.title)
}
</script>
