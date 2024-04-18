<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('settings') }}</h1>
      </v-col>
    </v-row>
    <v-row :class="display.smAndUp ? 'mt-16' : ''">
      <v-col cols="12" sm="6" class="d-flex flex-column justify-center">
        <v-card>
          <v-list v-model="selectedMode">
            <v-list-item
              v-for="(mode, index) in modes"
              :key="index"
              :value="mode.value"
              @click="selectedMode = mode.value"
              :class="{ 'v-list-item--active': selectedMode === mode.value }"
            >
              <v-list-item-title>{{ mode.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4" offset-md="1">
        <SavingsSettingsOverview />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn @click="backClicked" class="mr-2">{{
          $t('back-to-overview')
        }}</v-btn>
        <v-btn @click="saveClicked">{{ $t('save') }}</v-btn>
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

import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'

const display = ref(useDisplay())

const { t } = useI18n({})

const showErrorDialog = ref(false)
const errorMessage = ref('')

const selectedMode = ref(global.settings.value.savings_mode)

const modes = ref([])

const modeKeys = ['add-up', 'fill-envelopes', 'collect']

// Use watchEffect to automatically update when locale changes
// need non-localized keys for API
watchEffect(() => {
  modes.value = modeKeys.map((key) => ({ value: key, label: t(key) }))
})

async function saveClicked() {
  if (selectedMode.value === global.settings.value.savings_mode) {
    errorMessage.value = t('error-no-changes')
    showErrorDialog.value = true
  } else {
    await updateSettings({
      savings_mode: selectedMode.value
    })
    router.push({
      path: '/overflow'
    })
  }
}

function backClicked() {
  router.push({
    path: '/overflow'
  })
}
</script>
