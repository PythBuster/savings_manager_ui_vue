<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('new-envelope-settings') }}</h1>
      </v-col>
    </v-row>
    <v-row class="mt-16">
      <v-col cols="12" sm="6">
        <v-text-field :label="$t('envelope-name')" v-model="envelopeName" />
        <CurrencyInput :label="$t('target-amount')" v-model="targetAmount" />
        <CurrencyInput :label="$t('savings-amount2')" v-model="saveAmount" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          @click="createClicked"
          :disabled="
            saveAmount === null || isNaN(saveAmount) || envelopeName === ''
          "
          >{{ $t('create-continue-priorities') }}</v-btn
        >
      </v-col>
    </v-row>
    <v-dialog v-model="showErrorDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">Error</v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showErrorDialog = false"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref, watch } from 'vue'
import router from '@/router'
import { addMoneybox } from '@/api.js'
import { useI18n } from 'vue-i18n'
import { APIError } from '@/customerrors'

// t used for envelopeName, otherwise $t globally available
const { t, locale } = useI18n({})

// Dummy data
const saveAmount = ref(10.0)
const targetAmount = ref()

const envelopeName = ref(t('new-envelope2'))

const showErrorDialog = ref(false)
const errorMessage = ref('')

watch(
  () => locale.value,
  () => {
    envelopeName.value = t('new-envelope2')
  }
)

async function createClicked() {
  try {
    await addMoneybox(envelopeName.value)
    router.push({
      path: '/priority'
    })
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 405) {
        errorMessage.value = `${t('error-duplicate-name-1')}${envelopeName.value}${t('error-duplicate-name-2')}`
      } else if (error.status === 422) {
        errorMessage.value = t('error-must-be-string')
      } else if (error.status === 500) {
        errorMessage.value = error.message
      }
    } else {
      errorMessage.value = error
    }
    showErrorDialog.value = true
  }
}
</script>
