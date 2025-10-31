<template>
  <v-card variant="outlined">
    <v-card-item>
      <v-card-title>{{ $t('settings') }}</v-card-title>
    </v-card-item>

    <v-card-text>
      <v-row v-for="item in tableItems" :key="item.name">
        <v-col class="text-truncate pr-0">
          {{ item.name }}
        </v-col>
        <v-col
          cols="auto"
          class="pl-0"
          :class="{
            'text-success': item.name === t('allocated'),
            'text-primary': item.name === t('uncommitted')
          }"
        >
          {{ item.data }}
        </v-col>
      </v-row>
    </v-card-text>

    <TotalSavings />
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils.js'
import global from '@/global.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({})

const tableItems = computed(() => {
  const settings = global.settings.value
  const moneyboxes = global.moneyboxes

  if (!settings || !Array.isArray(moneyboxes) || moneyboxes.length === 0) {
    return []
  }

  const allocatedRaw = moneyboxes
    .filter((m) => m.priority !== 0)
    .reduce((sum, m) => sum + m.savingsAmount, 0)

  const allocated = Math.min(allocatedRaw, settings.savingsAmount)
  const uncommitted = Math.max(settings.savingsAmount - allocated, 0)
  const savingsStatus = settings.isAutomatedSavingActive
    ? t('activated')
    : t('deactivated')

  return [
    { name: t('planned'), data: formatCurrency(allocatedRaw) },
    { name: t('savings-amount'), data: formatCurrency(settings.savingsAmount) },
    { name: t('automated-savings-enabled'), data: savingsStatus },
    { name: t('allocated'), data: formatCurrency(allocated) },
    { name: t('uncommitted'), data: formatCurrency(uncommitted) }
  ]
})
</script>
