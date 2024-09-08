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
          <template v-slot:[`item.type`]="{ item }">
            {{ item.type }}
          </template>

          <template v-slot:[`item.trigger`]="{ item }">
            {{ item.trigger }}
          </template>

          <template v-slot:[`item.rawAmount`]="{ item }">
            <span
              :class="
                item.amount !== '---'
                  ? item.rawAmount >= 0
                    ? 'text-success'
                    : 'text-error'
                  : ''
              "
            >
              {{ item.amount }}
            </span>
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
import { useRoute } from 'vue-router';

// t used for table, otherwise $t globally available
import { useI18n } from 'vue-i18n'
const { t } = useI18n({})

const display = ref(useDisplay())
const route = useRoute();

const search = ref('')

const props = defineProps({
  id: { type: Number, default: undefined },
  showAll: { type: Boolean, default: false } // Show all transactions, instead of just numberOfEntries
})
const id = computed(() => props.id || route.params.id); // Nutzt die ID aus den Props oder der Route

const dateFilterEnabled = ref(false)

const selectedDateRange = ref({ startDate: null, endDate: null })

// How many transaction log entries to show
const numberOfEntries = 4

const generatePlaceholderData = (count) =>
  Array.from({ length: count }, () => ({
    dateTime: '---',
    description: '---',
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
      key: 'rawDateTime',
      sortable: props.showAll
    },
    { title: t('type'), value: 'type', sortable: props.showAll },

    { title: t('trigger'), value: 'trigger', sortable: props.showAll },

    { title: t('description'), value: 'description', sortable: props.showAll },
  ]

  headers = headers.concat([
    {
      title: t('amount'),
      value: 'amount',
      key: 'rawAmount',
      sortable: props.showAll,
      align: 'end'
    },
    {
      title: t('total'),
      value: 'total',
      key: 'rawTotal',
      sortable: props.showAll,
      align: 'end'
    }
  ])

  return headers
})

const transactionItems = computed(() => {

  if (!id.value || !global.findMoneyboxById(id.value) || !("transactionLogs" in global.findMoneyboxById(id.value)) || global.findMoneyboxById(id.value).transactionLogs === null) {
    return props.showAll ? [] : generatePlaceholderData(numberOfEntries)
  }

  const transactionData = global.findMoneyboxById(id.value).transactionLogs

  const entries = props.showAll
    ? transactionData.entries
    : transactionData.entries.slice(0, numberOfEntries)

  let items = entries.map((entry) => {
    const trigger =
      entry.transactionTrigger === 'manually' ? t('manual') : t('automatic')

    const type =
      entry.transactionType === 'direct' ? t('direct') : t('distribution')

    return {
      dateTime: formatDateTime(entry.createdAt),
      description: entry.description,
      trigger: trigger,
      type: type,
      amount: formatCurrency(entry.amount),
      total: formatCurrency(entry.balance),
      rawAmount: entry.amount,
      rawTotal: entry.balance,
      rawDateTime: entry.createdAt
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
