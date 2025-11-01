<template>
  <v-container>
    <v-row
      v-if="moneybox"
      class="d-flex justify-space-between align-center"
    >
      <v-col cols="auto" md="auto">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'">
          {{ $t('envelope') + ': ' + (moneybox.priority === 0 ? $t('overflow-moneybox') : moneybox.name) }}
        </h1>
      </v-col>

      <v-col cols="auto" class="d-flex justify-end">
        <v-btn @click="backClicked">
          {{ $t('back-to-overview') }}
        </v-btn>
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
import { computed } from 'vue'
import global from '@/global.js'
import router from '@/router/index.js'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import TransactionLogs from '@/components/TransactionLogs.vue'

const display = useDisplay()
const route = useRoute()

const id = computed(() => Number(route.params.id))
const moneybox = computed(() => global.findMoneyboxById(id.value))

function backClicked() {
  router.back()
}
</script>
