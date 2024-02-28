<template>
  <v-main>
    <EnvelopeOverview :id="id" />
  </v-main>
</template>
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const id = Number(route.params.id)
</script>
