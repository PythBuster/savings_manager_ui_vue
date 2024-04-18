<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('my-envelopes') }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(card, index) in sortedMoneyboxes"
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
        <Overflow :currentAmount="overflow ? overflow.balance : 0" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import global from '@/global.js'

const sortedMoneyboxes = computed(() => {
  return global.moneyboxes
    .filter((moneybox) => !moneybox.is_overflow)
    .sort((a, b) => a.priority - b.priority)
})

const overflow = computed(() => {
  return global.moneyboxes.find((moneybox) => moneybox.is_overflow === true)
})
</script>
