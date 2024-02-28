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
          <v-card-title>{{ global.moneyboxes[index].name }}</v-card-title>
          <v-card-subtitle
            >{{ $t('priority') }}
            {{ global.moneyboxes[index].priority }}</v-card-subtitle
          >
        </v-card-item>
        <v-card-text>
          <p>
            {{
              !global.moneyboxes[index].noLimit
                ? $t('goal') + formatCurrency(global.moneyboxes[index].goal)
                : $t('goal') + $t('no-limit')
            }}
          </p>
          <p class="font-weight-bold">
            {{ formatCurrency(global.moneyboxes[index].balance) }}
          </p>
          <p>+{{ formatCurrency(global.moneyboxes[index].increment) }}</p>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import global from '@/global.js'
import router from '@/router'
import { formatCurrency } from '@/utils'

const index = computed(() =>
  global.moneyboxes.findIndex((item) => item.id === props.id)
)

const props = defineProps({
  id: Number
})

function envelopeClicked() {
  router.push({
    path: `/envelope/${props.id}`
  })
}
</script>
