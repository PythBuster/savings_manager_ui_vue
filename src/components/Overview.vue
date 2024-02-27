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
        <Envelope
          :title="card.title"
          :priority="card.priority"
          :goal="card.goal"
          :currentAmount="card.currentAmount"
          :increment="card.increment"
          :noLimit="card.noLimit"
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
  </v-container>
</template>

<script setup>
// Dummy data, API fetch not implemented yet
const cardData = [
  {
    title: 'Notgroschen',
    priority: 1,
    goal: 10000.0,
    currentAmount: 125.0,
    increment: 30.0,
    noLimit: false
  },
  {
    title: 'Urlaub',
    priority: 2,
    goal: 3500.0,
    currentAmount: 25.0,
    increment: 50.0,
    noLimit: false
  },
  {
    title: 'PC',
    priority: 3,
    goal: 2000.0,
    currentAmount: 400.0,
    increment: 25.0,
    noLimit: false
  },
  {
    title: 'Haushalt',
    priority: 4,
    goal: 1000.0,
    currentAmount: 105.0,
    increment: 10.0,
    noLimit: false
  },
  {
    title: 'Haustier',
    priority: 5,
    goal: 850.0,
    currentAmount: 125.0,
    increment: 5.0,
    noLimit: false
  },
  {
    title: 'Bildung',
    priority: 6,
    goal: 0,
    currentAmount: 0.0,
    increment: 25.0,
    noLimit: true // with noLimit set to true, the value in goal is disregarded in Envelope.vue
  }
]
const currentAmount = 1000.5
</script>
