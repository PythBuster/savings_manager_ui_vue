<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('my-envelopes') }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(card, index) in cardData"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <!-- Partly (random) dummy values, as the API fetch is not implemented yet -->
        <!-- With noLimit set to true, the value in goal is disregarded in Envelope.vue -->
        <Envelope
          :title="card.name"
          :priority="card.priority || index + 1"
          :goal="
            card.goal || Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000
          "
          :currentAmount="card.balance"
          :increment="
            card.increment || Math.floor(Math.random() * (1000 - 100 + 1)) + 100
          "
          :noLimit="card.noLimit || Math.random() < 0.5"
        />
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
import { useI18n } from 'vue-i18n'

// t used for snackbarMessage, otherwise $t globally available
const { t } = useI18n({})

const showSnackbar = ref(false)
const snackbarMessage = ref('')

const cardData = ref([])

const currentAmount = 1000.5

onMounted(async () => {
  try {
    cardData.value = (await getMoneyboxes()).moneyboxes
  } catch (error) {
    console.error('Failed to fetch moneyboxes:', error)
    snackbarMessage.value = t('fetch-envelopes-fail')
    showSnackbar.value = true
  }
})
</script>
