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

// t used for tableItems, otherwise $t globally available
import { useI18n } from 'vue-i18n'
const { t } = useI18n({})

let tableItems = computed(() => {
  if (
    !global.settings.value ||
    !global.moneyboxes ||
    !global.moneyboxes.length
  ) {
    return []
  }

  let allocated = global.moneyboxes.reduce((total, moneybox) => {
    if (moneybox.priority != 0) {
      return total + moneybox.savingsAmount
    }
    return total
  }, 0)

  const planned = allocated
  allocated = Math.min(allocated, global.settings.value.savingsAmount)

  let uncommitted = Math.max(
    global.settings.value.savingsAmount - allocated,
    0
  )

  const savings_active_status = global.settings.value.isAutomatedSavingActive ? t("activated") : t("deactivated");

  return [
    {
      name: t('planned'),
      data: formatCurrency(planned)
    },
    {
      name: t('savings-amount'),
      data: formatCurrency(global.settings.value.savingsAmount)
    },
    {
      name: t('automated-savings-enabled'),
      data: savings_active_status
    },
    {
      name: t('allocated'),
      data: formatCurrency(allocated)
    },
    {
      name: t('uncommitted'),
      data: formatCurrency(uncommitted)
    }
  ]
})
</script>
