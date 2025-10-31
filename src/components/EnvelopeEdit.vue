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

        <CurrencyInput
          :label="$t('savings-amount')"
          v-model="newSaveAmount"
        />

        <v-textarea
          :label="$t('description')"
          v-model="newDescription"
        ></v-textarea>
      </v-col>

      <v-col v-if="!display.mdAndUp" class="d-flex align-end justify-end">
        <v-btn @click="backClicked" class="mr-2">
          {{ $t('back-to-overview') }}
        </v-btn>
        <v-btn
          @click="saveClicked"
          :disabled="isInvalidSaveAmount || newTitle === ''"
        >
          {{ $t('save') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="display.mdAndUp">
      <v-col class="d-flex justify-end">
        <v-btn @click="backClicked" class="mr-2">
          {{ $t('back-to-overview') }}
        </v-btn>
        <v-btn @click="saveClicked">{{ $t('save') }}</v-btn>
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
import global from '@/global.js'
import { updateMoneybox } from '@/api.js'
import { useI18n } from 'vue-i18n'
import { APIError } from '@/customerrors.js'
import { useDisplay } from 'vuetify'
import { euroStringToCents, centsToEuroFloat } from '@/utils.js'

const display = ref(useDisplay())
const { t } = useI18n({})

const props = defineProps({
  id: Number
})

const showErrorDialog = ref(false)
const errorMessage = ref('')

const moneybox = global.findMoneyboxById(props.id)

// --- Base data ---
const originalTitle = moneybox.name
const newTitle = ref(originalTitle)

const originalDescription = moneybox.description
const newDescription = ref(originalDescription)

const euroSavingsTarget = moneybox.savingsTarget
const originalTargetAmount =
  euroSavingsTarget !== null ? centsToEuroFloat(euroSavingsTarget) : null
const newTargetAmount = ref(originalTargetAmount)

const originalSaveAmount = centsToEuroFloat(moneybox.savingsAmount)
const newSaveAmount = ref(originalSaveAmount)

const newNoLimit = ref(originalTargetAmount === null)

// --- Watchers ---
watch(newNoLimit, (currentValue) => {
  newTargetAmount.value = currentValue ? null : originalTargetAmount
})

// --- Validation computed fields ---
const isInvalidSaveAmount = computed(() => {
  return (
    newSaveAmount.value === null ||
    isNaN(newSaveAmount.value) ||
    newSaveAmount.value < 0
  )
})

watch(newSaveAmount, (value) => {
  if (value === undefined || value === null || value < 0) {
    newSaveAmount.value = 0
  }
})

watch(newTargetAmount, (value) => {
  if (value !== null && value < 0) {
    newTargetAmount.value = 0
  }
})

// --- Save handler ---
async function saveClicked() {
  const changes = {}

  if (newTitle.value !== originalTitle) {
    changes.newName = newTitle.value
  }

  if (newDescription.value !== originalDescription) {
    changes.newDescription = newDescription.value
  }

  const effectiveTarget =
    newNoLimit.value || newTargetAmount.value === null
      ? null
      : newTargetAmount.value

  changes.newSavingsTarget =
    effectiveTarget !== null ? euroStringToCents(effectiveTarget) : null

  // SavingsAmount always >= 0 and never null
  if (newSaveAmount.value !== originalSaveAmount) {
    changes.newSavingsAmount = euroStringToCents(newSaveAmount.value)
  }

  if (Object.keys(changes).length === 0) {
    errorMessage.value = t('error-no-changes')
    showErrorDialog.value = true
    return
  }

  try {
    await updateMoneybox(global.findMoneyboxById(props.id), changes)
    router.back()
  } catch (error) {
    if (error instanceof APIError) {
      const statusHandlers = {
        404: () => t('error-not-found', { name: newTitle.value }),
        405: () => t('error-duplicate-name', { name: newTitle.value }),
        422: () => t('error-envelope-validation'),
        500: () => error.message
      }
      errorMessage.value = statusHandlers[error.status]?.() || error.message
    } else {
      errorMessage.value = `${error.name}: ${error.message}`
    }
    showErrorDialog.value = true
  }
}

function backClicked() {
  router.back()
}
</script>
