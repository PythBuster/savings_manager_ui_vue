<template>
  <v-card variant="flat">
    <div class="text-center">
      <v-card-item>
        <v-card-title>{{ $t('total-savings') }}</v-card-title>
      </v-card-item>
      <v-card-text class="font-weight-bold text-h5">
        {{ formatCurrency(totalAmount) }}
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup>
import { formatCurrency } from '@/utils'

defineProps({
  totalAmount: Number
})
</script>
