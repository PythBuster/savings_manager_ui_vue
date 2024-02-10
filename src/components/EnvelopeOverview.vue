<template>
  <v-container>
    <v-row align="center" justify="space-between">
      <v-col>
        <h1>{{ $t('envelope') + title }}</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn>{{ $t('show-full-logs') }}</v-btn>
      </v-col>
    </v-row>

    <v-row justify="space-between">
      <v-col cols="4">
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

    <v-row>
      <v-col>
        <v-card>
          <div>
            <v-card-item>
              <v-card-title>{{ $t('last-transactions') }}</v-card-title>
            </v-card-item>
            <v-table>
              <thead>
                <tr>
                  <th>{{ $t('date') }}</th>
                  <th>{{ $t('info-text') }}</th>
                  <th>{{ $t('origin') }}</th>
                  <th>{{ $t('amount') }}</th>
                  <th>{{ $t('total') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in transactionItems" :key="item.name">
                  <td>{{ item.date }}</td>
                  <td>{{ item.infotext }}</td>
                  <td>{{ item.origin }}</td>
                  <td>{{ item.amount }}</td>
                  <td>{{ item.total }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { formatCurrency, formatDate } from '@/utils'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = route.query.title

// Dummy data, API fetch not implemented yet
const transactionItems = [
  {
    date: formatDate('2024-01-18'),
    infotext: 'Übertrag',
    origin: 'Urlaub',
    amount: formatCurrency(-10.0),
    total: formatCurrency(90.0)
  },
  {
    date: formatDate('2024-01-20'),
    infotext: 'Übertrag',
    origin: 'Haushalt',
    amount: formatCurrency(20.0),
    total: formatCurrency(110.0)
  },
  {
    date: formatDate('2024-01-28'),
    infotext: 'Abbuchung',
    origin: 'manuell',
    amount: formatCurrency(-50.0),
    total: formatCurrency(60.0)
  },
  {
    date: formatDate('2024-02-01'),
    infotext: 'Einzahlung',
    origin: 'automatisch',
    amount: formatCurrency(30.0),
    total: formatCurrency(90.0)
  }
]

const balance = formatCurrency(125.0)
const targetAmount = formatCurrency(10000.0)
const savingsAmount = formatCurrency(30.0)
</script>
