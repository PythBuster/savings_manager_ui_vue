<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('settings') }}</h1>
      </v-col>
    </v-row>
    <v-row :class="display.smAndUp ? 'mt-16' : ''">
      <v-col cols="12" sm="6">
        <v-text-field :label="$t('envelope-name')" v-model="newTitle" />
        <CurrencyInput
          :label="newNoLimit ? $t('no-limit') : $t('target-amount')"
          v-model="newTargetAmount"
          v-model:noLimit="newNoLimit"
          :showToggleIcon="true"
        />
        <CurrencyInput :label="$t('savings-amount')" v-model="newSaveAmount" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
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
const originalTargetAmount = global.findMoneyboxById(props.id).goal
const newTargetAmount =
  global.findMoneyboxById(props.id).no_limit === true
    ? ref(null)
    : ref(originalTargetAmount)
const originalSaveAmount = global.findMoneyboxById(props.id).increment
const newSaveAmount = ref(originalSaveAmount)
const originalNoLimit = global.findMoneyboxById(props.id).no_limit
const newNoLimit = ref(originalNoLimit)

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

  let effectiveNewTargetAmount = newNoLimit.value ? 0 : newTargetAmount.value
  if (effectiveNewTargetAmount !== originalTargetAmount) {
    changes.newGoal = effectiveNewTargetAmount
  }

  if (newSaveAmount.value !== originalSaveAmount) {
    changes.newIncrement =
      newSaveAmount.value === null ? 0 : newSaveAmount.value
  }

  if (newNoLimit.value !== originalNoLimit) {
    changes.newNoLimit = newNoLimit.value
  }

  if (Object.keys(changes).length === 0) {
    errorMessage.value = t('error-no-changes')
    showErrorDialog.value = true
  } else {
    try {
      await updateMoneybox(global.findMoneyboxById(props.id), changes)
      router.push({
        path: `/envelope/${props.id}`
      })
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
</script>
