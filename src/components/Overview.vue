<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('my-envelopes') }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(card, index) in global.moneyboxes"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <Envelope :id="card.id" />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3">
        <NewEnvelope />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <OverflowEnvelope :currentAmount="currentAmount" />
      </v-col>
    </v-row>
    <v-snackbar v-model="showSnackbar" :timeout="5000" color="error">
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn @click="showSnackbar = false">{{ $t('close') }}</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getMoneyboxes } from '@/api.js'
import global from '@/global.js'
import { useI18n } from 'vue-i18n'

// t used for snackbarMessage, otherwise $t globally available
const { t } = useI18n({})

const showSnackbar = ref(false)
const snackbarMessage = ref('')

// Dummy data, API fetch not implemented yet
const currentAmount = 1000.5

onMounted(async () => {
  try {
    const moneyboxes = await getMoneyboxes()

    // Assign dummy values, API fetch not implemented yet
    let priority = 1
    moneyboxes.forEach((moneybox) => {
      moneybox.goal = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000
      moneybox.increment = Math.floor(Math.random() * (1000 - 100 + 1)) + 100
      moneybox.noLimit = Math.random() < 0.5
      moneybox.priority = priority++
    })

    global.setMoneyboxes(moneyboxes)
  } catch (error) {
    console.error('Failed to fetch moneyboxes:', error)
    snackbarMessage.value = t('fetch-envelopes-fail')
    showSnackbar.value = true
  }
})
</script>
