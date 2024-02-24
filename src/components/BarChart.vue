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
import { computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

// t used for chartData, otherwise $t globally available
const { t } = useI18n({})

const theme = useTheme()

ChartJS.register(Tooltip, BarElement, CategoryScale, LinearScale)

// Dummy data, API fetch not implemented yet
const chartData = computed(() => ({
  labels: [
    t('january'),
    t('february'),
    t('march'),
    t('april'),
    t('may'),
    t('june')
  ],
  datasets: [
    {
      backgroundColor: theme.global.name.value === 'dark' ? 'white' : 'black',
      data: [3, 7, 4, 8]
    },
    {
      backgroundColor: ['red', 'green', 'green', 'red'],
      data: [4, 3, 5, 2]
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

watch(
  () => theme.global.name.value,
  () => {
    chartData.value.datasets[0].backgroundColor =
      theme.global.name.value === 'dark' ? 'white' : 'black'
  }
)
</script>
