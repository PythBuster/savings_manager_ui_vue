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
        <CurrencyInput :label="$t('target-amount')" v-model="newTargetAmount" />
        <CurrencyInput :label="$t('savings-amount')" v-model="newSaveAmount" />
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
        <v-btn
          @click="saveClicked"
          :disabled="
            newSaveAmount === null || isNaN(newSaveAmount) || newTitle === ''
          "
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
import { ref } from 'vue'
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

// These are currently not saved, since the API does not support updating these values yet.
// When the API is updated, these values should be saved in the API
// and proper checks should be added to the saveClicked function.
// Make sure, unchanged values are not being sent to the API (name unchanged is already caugt).
const newTargetAmount = ref(global.findMoneyboxById(props.id).goal)
const newSaveAmount = ref(global.findMoneyboxById(props.id).increment)

async function saveClicked() {
  if (newTitle.value === originalTitle) {
    errorMessage.value = t('error-name-unchanged')
    showErrorDialog.value = true
  } else {
    try {
      await updateMoneybox(global.findMoneyboxById(props.id), newTitle.value)
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
          errorMessage.value = t('error-must-be-string')
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
  router.push({
    path: `/envelope/${props.id}`
  })
}
</script>
