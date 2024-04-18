<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'">
          {{ $t('savings-settings') }}
        </h1>
      </v-col>
    </v-row>
    <v-row :class="display.mdAndUp ? 'mt-16' : ''">
      <v-col cols="12" sm="6">
        <v-row>
          <v-col>
            <CurrencyInput :label="$t('savings-amount')" v-model="saveAmount" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-list v-model="selectedMode">
                <v-list-item
                  v-for="(mode, index) in modes"
                  :key="index"
                  :value="mode.value"
                  @click="selectedMode = mode.value"
                  :class="{
                    'v-list-item--active': selectedMode === mode.value
                  }"
                >
                  <v-list-item-title>{{ mode.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        offset-md="1"
        class="d-flex flex-column justify-center"
      >
        <SavingsSettingsOverview />
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
    <ErrorDialog
      v-model="showErrorDialog"
      :error-message="errorMessage"
    ></ErrorDialog>
  </v-container>
</template>

<script setup>
import router from '@/router/index.js'
import { ref, watchEffect } from 'vue'
import global from '@/global.js'
import { updateSettings } from '@/api.js'
import { useDisplay } from 'vuetify'

const display = ref(useDisplay())

import { useI18n } from 'vue-i18n'

const { t } = useI18n({})

const showErrorDialog = ref(false)
const errorMessage = ref('')

const selectedMode = ref(global.settings.value.savings_cycle)

const modes = ref([])

const saveAmount = ref(global.settings.value.savings_amount)

const modeKeys = ['daily', 'weekly', 'monthly', 'yearly']

// Use watchEffect to automatically update when locale changes
// need non-localized keys for API
watchEffect(() => {
  modes.value = modeKeys.map((key) => ({ value: key, label: t(key) }))
})

async function saveClicked() {
  const updates = {}

  if (saveAmount.value !== global.settings.value.savings_amount) {
    updates.savings_amount = saveAmount.value
  }
  if (selectedMode.value !== global.settings.value.savings_cycle) {
    updates.savings_cycle = selectedMode.value
  }

  if (Object.keys(updates).length === 0) {
    errorMessage.value = t('error-no-changes')
    showErrorDialog.value = true
  } else {
    await updateSettings(updates)
    router.push({
      path: '/'
    })
  }
}
</script>
