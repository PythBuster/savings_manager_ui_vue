<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('savings-settings') }}</h1>
      </v-col>
    </v-row>
    <v-row class="mt-16">
      <v-col cols="12" sm="6">
        <CurrencyInput :label="$t('savings-amount')" v-model="saveAmount" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-list v-model="selectedMode">
            <v-list-item
              v-for="(mode, index) in modes"
              :key="index"
              :value="mode"
              @click="selectedMode = mode"
              :class="{ 'v-list-item--active': selectedMode === mode }"
            >
              <v-list-item-title>{{ mode }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          @click="saveClicked"
          :disabled="saveAmount === null || isNaN(saveAmount)"
          >{{ $t('save') }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import router from '@/router/index.js'
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({})

const selectedMode = ref(t('monthly'))

const modes = ref([])

// Dummy data
const saveAmount = ref(100)

// Use watchEffect to automatically update when locale changes
watchEffect(() => {
  modes.value = [t('daily'), t('weekly'), t('monthly'), t('yearly')]
})

function saveClicked() {
  router.push({
    path: '/'
  })
}
</script>
