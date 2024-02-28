<template>
  <v-main>
    <EnvelopeEdit :id="id" />
  </v-main>
</template>
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const id = Number(route.params.id)
</script>
