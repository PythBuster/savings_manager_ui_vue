<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-item>
          <v-card-title>{{ $t('last-transactions') }}</v-card-title>
        </v-card-item>
        <v-table>
          <thead>
            <tr>
              <th class="text-no-wrap">{{ $t('date') }}</th>
              <th class="text-no-wrap">{{ $t('info-text') }}</th>
              <th class="text-no-wrap">{{ $t('origin') }}</th>
              <th class="text-no-wrap">{{ $t('amount') }}</th>
              <th class="text-no-wrap">{{ $t('total') }}</th>
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
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
import { formatCurrency, formatDate } from '@/utils'

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
</script>
