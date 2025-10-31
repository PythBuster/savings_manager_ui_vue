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
          <v-card-title v-if="forecast">
            <span
              v-if="forecast.reachedInMonths == null ||
                (forecast.monthlyDistributions.length > 0 &&
                 forecast.monthlyDistributions[0]['month'] == 1)"
            >
              <span
                style="color: #43A047"
                v-if="forecast.monthlyDistributions.length > 0 &&
                  forecast.monthlyDistributions[0]['month'] == 1"
              >
                {{ moneybox.name }}
              </span>
              <span v-else>{{ moneybox.name }}</span>
            </span>

            <span v-else>
              <span
                v-if="forecast.reachedInMonths == 0"
                style="color: #1E88E5"
              >
                {{ moneybox.name }}
              </span>
              <span v-else>{{ moneybox.name }}</span>
            </span>
          </v-card-title>

          <v-card-title v-else>
            {{ moneybox.name }}
          </v-card-title>

          <v-card-subtitle
            v-if="moneybox.priority != 0 &&
              global.settings.value.isAutomatedSavingActive"
          >
            {{ $t('priority') }} {{ moneybox.priority }}
          </v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <span v-if="global.settings.value.isAutomatedSavingActive">
            <p class="text-success" v-if="moneybox.priority != 0">
              {{
                !moneybox.savingsAmount
                  ? $t('savings-amount') + formatCurrency(moneybox.savingsAmount)
                  : $t('savings-amount') + $t('no-limit')
              }}
            </p>

            <p class="text-info" v-if="moneybox.priority != 0">
              {{
                moneybox.savingsTarget !== null
                  ? $t('savings-target') + formatCurrency(moneybox.savingsTarget)
                  : $t('savings-target') + $t('no-limit')
              }}
            </p>

            <p v-if="moneybox.savingsTarget !== null && moneybox.savingsAmount > 0">
              <span style="font-size: smaller;" v-if="forecast">
                <span v-if="forecast.reachedInMonths == null">
                  {{ $t('reached-in') }}: {{ $t('never') }}
                </span>
                <span v-else>
                  <span v-if="forecast.reachedInMonths != 0">
                    {{ $t('reached-in') }}: ~{{ forecast.reachedInMonths }}
                    {{ $t('months') }}
                  </span>
                </span>
              </span>
            </p>
          </span>

          <br />
          <p class="font-weight-bold text-body-1">
            {{ formatCurrency(moneybox.balance) }}
          </p>
          <br />
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import global from '@/global.js'
import router from '@/router/index.js'
import { formatCurrency } from '@/utils.js'

const props = defineProps({
  id: Number
})

const forecast = computed(() => global.findMoneyboxesSavingsForecast(props.id))
const moneybox = computed(() => global.findMoneyboxById(props.id))

function envelopeClicked() {
  router.push({
    path: `/envelope/${props.id}`
  })
}
</script>
