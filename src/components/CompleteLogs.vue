<template>
  <v-container>
    <v-row
      v-if="global.findMoneyboxById(id)"
      class="d-flex justify-space-between align-center"
    >
      <v-col cols="auto" md="auto">
        <h1 class="text-h4">
          {{ $t('envelope') + ': ' + global.findMoneyboxById(id).name }}
        </h1>
      </v-col>
      <v-col cols="auto" class="d-flex justify-end">
        <v-btn @click="backClicked">{{ $t('back-to-overview') }}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TransactionLogs :id="id" :showAll="true" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import global from '@/global.js'
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()

const id = Number(route.params.id)

function backClicked() {
  router.push({
    path: `/envelope/${id}`
  })
}
</script>
