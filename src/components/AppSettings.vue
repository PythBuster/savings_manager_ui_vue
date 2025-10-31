<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'">
          {{ $t('settings') }}
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
            <v-checkbox
              :label="$t('enable-automated-savings')"
              v-model="saveAutoSaveEnable"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-checkbox
              :label="$t('enable-receiving-html-emails')"
              v-model="saveReceivingHtmlEmails"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              label="Email address"
              :placeholder="$t('email-placeholder')"
              v-model="saveUsersEmailAddress"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select
              :label="$t('overflow-moneybox-automated-savings-mode')"
              :items="modes"
              v-model="selectedOption"
            />
          </v-col>
        </v-row>

      </v-col>

      <v-col
        v-if="!display.mdAndUp"
        cols="12"
        sm="6"
        md="4"
        offset-md="1"
        class="d-flex flex-column"
      >
        <SavingsSettingsOverview />
        <v-spacer />
        <v-btn class="align-self-end mt-2" @click="saveClicked">
          {{ $t('save') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="display.mdAndUp">
      <v-col class="d-flex justify-end">
        <v-btn @click="saveClicked">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>

    <ErrorDialog v-model="showErrorDialog" :error-message="errorMessage" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import global from '@/global.js'
import { updateSettings } from '@/api.js'
import { useDisplay } from 'vuetify'
import { euroStringToCents, centsToEuroFloat } from '@/utils.js'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const display = useDisplay()
const { t } = useI18n({})

const showErrorDialog = ref(false)
const errorMessage = ref('')

// --- Global settings values ---
const settings = global.settings.value
const saveAmount = ref(centsToEuroFloat(settings.savingsAmount))
const saveAutoSaveEnable = ref(settings.isAutomatedSavingActive)
const saveReceivingHtmlEmails = ref(settings.sendReportsViaEmail)
const saveUsersEmailAddress = ref(settings.userEmailAddress || '')

// --- Savings mode mapping ---
const modeMap = {
  collect: 'collect',
  add_to_automated_savings_amount: 'add',
  fill_up_limited_moneyboxes: 'fill',
  ratio: 'ratio',
  equal: 'equal'
}
const reverseModeMap = Object.fromEntries(Object.entries(modeMap).map(([k, v]) => [v, k]))
const modes = Object.values(modeMap)

const selectedOption = ref(
  modeMap[settings.overflowMoneyboxAutomatedSavingsMode] || 'collect'
)

async function saveClicked() {
  const updates = {}

  if (saveAmount.value !== centsToEuroFloat(settings.savingsAmount)) {
    updates.savingsAmount = euroStringToCents(saveAmount.value)
  }

  if (saveAutoSaveEnable.value !== settings.isAutomatedSavingActive) {
    updates.isAutomatedSavingActive = saveAutoSaveEnable.value
  }

  if (saveReceivingHtmlEmails.value !== settings.sendReportsViaEmail) {
    updates.sendReportsViaEmail = saveReceivingHtmlEmails.value
  }

  if (selectedOption.value !== modeMap[settings.overflowMoneyboxAutomatedSavingsMode]) {
    updates.overflowMoneyboxAutomatedSavingsMode =
      reverseModeMap[selectedOption.value]
  }

  if (saveUsersEmailAddress.value !== settings.userEmailAddress) {
    updates.userEmailAddress = saveUsersEmailAddress.value.trim() || null
  }

  if (Object.keys(updates).length === 0) {
    await router.replace('/')
    return
  }

  try {
    await updateSettings(updates)
    await router.replace('/')
  } catch (error) {
    errorMessage.value = "Error while updating."
    showErrorDialog.value = true
  }
}
</script>
