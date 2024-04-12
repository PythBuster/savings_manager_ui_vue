<template>
  <Bar :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { computed, ref, watchEffect } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import global from '@/global.js'
import { formatCurrency } from '@/utils.js'

ChartJS.register(Tooltip, BarElement, CategoryScale, LinearScale)

// t used for chartData, otherwise $t globally available
const { t } = useI18n({})

const theme = useTheme()

const props = defineProps({
  id: Number
})

const getLast6MonthsKeys = () => {
  let keys = []
  for (let i = 5; i >= 0; i--) {
    let d = new Date()
    d.setMonth(d.getMonth() - i)
    keys.push(d.toLocaleDateString('default', { month: 'long' }).toLowerCase())
  }
  return keys
}

const chartLabels = computed(() =>
  getLast6MonthsKeys().map((month) => t(month))
)

const themeBasedColors = computed(() => ({
  errorColor:
    theme.global.name.value === 'dark'
      ? theme.themes.value.dark.colors.error
      : theme.themes.value.light.colors.error,
  successColor:
    theme.global.name.value === 'dark'
      ? theme.themes.value.dark.colors.success
      : theme.themes.value.light.colors.success
}))

const processTransactionLogs = (id) => {
  const moneybox = global.findMoneyboxById(id)
  if (!moneybox || !moneybox.transactionLogs) {
    return { balances: [], sums: [], colors: [] }
  }
  const last6MonthsKeys = getLast6MonthsKeys()

  let balances = new Array(6).fill(0)
  let sums = new Array(6).fill(0)
  let colors = new Array(6).fill(themeBasedColors.value.successColor)

  const transactionsByMonth = new Map()
  moneybox.transactionLogs.entries.forEach((entry) => {
    const entryDate = new Date(entry.created_at)
    const monthYearKey = entryDate
      .toLocaleDateString('default', { month: 'long' })
      .toLowerCase()

    if (!transactionsByMonth.has(monthYearKey)) {
      transactionsByMonth.set(monthYearKey, [])
    }
    transactionsByMonth.get(monthYearKey).push(entry)
  })

  last6MonthsKeys.forEach((key, index) => {
    const transactions = transactionsByMonth.get(key) || []

    let latestTransaction = null
    transactions.forEach((transaction) => {
      sums[index] += transaction.amount

      if (
        !latestTransaction ||
        new Date(transaction.created_at) >
          new Date(latestTransaction.created_at)
      ) {
        latestTransaction = transaction
      }
    })
    balances[index] = latestTransaction ? latestTransaction.balance : 0

    colors[index] =
      sums[index] < 0
        ? themeBasedColors.value.errorColor
        : themeBasedColors.value.successColor
    sums[index] = Math.abs(sums[index]) // Use the absolute value for sums (bar is red to indicate negative)
  })

  return { balances, sums, colors }
}

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: t('balance'), // not rendered atm, due to custom tooltip, but needed for proper animation
      backgroundColor: theme.global.name.value === 'dark' ? 'white' : 'black',
      data: []
    },
    {
      label: t('transactions'), // not rendered atm, due to custom tooltip, but needed for proper animation
      backgroundColor: [],
      data: []
    }
  ]
})

const updateChartData = (id) => {
  const { balances, sums, colors } = processTransactionLogs(id)

  // Replace with new Object for reactivity, simply updating the data won't trigger chart update
  chartData.value = {
    ...chartData.value,
    labels: chartLabels.value,
    datasets: [
      {
        label: t('balance'), // not rendered atm, due to custom tooltip, but needed for proper animation
        backgroundColor: theme.global.name.value === 'dark' ? 'white' : 'black',
        data: balances
      },
      {
        label: t('transactions'), // not rendered atm, due to custom tooltip, but needed for proper animation
        backgroundColor: colors,
        data: sums
      }
    ]
  }
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return formatCurrency(context.parsed.y)
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return formatCurrency(value)
        }
      }
    }
  }
}))

// This is first run on initial component mount and then tracks all changes deeper down the chain of updateChartData and triggers an update of the chart, if something changes
watchEffect(() => {
  updateChartData(props.id)
})
</script>
