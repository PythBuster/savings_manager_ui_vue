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
          <!-- Titel-Logik: unverändert im Verhalten -->
          <v-card-title v-if="forecast">
            <span v-if="isEarlyOrNoForecast">
              <span v-if="isMonthOne" class="text-green">
                {{ moneybox.name }}
              </span>
              <span v-else>{{ moneybox.name }}</span>
            </span>

            <span v-else>
              <span v-if="isReachedNow" class="text-blue">
                {{ moneybox.name }}
              </span>
              <span v-else>{{ moneybox.name }}</span>
            </span>
          </v-card-title>

          <v-card-title v-else>
            {{ moneybox.name }}
          </v-card-title>

          <v-card-subtitle v-if="moneybox.priority != 0 && isAutomated">
            {{ $t('priority') }} {{ moneybox.priority }}
          </v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <span v-if="isAutomated">
            <p class="text-success" v-if="moneybox.priority != 0">
              {{
                $t('savings-amount') + formatCurrency(moneybox.savingsAmount)
              }}
            </p>

            <p class="text-info" v-if="moneybox.priority != 0">
              {{
                moneybox.savingsTarget !== null
                  ? $t('savings-target') + formatCurrency(moneybox.savingsTarget)
                  : $t('savings-target') + $t('no-limit')
              }}
            </p>

            <p
              v-if="moneybox.savingsTarget !== null && moneybox.savingsAmount > 0"
              class="forecast-info"
            >
              <span v-if="forecast">
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

// --- safer computed defaults ---
const forecast = computed(
  () =>
    global.findMoneyboxesSavingsForecast(props.id) || {
      reachedInMonths: null,
      monthlyDistributions: []
    }
)

const moneybox = computed(
  () =>
    global.findMoneyboxById(props.id) || {
      name: '',
      balance: 0,
      priority: 0,
      savingsAmount: 0,
      savingsTarget: null
    }
)

// --- helper for readability ---
const isAutomated = computed(() => global.settings.value.isAutomatedSavingActive)

/**
 * Forecast is "early" when reachedInMonths is null
 * or the first distribution month is 1
 */
const isEarlyOrNoForecast = computed(() => {
  const f = forecast.value
  if (!f || !Array.isArray(f.monthlyDistributions)) return false
  return (
    f.reachedInMonths == null ||
    (f.monthlyDistributions.length > 0 && f.monthlyDistributions[0].month == 1)
  )
})

/** First month distribution (month === 1) */
const isMonthOne = computed(() => {
  const f = forecast.value
  return (
    f &&
    Array.isArray(f.monthlyDistributions) &&
    f.monthlyDistributions.length > 0 &&
    f.monthlyDistributions[0].month == 1
  )
})

/** Reached now (reachedInMonths === 0) */
const isReachedNow = computed(() => {
  const f = forecast.value
  return f && f.reachedInMonths == 0
})

function envelopeClicked() {
  router.push({ path: `/envelope/${props.id}` })
}
</script>

<style scoped>
.text-green {
  color: #43a047;
}

.text-blue {
  color: #1e88e5;
}

.forecast-info {
  font-size: smaller;
}
</style>
