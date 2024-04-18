<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'">
          {{ $t('my-envelopes') }}
        </h1>
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
        <Overflow :currentAmount="currentAmount" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import global from '@/global.js'
import { useDisplay } from 'vuetify'

const display = ref(useDisplay())

// Dummy data, API fetch not implemented yet
const currentAmount = 0
</script>
