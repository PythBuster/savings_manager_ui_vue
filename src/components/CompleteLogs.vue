<template>
  <v-container>
    <v-row
      v-if="global.findMoneyboxById(id)"
      class="d-flex justify-space-between align-center"
    >
      <v-col cols="auto" md="auto">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'"
        v-if="global.findMoneyboxById(id).priority!=0">
          {{ $t('envelope') + ': ' + global.findMoneyboxById(id).name }}
        </h1>
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'"
        v-if="global.findMoneyboxById(id).priority==0">
          {{ $t('envelope') + ': ' + $t('overflow-moneybox') }}
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
import { ref } from 'vue'
import global from '@/global.js'
import router from '@/router/index.js'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

const display = ref(useDisplay())

const route = useRoute()

const id = Number(route.params.id)

function backClicked() {
  router.back()
}
</script>
