<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ $t('my-envelopes') }}</h1>
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
        />
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3">
        <NewEnvelope />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <OverflowEnvelope :currentAmount="1000" />
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
    increment: 30.0
  },
  {
    title: 'Urlaub',
    priority: 2,
    goal: 4000.0,
    currentAmount: 400.0,
    increment: 50.0
  },
  {
    title: 'PC',
    priority: 3,
    goal: 2000.0,
    currentAmount: 150.0,
    increment: 25.0
  },
  {
    title: 'Haushalt',
    priority: 4,
    goal: 5000.0,
    currentAmount: 600.0,
    increment: 40.0
  },
  {
    title: 'Haus',
    priority: 5,
    goal: 250000.0,
    currentAmount: 5000.0,
    increment: 500.0
  },
  {
    title: 'Bildung',
    priority: 6,
    goal: 10000.0,
    currentAmount: 0.0,
    increment: 20.0
  }
]
</script>
