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
import { computed, onMounted, ref } from 'vue'
import global from '@/global.js'
import { formatCurrency, formatDate } from '@/utils.js'
import { getMoneybox } from '@/api.js'

// t used for table, otherwise $t globally available
import { useI18n } from 'vue-i18n'
const { t } = useI18n({})

const props = defineProps({
  id: Number
})

const transactionsLoaded = ref(false)

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

// transaction_type and description not needed for current design of the table
// TODO:
// Add proper date, when available from API,
// then sort by default by date and time, even if timestamp is hidden
const transactionItems = computed(() => {
  if (
    !transactionsLoaded.value ||
    !global.findMoneyboxById(props.id).transactionLogs
  ) {
    return generatePlaceholderData(numberOfEntries)
  }

  const transactionData = global.findMoneyboxById(props.id).transactionLogs
  const lastNEntries = transactionData.entries.slice(-numberOfEntries)

  let items = lastNEntries.map((entry) => {
    const infotext =
      entry.amount > 0 && entry.counterparty_moneybox_id === null
        ? t('deposit2')
        : entry.amount <= 0 && entry.counterparty_moneybox_id === null
          ? t('withdrawal')
          : t('transfer2')
    let origin = ''
    if (infotext === t('transfer2')) {
      const counterpartyMoneybox = global.findMoneyboxById(
        entry.counterparty_moneybox_id
      )
      // Check if counterparty moneybox exists and has a name, otherwise mark as 'UNKNOWN'
      // When moneybox has been deleted, there's currently no way to fetch the name
      origin =
        counterpartyMoneybox && counterpartyMoneybox.name
          ? counterpartyMoneybox.name
          : '[' + t('unknown') + ']'
    } else {
      origin =
        entry.transaction_trigger === 'manually' ? t('manual') : t('automatic')
    }

    return {
      date: formatDate(entry.transaction_time.split('T')[0]),
      infotext,
      origin,
      amount: formatCurrency(entry.amount),
      total: formatCurrency(entry.balance)
    }
  })

  // Pad with placeholders if there are fewer items than numberOfEntries
  if (items.length < numberOfEntries) {
    items = [
      ...items,
      ...generatePlaceholderData(numberOfEntries - items.length)
    ]
  }

  return items
})

async function updateTransactionItems() {
  const transactionData = global.findMoneyboxById(props.id).transactionLogs

  if (!transactionData) {
    transactionsLoaded.value = true
    return
  }

  const lastNEntries = transactionData.entries.slice(-numberOfEntries)

  for (const entry of lastNEntries) {
    if (
      entry.counterparty_moneybox_id &&
      !global.findMoneyboxById(entry.counterparty_moneybox_id)
    ) {
      try {
        global.addMoneybox(await getMoneybox(entry.counterparty_moneybox_id))
      } catch (error) {
        // A workaround to prevent 404 on deleted moneyboxes would be to
        // use getMoneyboxes() and filter the result, that seems even uglier
        console.error(
          `Failed to fetch moneybox with id ${entry.counterparty_moneybox_id}, probably deleted.`,
          error
        )
        // TODO: Handle error, e.g., show message to user or redirect - not when deleted is the cause. How do we know?
      }
    }
  }
  transactionsLoaded.value = true
}

onMounted(updateTransactionItems)
</script>
