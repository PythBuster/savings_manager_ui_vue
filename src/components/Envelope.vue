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
          <v-card-subtitle v-if="global.findMoneyboxById(id).priority != 0"
            >{{ $t('priority') }}
            {{ global.findMoneyboxById(id).priority }}</v-card-subtitle
          >
        </v-card-item>
        <v-card-text>
          <p class="text-info" v-if="global.findMoneyboxById(id).priority != 0">
            {{
              global.findMoneyboxById(id).savingsTarget !== null
                ? $t('savings-target') + formatCurrency(global.findMoneyboxById(id).savingsTarget)
                : $t('savings-target') + $t('no-limit')
            }}
          </p>
          <p class="font-weight-bold text-body-1">
            {{ formatCurrency(global.findMoneyboxById(id).balance) }}
          </p>
          <p class="text-success" v-if="global.findMoneyboxById(id).priority != 0">
            {{
              !global.findMoneyboxById(id).savings_amout
                ? $t('savings-amount') + formatCurrency(global.findMoneyboxById(id).savingsAmount)
                : "+" + $t('savings-amount') + $t('no-limit')
            }}
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
