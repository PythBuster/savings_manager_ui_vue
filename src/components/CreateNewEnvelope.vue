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

        <CurrencyInput
          :label="$t('savings-amount')"
          v-model="saveAmount"
        />
      </v-col>

      <v-col v-if="!display.mdAndUp" class="d-flex align-end justify-end">
        <v-btn
          @click="createClicked"
          :disabled="isInvalidSaveAmount || envelopeName === ''"
        >
          {{ $t('create-continue-priorities') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="display.mdAndUp">
      <v-col class="d-flex justify-end">
        <v-btn @click="createClicked">
          {{ $t('create-continue-priorities') }}
        </v-btn>
      </v-col>
    </v-row>

    <ErrorDialog
      v-model="showErrorDialog"
      :error-message="errorMessage"
    />
  </v-container>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import router from '@/router/index.js'
import { addMoneybox } from '@/api.js'
import { useI18n } from 'vue-i18n'
import { APIError } from '@/customerrors.js'
import { useDisplay } from 'vuetify'
import { euroStringToCents } from '@/utils.js'

const display = useDisplay()
const { t, locale } = useI18n({})

// reactive state
const envelopeName = ref(t('new-envelope2'))
const saveAmount = ref(0)
const targetAmount = ref(0)
const noLimit = ref(false)

const showErrorDialog = ref(false)
const errorMessage = ref('')

// computed for validation
const isInvalidSaveAmount = computed(() =>
  saveAmount.value === null || isNaN(saveAmount.value) || saveAmount.value < 0
)

// update name when locale changes
watch(() => locale.value, () => {
  envelopeName.value = t('new-envelope2')
})

// keep target and noLimit in sync
watch(noLimit, (currentValue) => {
  targetAmount.value = currentValue ? null : 0
})

async function createClicked() {
  if (!envelopeName.value.trim()) {
    errorMessage.value = t('error-empty-name')
    showErrorDialog.value = true
    return
  }

  if (saveAmount.value === null || saveAmount.value < 0) {
    saveAmount.value = 0
  }

  try {
    await addMoneybox({
      name: envelopeName.value,
      savingsTarget:
        targetAmount.value !== null ? euroStringToCents(targetAmount.value) : null,
      savingsAmount: euroStringToCents(saveAmount.value)
    })
    router.back()
  } catch (error) {
    if (noLimit.value) targetAmount.value = null

    if (error instanceof APIError) {
      const map = {
        405: () => t('error-duplicate-name', { name: envelopeName.value }),
        409: () => t('error-duplicate-name', { name: envelopeName.value }),
        422: () => t('error-envelope-validation'),
        500: () => error.message
      }
      errorMessage.value = map[error.status]?.() || error.message
    } else {
      errorMessage.value = `${error.name}: ${error.message}`
    }

    showErrorDialog.value = true
  }
}
</script>
