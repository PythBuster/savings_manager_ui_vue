<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'">
          {{ $t('savings-settings') }}
        </h1>
      </v-col>
    </v-row>
    <v-row :class="display.mdAndUp ? 'mt-16' : ''">
      <v-col cols="12" sm="6" class="d-flex align-center">
        <CurrencyInput :label="$t('savings-amount')" v-model="saveAmount" />
      </v-col>
      <v-col cols="12" sm="6" md="4" offset-md="1">
        <SavingsSettingsOverview />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          @click="saveClicked"
          :disabled="saveAmount === null || isNaN(saveAmount)"
          >{{ $t('save') }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import router from '@/router/index.js'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const display = ref(useDisplay())

// Dummy data
const saveAmount = ref(100)

function saveClicked() {
  router.push({
    path: '/'
  })
}
</script>
