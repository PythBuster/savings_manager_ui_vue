<template>
  <v-card variant="flat" class="text-center">
    <v-card-item>
      <v-card-title>{{ $t('total-savings') }}</v-card-title>
    </v-card-item>
    <v-card-text class="font-weight-bold text-h5">
      {{ formatCurrency(totalAmount) }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import global from '@/global.js'
import { formatCurrency } from '@/utils.js'

const totalAmount = ref('0')

watchEffect(() => {
  totalAmount.value = global.moneyboxes.reduce((total, moneybox) => {
    return total + moneybox.balance
  }, 0)
})
</script>
