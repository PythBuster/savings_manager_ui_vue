<template>
  <v-container>
    <v-row class="flex-nowrap">
      <v-col>
        <v-menu v-model="menuForDateRanges" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              prepend-icon="mdi-calendar-month"
              v-bind="props"
              width="210px"
              @click="toggleDatePicker"
              :append-icon="anyDate ? 'mdi-chevron-down' : 'mdi-chevron-up'"
              class="justify-space-between"
            >
              {{ anyDateText }}
            </v-btn>
          </template>

          <v-list width="200px" elevation="8">
            <v-list-item
              v-for="(range, index) in ranges"
              :key="index"
              @click="rangeSelected(range.name)"
            >
              <v-list-item-title>{{ range.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>

      <v-col v-if="anyDate">
        <v-menu v-model="menu1" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              width="140px"
              prepend-icon="mdi-calendar-start"
              v-bind="props"
            >
              {{ formattedDateStart }}
            </v-btn>
          </template>
          <v-date-picker
            v-model="dateStart"
            hide-header
            hide-weekdays
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col v-if="anyDate">
        <v-menu v-model="menu2" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              width="140px"
              prepend-icon="mdi-calendar-end"
              v-bind="props"
            >
              {{ formattedDateEnd }}
            </v-btn>
          </template>
          <v-date-picker
            v-model="dateEnd"
            hide-header
            hide-weekdays
            :min="dateStart"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { formatDate } from '@/utils.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({})
const anyDate = defineModel()
const emit = defineEmits(['selected-date-range'])

const menuForDateRanges = ref(false)
const menu1 = ref(false)
const menu2 = ref(false)

const adjustEndDate = (date) => {
  const adjusted = new Date(date)
  adjusted.setHours(23, 59, 59, 999)
  return adjusted
}

const today = new Date()
const defaultStart = new Date(today)
defaultStart.setMonth(today.getMonth() - 12)
defaultStart.setDate(1)
defaultStart.setHours(0, 0, 0, 0)

const dateStart = ref(defaultStart)
const dateEnd = ref(adjustEndDate(today))

const anyDateText = computed(() =>
  anyDate.value ? t('date-range') : t('any-date')
)

const ranges = computed(() => [
  { name: t('today') },
  { name: t('yesterday') },
  { name: t('this-month') },
  { name: t('last-month') },
  { name: t('last-three-months') }
])

function toggleDatePicker() {
  anyDate.value = !anyDate.value
  menuForDateRanges.value = anyDate.value
  if (!anyDate.value) {
    menu1.value = false
    menu2.value = false
  }
}

function rangeSelected(range) {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  const lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 1)
  const lastThreeMonthsStart = new Date(now.getFullYear(), now.getMonth() - 3, 1)

  switch (range) {
    case t('today'):
      dateStart.value = new Date(now.setHours(0, 0, 0, 0))
      dateEnd.value = adjustEndDate(new Date())
      break
    case t('yesterday'):
      dateStart.value = new Date(yesterday.setHours(0, 0, 0, 0))
      dateEnd.value = adjustEndDate(yesterday)
      break
    case t('this-month'):
      dateStart.value = thisMonthStart
      dateEnd.value = adjustEndDate(now)
      break
    case t('last-month'):
      dateStart.value = lastMonthStart
      dateEnd.value = adjustEndDate(lastMonthEnd)
      break
    case t('last-three-months'):
      dateStart.value = lastThreeMonthsStart
      dateEnd.value = adjustEndDate(lastMonthEnd)
      break
  }

  menuForDateRanges.value = false
  emitDateRangeSelected()
}

const formattedDateStart = computed(() => formatDate(dateStart.value))
const formattedDateEnd = computed(() => formatDate(dateEnd.value))

watch(dateStart, (newVal, oldVal) => {
  if (newVal.getTime() === oldVal.getTime()) return
  if (newVal > dateEnd.value) dateEnd.value = adjustEndDate(newVal)
  menu1.value = false
  emitDateRangeSelected()
})

watch(dateEnd, (newVal, oldVal) => {
  if (newVal.getTime() === oldVal.getTime()) return
  dateEnd.value = adjustEndDate(newVal)
  menu2.value = false
  emitDateRangeSelected()
})

function emitDateRangeSelected() {
  emit('selected-date-range', {
    startDate: dateStart.value.toISOString(),
    endDate: dateEnd.value.toISOString()
  })
}

watch(anyDate, (newVal) => {
  menuForDateRanges.value = newVal
})

function handleResize() {
  menu1.value = false
  menu2.value = false
  menuForDateRanges.value = false
}

onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
</script>
