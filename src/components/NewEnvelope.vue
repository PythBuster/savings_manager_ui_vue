<template>
  <v-card
    @click="createNewEnvelope"
    variant="tonal"
    min-height="180"
    class="d-flex flex-column align-center justify-center text-center"
  >
    <v-card-title>{{ $t('new-envelope') }}</v-card-title>

    <v-card-actions>
      <v-btn icon="mdi-plus" variant="tonal"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function createNewEnvelope() {
  router.push('/createenvelope')
}
</script>
