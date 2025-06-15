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
            <v-checkbox :label="$t('enable-automated-savings')" v-model="saveAutoSaveEnable" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-checkbox 
            :label="$t('enable-receiving-html-emails')" v-model="saveReceivingHtmlEmails"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
          <v-text-field
            label="Email address"
            :placeholder="$t('email-placeholder')"
            v-model="saveUsersEmailAddress"
          ></v-text-field>
        </v-col>
       </v-row>

        <v-row>
          <v-col>
          <v-select
            :label="$t('overflow-moneybox-automated-savings-mode')"
            :items="['collect', 'add', 'fill', 'ratio', 'equal']"
            v-model="selectedOption"
          ></v-select>
          </v-col>
        </v-row>



      </v-col>
      <v-col
        v-if="display.mdAndUp"
        cols="12"
        sm="6"
        md="4"
        offset-md="1"
        class="d-flex flex-column justify-center"
      >
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
        <v-spacer></v-spacer>
        <v-btn
          class="align-self-end mt-2"
          @click="saveClicked"
          >{{ $t('save') }}</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="display.mdAndUp">
      <v-col class="d-flex justify-end">
        <v-btn
          @click="saveClicked"
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
import { ref } from 'vue'
import global from '@/global.js'
import { updateSettings } from '@/api.js'
import { useDisplay } from 'vuetify'
import { centsToEuroString, euroStringToCents, centsToEuroFloat } from '@/utils.js'

const display = ref(useDisplay())

import { useI18n } from 'vue-i18n'

const { t } = useI18n({})

const showErrorDialog = ref(false)
const errorMessage = ref('')

const origSavingsAmount = centsToEuroFloat(global.settings.value.savingsAmount)
const saveAmount = ref(origSavingsAmount)
const isAutomatedSavingActive = global.settings.value.isAutomatedSavingActive
const saveAutoSaveEnable = ref(isAutomatedSavingActive)
const sendReportsViaEmail = global.settings.value.sendReportsViaEmail
const saveReceivingHtmlEmails = ref(sendReportsViaEmail)
const overflowMoneyboxAutomatedSavingsMode = global.settings.value.overflowMoneyboxAutomatedSavingsMode
const usersEmailAddress = global.settings.value.userEmailAddress
const saveUsersEmailAddress = ref(usersEmailAddress)

const modesMap = new Map();
modesMap.set("collect", "collect")
modesMap.set("add_to_automated_savings_amount", "add")
modesMap.set("fill_up_limited_moneyboxes", "fill")
modesMap.set("ratio", "ratio")
modesMap.set("equal", "equal")


const reversedModesMap = new Map();
reversedModesMap.set("collect", "collect")
reversedModesMap.set("add", "add_to_automated_savings_amount")
reversedModesMap.set("fill", "fill_up_limited_moneyboxes")
reversedModesMap.set("ratio", "ratio")
reversedModesMap.set("equal", "equal")


const selectedOption = ref(modesMap.get(overflowMoneyboxAutomatedSavingsMode))

async function saveClicked() {
  const updates = {}

  if (saveAmount.value !== centsToEuroString(global.settings.value.savingsAmount)) {
    updates.savingsAmount = euroStringToCents(saveAmount.value)
  }

  if (saveAutoSaveEnable.value !== global.settings.value.isAutomatedSavingActive) {
    updates.isAutomatedSavingActive = saveAutoSaveEnable.value
  }

  if (saveReceivingHtmlEmails.value !== global.settings.value.sendReportsViaEmail) {
    updates.sendReportsViaEmail = saveReceivingHtmlEmails.value
  }

  if (selectedOption.value !== modesMap.get(overflowMoneyboxAutomatedSavingsMode)) {
    updates.overflowMoneyboxAutomatedSavingsMode = reversedModesMap.get(selectedOption.value)
  }

  if (saveUsersEmailAddress.value !== global.settings.value.userEmailAddress) {
    updates.userEmailAddress = saveUsersEmailAddress.value

    if (updates.userEmailAddress == "") {
      updates.userEmailAddress = null
    }
  }
 
  
  if (Object.keys(updates).length === 0) {
    errorMessage.value = t('error-no-changes')
    showErrorDialog.value = true
  } else {
    try{
      await updateSettings(updates)
      console.log("here")
      window.location.href = '/'; // Erzwingt ein komplettes Neuladen der Seite
      
    }  catch (error) {
      errorMessage.value = "Error while updating."
      showErrorDialog.value = true
    }
  }

}
</script>
