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
import { formatCurrency } from '@/utils.js'

defineProps({
  totalAmount: Number
})
</script>
