<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('savings-settings') }}</h1>
      </v-col>
    </v-row>
    <v-row class="mt-16">
      <v-col cols="12" sm="6">
        <CurrencyInput :label="$t('savings-amount2')" v-model="saveAmount" />
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
import router from '@/router'
import { ref } from 'vue'

// Dummy data
const saveAmount = ref(100.0)

function saveClicked() {
  router.push({
    path: '/'
  })
}
</script>
