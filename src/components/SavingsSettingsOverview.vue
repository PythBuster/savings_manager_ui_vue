<template>
  <v-card variant="outlined">
    <v-card-item>
      <v-card-title>{{ $t('savings-settings') }}</v-card-title>
    </v-card-item>
    <v-table>
      <tbody>
        <tr v-for="item in tableItems" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.data }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils'

// t used for tableItems, otherwise $t globally available
import { useI18n } from 'vue-i18n'
const { t } = useI18n({})

// Dummy data, API fetch not implemented yet
let tableItems = computed(() => [
  {
    name: t('savings-amount'),
    data: formatCurrency(500.0)
  },
  {
    name: t('savings-cycle'),
    data: t('monthly')
  },
  {
    name: t('allocated'),
    data: formatCurrency(145.0)
  },
  {
    name: t('uncommitted'),
    data: formatCurrency(355.0)
  }
])
</script>
