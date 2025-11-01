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
              @selected-date-range="dateRangeSelected"
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
            />
          </v-col>
        </v-row>

        <v-data-table
          :headers="tableHeaders"
          :items="transactionItems"
          :search="search"
        >
          <template v-slot:[`item.type`]="{ item }">
            {{ item.type }}
          </template>

          <template v-slot:[`item.trigger`]="{ item }">
            {{ item.trigger }}
          </template>

          <template v-slot:[`item.rawAmount`]="{ item }">
            <span
              :class="item.amount !== '---'
                ? item.rawAmount >= 0
                  ? 'text-success'
                  : 'text-error'
                : ''"
            >
              {{ item.amount }}
            </span>
          </template>

          <!-- hide-default-footer workaround -->
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
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({})
const display = useDisplay()
const route = useRoute()

const search = ref('')
const dateFilterEnabled = ref(false)
const selectedDateRange = ref({ startDate: null, endDate: null })
const numberOfEntries = 4

const props = defineProps({
  id: { type: Number, default: undefined },
  showAll: { type: Boolean, default: false }
})

const id = computed(() => props.id || route.params.id)

const generatePlaceholderData = (count) =>
  count > 0
    ? Array.from({ length: count }, () => ({
      dateTime: '---',
      description: '---',
      trigger: '---',
      type: '---',
      amount: '---',
      total: '---'
    }))
    : []

const tableHeaders = computed(() => {
  const baseHeaders = [
    { title: t('date-time'), value: 'dateTime', key: 'rawDateTime', sortable: props.showAll },
    { title: t('type'), value: 'type', sortable: props.showAll },
    { title: t('trigger'), value: 'trigger', sortable: props.showAll },
    { title: t('description'), value: 'description', sortable: props.showAll }
  ]

  const extraHeaders = props.showAll
    ? [{ title: t('origin'), value: 'origin', key: 'origin', sortable: props.showAll, align: 'end' }]
    : []

  const amountHeaders = [
    { title: t('amount'), value: 'amount', key: 'rawAmount', sortable: props.showAll, align: 'end' },
    { title: t('total'), value: 'total', key: 'rawTotal', sortable: props.showAll, align: 'end' }
  ]

  return [...baseHeaders, ...extraHeaders, ...amountHeaders]
})

const transactionItems = computed(() => {
  const moneybox = global.findMoneyboxById(id.value)

  if (!moneybox || !moneybox.transactionLogs) {
    return props.showAll ? [] : generatePlaceholderData(numberOfEntries)
  }

  const entries = props.showAll
    ? moneybox.transactionLogs.entries
    : moneybox.transactionLogs.entries.slice(0, numberOfEntries)

  let items = entries.map((entry) => {
    const trigger = entry.transactionTrigger === 'manually' ? t('manual') : t('automatic')
    const type = entry.transactionType === 'direct' ? t('direct') : t('distribution')

    const origin = entry.counterpartyMoneyboxName
      ? `${entry.counterpartyMoneyboxName} (ID: ${entry.counterpartyMoneyboxId})`
      : ''

    return {
      dateTime: formatDateTime(entry.createdAt),
      description: entry.description,
      origin,
      trigger,
      type,
      amount: formatCurrency(entry.amount),
      total: formatCurrency(entry.balance),
      rawAmount: entry.amount,
      rawTotal: entry.balance,
      rawDateTime: entry.createdAt
    }
  })

  if (
    dateFilterEnabled.value &&
    selectedDateRange.value.startDate &&
    selectedDateRange.value.endDate
  ) {
    items = items.filter(
      (item) =>
        item.rawDateTime >= selectedDateRange.value.startDate &&
        item.rawDateTime <= selectedDateRange.value.endDate
    )
  }

  if (!props.showAll && items.length < numberOfEntries) {
    items = [...items, ...generatePlaceholderData(numberOfEntries - items.length)]
  }

  return items
})

function dateRangeSelected(range) {
  if (range.startDate && range.endDate) {
    selectedDateRange.value = { startDate: range.startDate, endDate: range.endDate }
  }
}
</script>
