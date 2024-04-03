<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-item>
          <v-card-title>{{ $t('last-transactions') }}</v-card-title>
        </v-card-item>
        <v-table v-if="transactionItems.length > 0">
      <thead>
            <tr>
              <th class="text-no-wrap">{{ $t('date') }}</th>
              <th class="text-no-wrap">{{ $t('info-text') }}</th>
              <th class="text-no-wrap">{{ $t('origin') }}</th>
              <th class="text-no-wrap" style="text-align: center;">{{ $t('amount') }}</th>
              <th class="text-no-wrap" style="text-align: center;">{{ $t('total') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transactionItems.sort(
              (a, b) => a.created_at < b.created_at
            )" :key="item.name">
              <td>{{ item.created_at.toLocaleDateString($i18n.locale,
                { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric'}
               ) }}</td>
              <td>{{ item.description }}</td>
              <td>{{ item.counterparty_moneybox_name }}</td>
              <td :style="{ color: item.amount >= 0 ? 'green' : 'red', 'text-align': 'center' }">{{ formatCurrency(item.amount, $i18n.locale) }}</td>
              <td style="text-align: center;">{{ formatCurrency(item.balance, $i18n.locale) }}</td>
            </tr>
          </tbody>




        </v-table>

        <p v-else style="text-align: center;">{{ $t('no-transactions') }}</p>
        <p v-if="errorMessage" style="color: red;">Fehler: {{ errorMessage }}</p>

      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
import { formatCurrency } from '@/utils.js'
import axios from 'axios'

const props = defineProps({
  currentMoneyboxID: Number
})


import { ref, onMounted } from 'vue';

// Daten für die Transaktionsprotokolle
const transactionItems = ref([]);

// Methode zum Abrufen der Daten
const fetchTransactionLogs = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/moneybox/${props.currentMoneyboxID}/transactions`);
    const logs = response.data.transaction_logs.map(log => {
                return {
                  ...log,
                  created_at: new Date(log.created_at)
                };
              });

    transactionItems.value = logs.slice(0, 4);
  } catch (error) {
    console.error(error);
  }
};

// Beim Laden der Komponente Transaktionsprotokolle abrufen
onMounted(fetchTransactionLogs);
</script>
