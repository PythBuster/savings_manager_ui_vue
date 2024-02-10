<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ $t('settings') }}</h1>
      </v-col>
    </v-row>
    <v-row class="mt-16">
      <v-col cols="12" sm="6">
        <v-text-field :label="$t('envelope-name')" v-model="newTitle" />
        <CurrencyInput :label="$t('target-amount')" v-model="newTargetAmount" />
        <CurrencyInput :label="$t('savings-amount2')" v-model="newSaveAmount" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          :disabled="
            newSaveAmount === null || isNaN(newSaveAmount) || newTitle === ''
          "
          >{{ $t('save') }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const newTitle = ref(route.query.title)
const newTargetAmount = ref(route.query.targetAmount)
const newSaveAmount = ref(route.query.savingsAmount)
</script>
