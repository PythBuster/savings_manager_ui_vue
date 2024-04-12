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
          <v-card-title>{{ global.findMoneyboxById(id).name }}</v-card-title>
          <v-card-subtitle
            >{{ $t('priority') }}
            {{ global.findMoneyboxById(id).priority }}</v-card-subtitle
          >
        </v-card-item>
        <v-card-text>
          <p class="text-info">
            {{
              !global.findMoneyboxById(id).no_limit
                ? $t('goal') + formatCurrency(global.findMoneyboxById(id).goal)
                : $t('goal') + $t('no-limit')
            }}
          </p>
          <p class="font-weight-bold text-body-1">
            {{ formatCurrency(global.findMoneyboxById(id).balance) }}
          </p>
          <p class="text-success">
            +{{ formatCurrency(global.findMoneyboxById(id).increment) }}
          </p>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import global from '@/global.js'
import router from '@/router/index.js'
import { formatCurrency } from '@/utils.js'

const props = defineProps({
  id: Number
})

function envelopeClicked() {
  router.push({
    path: `/envelope/${props.id}`
  })
}
</script>
