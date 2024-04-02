<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-item>
          <v-card-title>{{ $t('last-transactions') }}</v-card-title>
        </v-card-item>
        <v-text-field
          v-if="showAll"
          v-model="search"
          :label="$t('search')"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          hide-details
        ></v-text-field>
        <v-data-table
          :headers="tableHeaders"
          :items="transactionItems"
          :search="search"
        >
          <!-- hide-default-footer and disable-pagination not implemented yet in Vuetify 3 - https://github.com/vuetifyjs/vuetify/issues/17651 -->
          <template v-slot:bottom v-if="!showAll"></template
          ><template v-slot:no-data></template
        ></v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
import { computed, ref } from 'vue'
import global from '@/global.js'
import { formatCurrency, formatDate } from '@/utils.js'

// t used for table, otherwise $t globally available
import { useI18n } from 'vue-i18n'
const { t } = useI18n({})

const search = ref('')

const props = defineProps({
  id: { type: Number, default: undefined },
  showAll: { type: Boolean, default: false } // Show all transactions, instead of just numberOfEntries
})

// How many transaction log entries to show
const numberOfEntries = 4

const generatePlaceholderData = (count) =>
  Array.from({ length: count }, () => ({
    date: '---',
    infotext: '---',
    origin: '---',
    amount: '---',
    total: '---'
  }))

const tableHeaders = computed(() => [
  { title: t('date'), value: 'date', sortable: props.showAll },
  { title: t('info-text'), value: 'infotext', sortable: props.showAll },
  { title: t('origin'), value: 'origin', sortable: props.showAll },
  {
    title: t('amount'),
    value: 'amount',
    key: 'rawAmount',
    sortable: props.showAll,
    customSort: (a, b) => a.rawAmount - b.rawAmount // Custom sort based on rawAmount
  },
  {
    title: t('total'),
    value: 'total',
    key: 'rawTotal',
    sortable: props.showAll,
    customSort: (a, b) => a.rawTotal - b.rawTotal // Custom sort based on rawTotal
  }
])

// transaction_type and description not needed for current design of the table
// TODO:
// Add time to date and sort accordingly
const transactionItems = computed(() => {
  if (!props.id || !global.findMoneyboxById(props.id).transactionLogs) {
    return props.showAll ? [] : generatePlaceholderData(numberOfEntries)
  }

  const transactionData = global.findMoneyboxById(props.id).transactionLogs
  const entries = props.showAll
    ? transactionData.entries
    : transactionData.entries.slice(-numberOfEntries)

  let items = entries.map((entry) => {
    const infotext =
      entry.amount > 0 && entry.counterparty_moneybox_id === null
        ? t('deposit2')
        : entry.amount <= 0 && entry.counterparty_moneybox_id === null
          ? t('withdrawal')
          : t('transfer2')
    let origin = ''
    if (infotext === t('transfer2')) {
      origin = entry.counterparty_moneybox_name
    } else {
      origin =
        entry.transaction_trigger === 'manually' ? t('manual') : t('automatic')
    }

    return {
      date: formatDate(entry.created_at.split('T')[0]),
      infotext,
      origin,
      amount: formatCurrency(entry.amount),
      total: formatCurrency(entry.balance),
      rawAmount: entry.amount,
      rawTotal: entry.balance
    }
  })

  // Only add placeholders if not showing all entries and there are fewer items than numberOfEntries
  if (!props.showAll && items.length < numberOfEntries) {
    items = [
      ...items,
      ...generatePlaceholderData(numberOfEntries - items.length)
    ]
  }

  return items
})
</script>
