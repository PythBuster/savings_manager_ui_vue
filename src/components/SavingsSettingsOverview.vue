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
    if (!moneybox.is_overflow) {
      return total + moneybox.increment
    }
    return total
  }, 0)

  allocated = Math.min(allocated, global.settings.value.savings_amount)

  let uncommitted = Math.max(
    global.settings.value.savings_amount - allocated,
    0
  )

  return [
    {
      name: t('savings-amount') + ':',
      data: formatCurrency(global.settings.value.savings_amount)
    },
    {
      name: t('savings-cycle'),
      data: t(global.settings.value.savings_cycle)
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
