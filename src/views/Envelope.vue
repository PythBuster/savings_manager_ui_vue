<template>
  <v-main>
    <EnvelopeOverview :id="id" />
  </v-main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import EnvelopeOverview from '@/components/EnvelopeOverview.vue'

const route = useRoute()

const id = Number(route.params.id)
</script>
