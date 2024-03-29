<template>
  <v-container>
    <v-row v-if="overflow" class="d-flex justify-space-between align-center">
      <v-col cols="auto" md="auto">
        <h1 class="text-h4">
          {{ $t('envelope') + ': ' + $t('overflow-envelope') }}
        </h1>
      </v-col>
      <v-col cols="auto" class="d-flex justify-end">
        <v-btn @click="backClicked">{{ $t('back-to-overview') }}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TransactionLogs :id="overflow.id" :showAll="true" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { computed } from 'vue'
import global from '@/global.js'
import router from '@/router'

const overflow = computed(() => {
  return global.moneyboxes.find((moneybox) => moneybox.is_overflow === true)
})

function backClicked() {
  router.push({
    path: `/overflow`
  })
}
</script>
