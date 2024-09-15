<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'">
          {{ $t('new-envelope-settings') }}
        </h1>
      </v-col>
    </v-row>
    <v-row :class="display.mdAndUp ? 'mt-16' : ''">
      <v-col cols="12" sm="6">
        <v-text-field :label="$t('envelope-name')" v-model="envelopeName" />
        <CurrencyInput
          :label="noLimit ? $t('no-limit') : $t('target-amount')"
          v-model="targetAmount"
          v-model:noLimit="noLimit"
          :showToggleIcon="true"
        />
        <CurrencyInput :label="$t('savings-amount')" v-model="saveAmount" />
      </v-col>
      <v-col v-if="!display.mdAndUp" class="d-flex align-end justify-end">
        <v-btn
          @click="createClicked"
          :disabled="
            saveAmount === null || isNaN(saveAmount) || envelopeName === ''
          "
          >{{ $t('create-continue-priorities') }}</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="display.mdAndUp">
      <v-col class="d-flex justify-end">
        <v-btn @click="createClicked">{{
          $t('create-continue-priorities')
        }}</v-btn>
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
import { addMoneybox } from '@/api.js'
import { useI18n } from 'vue-i18n'
import { APIError } from '@/customerrors.js'
import { useDisplay } from 'vuetify'
import { centsToEuroString, euroStringToCents } from '@/utils.js'

const display = ref(useDisplay())

// t used for envelopeName and error dialog, otherwise $t globally available
const { t, locale } = useI18n({})

const saveAmount = ref(0)
const targetAmount = ref(0)
const noLimit = ref(false)

const envelopeName = ref(t('new-envelope2'))

const showErrorDialog = ref(false)
const errorMessage = ref('')

watch(
  () => locale.value,
  () => {
    envelopeName.value = t('new-envelope2')
  }
)

watch(noLimit, (currentValue) => {
  if (currentValue) {
    targetAmount.value = null
  } else {
    targetAmount.value = 0
  }
})

async function createClicked() {
  if (envelopeName.value === '') {
    errorMessage.value = t('error-empty-name')
    showErrorDialog.value = true
  } else {

    if (saveAmount.value === null) {
      saveAmount.value = 0
    }
    try {
      await addMoneybox({
        name: envelopeName.value,
        savingsTarget: targetAmount.value !== null ? euroStringToCents(targetAmount.value) : null,
        savingsAmount: euroStringToCents(saveAmount.value)
      })
      router.back();
    } catch (error) {
      if (noLimit.value) {
        targetAmount.value = null
      }
      if (error instanceof APIError) {
        if (error.status === 405 || error.status === 409) {
          errorMessage.value = t('error-duplicate-name', {
            name: envelopeName.value
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
