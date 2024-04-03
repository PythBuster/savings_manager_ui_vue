<template>
  <v-container>
    <v-row class="flex-nowrap">
      <v-col
        ><v-menu :close-on-content-click="false" v-model="menuForDateRanges">
          <template v-slot:activator="{ props }">
            <v-btn
              prepend-icon="mdi-calendar-month"
              v-bind="props"
              width="210px"
              @click="toggleDatePicker"
              :append-icon="anyDate ? 'mdi-chevron-down' : 'mdi-chevron-up'"
              class="justify-space-between"
              >{{ anyDateText }}</v-btn
            >
          </template>
          <v-list width="200px" elevation="8">
            <v-list-item
              v-for="(range, index) in ranges"
              :key="index"
              :value="index"
              @click="rangeSelected(range.name)"
            >
              <v-list-item-title>{{ range.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col v-if="anyDate">
        <v-menu :close-on-content-click="false" v-model="menu1">
          <template v-slot:activator="{ props }">
            <v-btn
              width="140px"
              prepend-icon="mdi-calendar-start"
              v-bind="props"
              >{{ formattedDateStart }}</v-btn
            >
          </template>
          <v-date-picker
            v-model="dateStart"
            hide-header
            hide-weekdays
            @update:modelValue="onDateSelected('start', $event)"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col v-if="anyDate">
        <v-menu :close-on-content-click="false" v-model="menu2">
          <template v-slot:activator="{ props }">
            <v-btn
              width="140px"
              prepend-icon="mdi-calendar-end"
              v-bind="props"
              >{{ formattedDateEnd }}</v-btn
            >
          </template>
          <v-date-picker
            v-model="dateEnd"
            hide-header
            hide-weekdays
            :min="dateStart"
            @update:modelValue="onDateSelected('end', $event)"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { formatDate } from '@/utils.js'

// t used for range, otherwise $t globally available
import { useI18n } from 'vue-i18n'
const { t } = useI18n({})

const emit = defineEmits(['selected-date-range', 'update:anyDate'])

const menuForDateRanges = ref(false)

// Helper function to adjust endDate to include the entire day
const adjustEndDate = (date) => {
  const adjustedDate = new Date(date)
  adjustedDate.setHours(23, 59, 59, 999)
  return adjustedDate
}

const today = new Date()
const lastTwelveMonthsStart = new Date(
  new Date().setMonth(today.getMonth() - 12)
)
lastTwelveMonthsStart.setDate(1)
lastTwelveMonthsStart.setHours(0, 0, 0, 0)

const dateStart = ref(lastTwelveMonthsStart)
const dateEnd = ref(adjustEndDate(new Date()))

const ranges = ref([])

const menu1 = ref(false)
const menu2 = ref(false)

const anyDate = ref(false)
const showRangesList = ref(true)

const toggleDatePicker = () => {
  anyDate.value = !anyDate.value
  menuForDateRanges.value = anyDate.value
  if (!anyDate.value) {
    menu1.value = false
    menu2.value = false
  }
}

const onDateSelected = async (picker, value) => {
  if (picker === 'start') {
    dateStart.value = new Date(value)
    menu1.value = false
  } else if (picker === 'end') {
    dateEnd.value = adjustEndDate(new Date(value))
    menu2.value = false
  }
  showRangesList.value = false

  emit('selected-date-range', {
    startDate: dateStart.value.toISOString(),
    endDate: dateEnd.value.toISOString()
  })
}

const anyDateText = computed(() =>
  anyDate.value ? t('date-range') : t('any-date')
)

function rangeSelected(range) {
  const today = new Date()
  const yesterday = new Date(today).setDate(today.getDate() - 1)
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
  const lastMonthStart = new Date(
    lastMonthEnd.getFullYear(),
    lastMonthEnd.getMonth(),
    1
  )
  const lastThreeMonthsStart = new Date(
    today.getFullYear(),
    today.getMonth() - 3,
    1
  )

  switch (range) {
    case t('today'):
      dateStart.value = today
      today.setHours(0, 0, 0, 0)
      dateEnd.value = adjustEndDate(today)
      break
    case t('yesterday'):
      dateStart.value = new Date(yesterday)
      dateStart.value.setHours(0, 0, 0, 0)
      dateEnd.value = adjustEndDate(new Date(yesterday))
      break
    case t('this-month'):
      dateStart.value = thisMonthStart
      dateEnd.value = adjustEndDate(today)
      break
    case t('last-month'):
      dateStart.value = lastMonthStart
      dateEnd.value = adjustEndDate(lastMonthEnd)
      break
    case t('last-three-months'):
      dateStart.value = lastThreeMonthsStart
      dateEnd.value = adjustEndDate(lastMonthEnd)
  }

  menuForDateRanges.value = false
  showRangesList.value = false

  emit('selected-date-range', {
    startDate: dateStart.value.toISOString(),
    endDate: dateEnd.value.toISOString()
  })
}

const formattedDateStart = computed(() => {
  return formatDate(dateStart.value)
})

const formattedDateEnd = computed(() => {
  return formatDate(dateEnd.value)
})

watch(dateStart, (newValue) => {
  if (newValue > dateEnd.value) {
    dateEnd.value = newValue
  }
})

watch(anyDate, (newValue) => {
  emit('update:anyDate', newValue)
  if (!newValue) {
    showRangesList.value = true
  }
})

// Use watchEffect to automatically update when locale changes
watchEffect(() => {
  ranges.value = [
    { name: t('today') },
    { name: t('yesterday') },
    { name: t('this-month') },
    { name: t('last-month') },
    { name: t('last-three-months') }
  ]
})

onMounted(() => {
  emit('selected-date-range', {
    startDate: dateStart.value.toISOString(),
    endDate: dateEnd.value.toISOString()
  })
})
</script>
