<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-item>
          <v-card-title>{{ $t('last-transactions') }}</v-card-title>
        </v-card-item>
        <v-row v-if="showAll" class="align-center" no-gutters>
          <v-col cols="auto">
            <DateRangePicker
              @selected-date-range="dateRangeSelected($event)"
              v-model="dateFilterEnabled"
            />
          </v-col>
          <v-col :cols="dateFilterEnabled && display.smAndDown ? 12 : ''">
            <v-text-field
              v-model="search"
              :label="$t('search')"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-data-table
          :headers="tableHeaders"
          :items="transactionItems"
          :search="search"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon
              v-if="
                !showAll &&
                item.trigger === $t('manual') &&
                item.action !== '---'
              "
              >mdi-pencil</v-icon
            >
            <v-icon
              v-else-if="
                !showAll &&
                item.trigger !== $t('manual') &&
                item.action !== '---'
              "
              >mdi-cogs</v-icon
            >
            <v-icon
              v-if="
                !showAll && item.type === $t('direct') && item.action !== '---'
              "
              >mdi-transfer-right</v-icon
            >
            <v-icon
              v-else-if="
                !showAll && item.type !== $t('direct') && item.action !== '---'
              "
              >mdi-multicast</v-icon
            >

            {{ item.action }}
          </template>
          <!-- hide-default-footer and disable-pagination not implemented yet in Vuetify 3 - https://github.com/vuetifyjs/vuetify/issues/17651 -->
          <template v-slot:bottom v-if="!showAll"></template>
          <template v-slot:no-data></template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import global from '@/global.js'
import { formatCurrency, formatDateTime } from '@/utils.js'

// t used for table, otherwise $t globally available
import { useI18n } from 'vue-i18n'
const { t } = useI18n({})

const display = ref(useDisplay())

const search = ref('')

const props = defineProps({
  id: { type: Number, default: undefined },
  showAll: { type: Boolean, default: false } // Show all transactions, instead of just numberOfEntries
})

const dateFilterEnabled = ref(false)

const selectedDateRange = ref({ startDate: null, endDate: null })

// How many transaction log entries to show
const numberOfEntries = 4

const generatePlaceholderData = (count) =>
  Array.from({ length: count }, () => ({
    dateTime: '---',
    action: '---',
    description: '---',
    origin: '---',
    trigger: '---',
    type: '---',
    amount: '---',
    total: '---'
  }))

const tableHeaders = computed(() => {
  let headers = [
    {
      title: t('date-time'),
      value: 'dateTime',
      sortable: props.showAll,
      customSort: (a, b) => new Date(a.rawDateTime) - new Date(b.rawDateTime) // Custom sort based on rawDateTime
    },
    {
      title: t('action'),
      value: 'action',
      sortable: props.showAll
    },
    { title: t('description'), value: 'description', sortable: props.showAll },
    { title: t('origin'), value: 'origin', sortable: props.showAll }
  ]

  if (props.showAll) {
    headers = headers.concat([
      { title: t('trigger'), value: 'trigger', sortable: props.showAll },
      { title: t('type'), value: 'type', sortable: props.showAll }
    ])
  }

  headers = headers.concat([
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

  return headers
})

const transactionItems = computed(() => {
  if (!props.id || !global.findMoneyboxById(props.id).transactionLogs) {
    return props.showAll ? [] : generatePlaceholderData(numberOfEntries)
  }

  const transactionData = global.findMoneyboxById(props.id).transactionLogs
  const entries = props.showAll
    ? transactionData.entries
    : transactionData.entries.slice(-numberOfEntries)

  let items = entries.map((entry) => {
    const action =
      entry.amount > 0 && entry.counterparty_moneybox_id === null
        ? t('deposit2')
        : entry.amount <= 0 && entry.counterparty_moneybox_id === null
          ? t('withdrawal')
          : t('transfer2')

    let origin = ''
    if (action === t('transfer2')) {
      origin = entry.counterparty_moneybox_name
    }

    const trigger =
      entry.transaction_trigger === 'manually' ? t('manual') : t('automatic')

    const type =
      entry.transaction_type === 'direct' ? t('direct') : t('distribution')

    return {
      dateTime: formatDateTime(entry.created_at),
      action: action,
      description: entry.description,
      origin: origin,
      trigger: trigger,
      type: type,
      amount: formatCurrency(entry.amount),
      total: formatCurrency(entry.balance),
      rawAmount: entry.amount,
      rawTotal: entry.balance,
      rawDateTime: entry.created_at
    }
  })

  if (
    dateFilterEnabled.value &&
    selectedDateRange.value &&
    selectedDateRange.value.startDate &&
    selectedDateRange.value.endDate
  ) {
    items = items.filter((item) => {
      return (
        item.rawDateTime >= selectedDateRange.value.startDate &&
        item.rawDateTime <= selectedDateRange.value.endDate
      )
    })
  }

  // Only add placeholders if not showing all entries and there are fewer items than numberOfEntries
  if (!props.showAll && items.length < numberOfEntries) {
    items = [
      ...items,
      ...generatePlaceholderData(numberOfEntries - items.length)
    ]
  }

  return items
})

function dateRangeSelected(range) {
  if (range.startDate && range.endDate) {
    selectedDateRange.value.startDate = range.startDate
    selectedDateRange.value.endDate = range.endDate
  }
}
</script>
