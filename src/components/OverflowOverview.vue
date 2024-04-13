<template>
  <v-container>
    <v-row class="d-flex justify-space-between align-center">
      <v-col cols="auto" md="auto">
        <h1 class="text-h4">
          {{ $t('envelope') + ': ' + $t('overflow-envelope') }}
        </h1>
      </v-col>
      <v-col cols="auto" class="d-flex justify-end">
        <v-btn>{{ $t('view-complete-logs') }}</v-btn>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="auto">
        <v-table>
          <tbody>
            <tr>
              <td>{{ $t('balance') }}</td>
              <td>{{ balance }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn color="success" class="mb-2">{{ $t('deposit') }}</v-btn>
        <v-btn color="warning" class="mb-2">{{ $t('withdraw') }}</v-btn>
        <v-btn color="info">{{ $t('transfer') }}</v-btn>
      </v-col>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn @click="changeSettingsClicked" class="mb-2">{{
          $t('change-settings')
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="9">
        <TransactionLogs />
      </v-col>
      <!-- Conditional classes and forced unmount/remount of BarChart with v-if
      to ensure proper size/aspect ratio of chart on page (re)load and when chart wraps
      back and forth between below amd right of the transaction table on window resize -->
      <v-col
        cols="12"
        lg="3"
        :class="display.lgAndUp ? '' : 'position-relative pt-50-percent'"
      >
        <BarChart v-if="display.lgAndUp" />
        <BarChart v-if="!display.lgAndUp" class="position-absolute top-0" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref } from 'vue'
import router from '@/router/index.js'
import { formatCurrency } from '@/utils.js'
import { useDisplay } from 'vuetify'

const display = ref(useDisplay())

const balance = formatCurrency(125)

const changeSettingsClicked = () => {
  router.push({
    path: '/editoverflow'
  })
}
</script>
<style scoped>
.pt-50-percent {
  padding-top: 50%; /* 2:1 Aspect Ratio */
}
.top-0 {
  top: 0;
}
</style>
