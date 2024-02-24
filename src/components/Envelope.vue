<template>
  <v-card
    @click="envelopeClicked"
    variant="tonal"
    min-height="180"
    class="d-flex align-center justify-center text-center"
  >
    <v-row>
      <v-col>
        <v-card-item>
          <v-card-title>{{ title }}</v-card-title>
          <v-card-subtitle>{{ $t('priority') }} {{ priority }}</v-card-subtitle>
        </v-card-item>
        <v-card-text>
          <p>
            {{
              !noLimit
                ? $t('goal') + formatCurrency(goal)
                : $t('goal') + $t('no-limit')
            }}
          </p>
          <p class="font-weight-bold">
            {{ formatCurrency(currentAmount) }}
          </p>
          <p>+{{ formatCurrency(increment) }}</p>
        </v-card-text>
      </v-col>
    </v-row>
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
  increment: Number,
  noLimit: Boolean
})

function envelopeClicked() {
  router.push({
    path: '/envelope',
    query: { title: props.title }
  })
}
</script>
