<template>
  <v-card
    @click="envelopeClicked"
    variant="tonal"
    min-height="180"
    class="d-flex align-center justify-center"
  >
    <div class="text-center">
      <v-card-item>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-subtitle>{{ $t('priority') }} {{ priority }}</v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <div>{{ $t('goal') }} {{ formatCurrency(goal) }}</div>
        <div class="font-weight-bold">
          {{ formatCurrency(currentAmount) }}
        </div>
        <div>+{{ formatCurrency(increment) }}</div>
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup>
import router from '@/router'
import { formatCurrency } from '@/utils'

const props = defineProps({
  title: String,
  priority: Number,
  goal: Number,
  currentAmount: Number,
  increment: Number
})

function envelopeClicked() {
  router.push({
    path: '/envelope',
    query: { title: props.title }
  })
}
</script>
