<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('settings') }}</h1>
      </v-col>
    </v-row>
    <v-row class="mt-16">
      <v-col cols="12" sm="6">
        <v-text-field :label="$t('envelope-name')" v-model="newTitle" />
        <CurrencyInput :label="$t('target-amount')" v-model="newTargetAmount" />
        <CurrencyInput :label="$t('savings-amount')" v-model="newSaveAmount" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
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
      @update:modelValue="showErrorDialog = $event"
    ></ErrorDialog>
  </v-container>
</template>
<script setup>
import { ref } from 'vue'
import router from '@/router'
import global from '@/global.js'
import { updateMoneybox } from '@/api.js'
import { useI18n } from 'vue-i18n'
import { APIError } from '@/customerrors'

// t used for error dialog, otherwise $t globally available
const { t } = useI18n({})

const props = defineProps({
  id: Number
})

const showErrorDialog = ref(false)
const errorMessage = ref('')

const newTitle = ref(global.findMoneyboxById(props.id).name)
const newTargetAmount = ref(global.findMoneyboxById(props.id).goal)
const newSaveAmount = ref(global.findMoneyboxById(props.id).increment)

async function saveClicked() {
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
</script>
