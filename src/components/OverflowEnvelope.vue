<template>
  <v-card
    @click="OverflowEnvelopeClicked"
    variant="tonal"
    min-height="180"
    class="d-flex align-center justify-center"
  >
    <div class="text-center">
      <v-card-item>
        <v-card-title>{{ $t('overflow-envelope') }}</v-card-title>
      </v-card-item>
      <v-card-text class="font-weight-bold">
        {{ formatCurrency(currentAmount) }}
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup>
import router from '@/router'
import { formatCurrency } from '@/utils'

defineProps({
  currentAmount: Number
})

function OverflowEnvelopeClicked() {
  router.push({
    path: '/editoverflow'
  })
}
</script>
