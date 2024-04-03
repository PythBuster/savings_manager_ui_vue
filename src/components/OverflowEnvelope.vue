<template>
  <v-card
    @click="OverflowEnvelopeClicked"
    variant="tonal"
    min-height="180"
    class="d-flex align-center justify-center text-center"
  >
    <v-row>
      <v-col>
        <v-card-item>
          <v-card-title>{{ $t('overflow-envelope') }}</v-card-title>
        </v-card-item>
        <v-card-text class="font-weight-bold">
          {{ formatCurrency(currentAmount) }}
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import router from '@/router/index.js'
import { formatCurrency } from '@/utils.js'

defineProps({
  currentAmount: Number
})

function OverflowEnvelopeClicked() {
  router.push({
    path: '/overflow'
  })
}
</script>
