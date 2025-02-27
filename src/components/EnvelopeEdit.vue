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
        <v-text-field :label="$t('envelope-name')" v-model="newTitle" />
        <CurrencyInput
          :label="newNoLimit ? $t('no-limit') : $t('target-amount')"
          v-model="newTargetAmount"
          v-model:noLimit="newNoLimit"
          :showToggleIcon="true"
        />
        <CurrencyInput :label="$t('savings-amount')" v-model="newSaveAmount" />
        <v-textarea :label="$t('description')" v-model="newDescription"></v-textarea>  
      </v-col>
      <v-col v-if="!display.mdAndUp" class="d-flex align-end justify-end">
        <v-btn @click="backClicked" class="mr-2">{{
          $t('back-to-overview')
        }}</v-btn>
        <v-btn
          @click="saveClicked"
          :disabled="
            newSaveAmount === null || isNaN(newSaveAmount) || newTitle === ''
          "
          >{{ $t('save') }}</v-btn
        >
      </v-col>
    </v-row>

    <v-row v-if="display.mdAndUp">
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
import { ref, watch } from 'vue'
import router from '@/router/index.js'
import global from '@/global.js'
import { updateMoneybox } from '@/api.js'
import { useI18n } from 'vue-i18n'
import { APIError } from '@/customerrors.js'
import { useDisplay } from 'vuetify'
import { euroStringToCents, centsToEuroFloat } from '@/utils.js'

const display = ref(useDisplay())

// t used for error dialog, otherwise $t globally available
const { t } = useI18n({})

const props = defineProps({
  id: Number
})

const showErrorDialog = ref(false)
const errorMessage = ref('')

const originalTitle = global.findMoneyboxById(props.id).name
const newTitle = ref(originalTitle)

const originalDescription = global.findMoneyboxById(props.id).description
const newDescription = ref(originalDescription)

let euroSavingsTarget = global.findMoneyboxById(props.id).savingsTarget
const originalTargetAmount = global.findMoneyboxById(props.id).savingsTarget !== null ? centsToEuroFloat(euroSavingsTarget) : null

const newTargetAmount = ref(originalTargetAmount)

let originalSaveAmount = centsToEuroFloat(global.findMoneyboxById(props.id).savingsAmount)
const newSaveAmount = ref(originalSaveAmount)
console.log(newSaveAmount.value)
const newNoLimit = ref(originalTargetAmount !== null ? null : originalTargetAmount);

watch(newNoLimit, (currentValue) => {
  if (currentValue) {
    newTargetAmount.value = null
  } else {
    newTargetAmount.value = originalTargetAmount
  }
})

async function saveClicked() {
  let changes = {}

  if (newTitle.value !== originalTitle) {
    changes.newName = newTitle.value
  }

  console.log(originalDescription)
  console.log(newDescription.value)
  if (newDescription.value !== originalDescription) {
    changes.newDescription = newDescription.value
  }

  let effectiveNewTargetAmount = newTargetAmount.value

  changes.newSavingsTarget = effectiveNewTargetAmount !== null ? euroStringToCents(effectiveNewTargetAmount) : null
  changes.newSavingsAmount = newSaveAmount.value !== null ? euroStringToCents(newSaveAmount.value) : null
  
  if (Object.keys(changes).length === 0) {
    errorMessage.value = t('error-no-changes')
    showErrorDialog.value = true
  } else {
    try {
      console.log(changes)
      await updateMoneybox(global.findMoneyboxById(props.id), changes)
      router.back()
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 404) {
          errorMessage.value = t('error-not-found', {
            name: newTitle.value
          })
        } else if (error.status === 405) {
          errorMessage.value = t('error-duplicate-name', {
            name: newTitle.value
          })
        } else if (error.status === 422) {
          errorMessage.value = t('error-envelope-validation')
        } else if (error.status === 500) {
          errorMessage.value = error.message
        }
      } else {
        errorMessage.value = error.name + ': ' + error.message
      }
      showErrorDialog.value = true
    }
  }
}

function backClicked() {
  router.back()
}
</script>
