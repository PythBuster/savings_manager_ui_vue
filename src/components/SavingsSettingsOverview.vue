<template>
  <v-card variant="outlined">
    <v-card-item>
      <v-card-title>{{ $t('savings-settings') }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-row v-for="item in tableItems" :key="item.name">
        <v-col class="text-truncate pr-0">
          {{ item.name }}
        </v-col>
        <v-col cols="auto" class="pl-0">
          {{ item.data }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils.js'

// t used for tableItems, otherwise $t globally available
import { useI18n } from 'vue-i18n'
const { t } = useI18n({})

// Dummy data, API fetch not implemented yet
let tableItems = computed(() => [
  {
    name: t('savings-amount') + ':',
    data: formatCurrency(0)
  },
  {
    name: t('savings-cycle'),
    data: t('monthly')
  },
  {
    name: t('allocated'),
    data: formatCurrency(0)
  },
  {
    name: t('uncommitted'),
    data: formatCurrency(0)
  }
])
</script>
