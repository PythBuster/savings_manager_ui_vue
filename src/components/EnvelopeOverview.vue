<template>
  <v-container>
    <v-row align="center" justify="space-between">
      <v-col cols="auto" md="auto">
        <h1>{{ $t('envelope') + title }}</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn>{{ $t('show-full-logs') }}</v-btn>
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
            <tr>
              <td>{{ $t('goal-amount') }}</td>
              <td>{{ targetAmount }}</td>
            </tr>
            <tr>
              <td>{{ $t('savings-amount') }}</td>
              <td>{{ savingsAmount }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn class="mb-2">{{ $t('deposit') }}</v-btn>
        <v-btn class="mb-2">{{ $t('withdraw') }}</v-btn>
        <v-btn>{{ $t('transfer') }}</v-btn>
      </v-col>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn class="mb-2">{{ $t('change-settings') }}</v-btn>
        <v-btn color="warning">{{ $t('delete-envelope') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <LastTransactions />
</template>
<script setup>
import { formatCurrency } from '@/utils'
import { useRoute } from 'vue-router'
import LastTransactions from './LastTransactions.vue'

const route = useRoute()
const title = route.query.title

const balance = formatCurrency(125.0)
const targetAmount = formatCurrency(10000.0)
const savingsAmount = formatCurrency(30.0)
</script>
