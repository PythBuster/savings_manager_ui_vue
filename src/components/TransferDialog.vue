<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title class="text-wrap">
        {{ transferTitle }}
      </v-card-title>
      <v-form ref="form" v-model="valid">
        <v-card-text>
          <p>{{ $t('transfer-how-much') }}</p>
          <CurrencyInput :label="$t('amount')" v-model="amount" />
          <p>{{ $t('transfer-where') }}</p>
          <v-autocomplete
            :label="$t('envelope')"
            :items="validMoneyboxes"
            item-value="id"
            item-title="name"
            v-model="selectedId"
            :no-data-text="$t('error-no-envelopes-found')"
            :rules="[validateAutocomplete]"
          ></v-autocomplete>
          <p>{{ $t('description') + $t('for-transfer') }}</p>
          <v-text-field :label="$t('description')" v-model="description" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="cancel">{{ $t('cancel') }}</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="confirm">OK</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import global from '@/global.js'
import { getMoneyboxes } from '@/api.js'

import { useI18n } from 'vue-i18n'

// t used for validation message, otherwise $t globally available
const { t } = useI18n({})

const props = defineProps({
  sourceId: Number
})

const dialogVisible = defineModel()

const emit = defineEmits(['confirm'])

const amount = ref(0)
const selectedId = ref(undefined)
const description = ref('')
const valid = ref(false)

const transferTitle = computed(() => {
  const isOverflow = global.findMoneyboxById(props.sourceId).is_overflow

  return isOverflow
    ? `${t('transfer-from-envelope')} ${t('overflow-envelope')}`
    : `${t('transfer-from-envelope')} ${global.findMoneyboxById(props.sourceId).name}`
})

const validMoneyboxes = computed(() => {
  return global.moneyboxes
    .filter((obj) => obj.id !== props.sourceId)
    .map((moneybox) => ({
      id: moneybox.id,
      name: moneybox.is_overflow ? t('overflow-envelope') : moneybox.name
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

function validateAutocomplete(value) {
  const isValid = validMoneyboxes.value.some(
    (moneybox) => moneybox.id === value
  )
  return isValid || t('invalid-selection')
}

// need all moneyboxes to show complete list
async function loadMoneyboxes() {
  if (!global.moneyboxesLoaded) {
    try {
      await getMoneyboxes()
      global.moneyboxesLoaded = true
    } catch (error) {
      console.error('Failed to fetch moneyboxes:', error)
      // TODO: Show error message to user or redirect to error page
    }
  }
}

watch(dialogVisible, (newVal) => {
  // Specifically check for the dialog opening
  if (newVal) {
    loadMoneyboxes()
  }
})

function cancel() {
  dialogVisible.value = false
}

function confirm() {
  emit('confirm', {
    amount: amount.value,
    selectedId: selectedId.value,
    description: description.value
  })
  dialogVisible.value = false
}

watch(dialogVisible, (newValue) => {
  if (!newValue) {
    amount.value = 0
    description.value = ''
    selectedId.value = undefined
  }
})
</script>
