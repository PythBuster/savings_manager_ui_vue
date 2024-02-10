<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ $t('new-envelope-settings') }}</h1>
      </v-col>
    </v-row>
    <v-row class="mt-16">
      <v-col cols="12" sm="6">
        <v-text-field :label="$t('envelope-name')" v-model="envelopeName" />
        <CurrencyInput :label="$t('target-amount')" v-model="targetAmount" />
        <CurrencyInput :label="$t('savings-amount2')" v-model="saveAmount" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          @click="createClicked"
          :disabled="
            saveAmount === null || isNaN(saveAmount) || envelopeName === ''
          "
          >{{ $t('create-continue-priorities') }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref } from 'vue'
import router from '@/router'

// Dummy data
const saveAmount = ref(10.0)
const targetAmount = ref()
const envelopeName = ref('Neue Kasse')

function createClicked() {
  router.push({
    path: '/priority'
  })
}
</script>
