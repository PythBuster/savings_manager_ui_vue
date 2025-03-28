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
          <v-card-title 
          v-if="global.findMoneyboxesSavingsForecast(id) != null"
          >
            <span
            v-if="global.findMoneyboxesSavingsForecast(id).reachedInMonths == -1 || global.findMoneyboxesSavingsForecast(id).reachedInMonths > 0"
            > 
                <span  style="color: #43A047" v-if="global.findMoneyboxesSavingsForecast(id) != null">
                {{ global.findMoneyboxById(id).name }}
                </span>
                <span
                v-else
                >
                {{ global.findMoneyboxById(id).name }}
                </span> 
            </span>
            <span
            v-else
            >
              <span
              v-if="global.findMoneyboxesSavingsForecast(id).reachedInMonths == 0"
               style="color: #1E88E5"
              > 
              {{ global.findMoneyboxById(id).name }}
              </span>
              <span
              v-else
              > 
              {{ global.findMoneyboxById(id).name }}
              </span> 
            </span>
          </v-card-title>
          <v-card-title v-else>

                <span style="color: #43A047" v-if="global.findMoneyboxesSavingsForecast(id) != null">
                {{ global.findMoneyboxById(id).name }}
                </span>
                <span
                v-else
                >
                {{ global.findMoneyboxById(id).name }}
                </span>               
          </v-card-title>

          <v-card-subtitle v-if="global.findMoneyboxById(id).priority != 0 && global.settings.value.isAutomatedSavingActive"
            >{{ $t('priority') }}
            {{ global.findMoneyboxById(id).priority }}</v-card-subtitle
          >
        </v-card-item>
        <v-card-text>
          <span v-if="global.settings.value.isAutomatedSavingActive">

            <p class="text-success" v-if="global.findMoneyboxById(id).priority != 0">
              {{
                !global.findMoneyboxById(id).savings_amout
                  ? $t('savings-amount') + formatCurrency(global.findMoneyboxById(id).savingsAmount)
                  : "+" + $t('savings-amount') + $t('no-limit')
              }}
            </p>         
            <p class="text-info" v-if="global.findMoneyboxById(id).priority != 0">
              {{
                global.findMoneyboxById(id).savingsTarget !== null
                  ? $t('savings-target') + formatCurrency(global.findMoneyboxById(id).savingsTarget)
                  : $t('savings-target') + $t('no-limit')
              }}
            </p>
            <p v-if="global.findMoneyboxById(id).savingsTarget !== null & global.findMoneyboxById(id).savingsAmount > 0">
              <span style="font-size: smaller;" v-if="global.findMoneyboxesSavingsForecast(id) != null">
              <span
                v-if="global.findMoneyboxesSavingsForecast(id).reachedInMonths == -1"
                >
                {{$t('reached-in')}}: {{$t('never')}}
                </span>
                <span v-else>
                  <span
                  v-if="global.findMoneyboxesSavingsForecast(id).reachedInMonths != 0"
                  >
                    {{$t('reached-in')}}: ~{{
                    global.findMoneyboxesSavingsForecast(id).reachedInMonths
                  }} {{$t('months')}}
                  </span>
                </span>
            </span>
            </p>
          </span>
          <br >
          <p class="font-weight-bold text-body-1">
            {{ formatCurrency(global.findMoneyboxById(id).balance) }}
          </p>

          <br >


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
