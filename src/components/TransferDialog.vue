<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500px"
    @update:model-value="updateVisibilityState"
  >
    <v-card>
      <v-card-title class="text-wrap">{{
        $t('transfer-from-envelope') + global.findMoneyboxById(sourceId).name
      }}</v-card-title>
      <v-card-text>
        <p>{{ $t('transfer-how-much') }}</p>
        <CurrencyInput :label="$t('amount')" v-model="amount" />
        <p>{{ $t('transfer-where') }}</p>
        <v-autocomplete
          :label="$t('envelope')"
          :items="global.moneyboxes.filter((obj) => obj.id !== sourceId)"
          item-value="id"
          item-title="name"
          v-model="selectedId"
          :no-data-text="$t('error-no-envelopes-found')"
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="cancel">{{ $t('cancel') }}</v-btn>
        <v-btn color="primary" @click="confirm">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import global from '@/global.js'
import { getMoneyboxes } from '@/api.js'

defineProps({
  modelValue: Boolean,
  sourceId: Number
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const amount = ref(0)
const selectedId = ref(undefined)

function cancel() {
  emit('update:modelValue', false)
}

function confirm() {
  emit('confirm', {
    amount: amount.value,
    selectedId: selectedId.value
  })
  emit('update:modelValue', false)
  amount.value = 0
  selectedId.value = undefined
}

function updateVisibilityState(value) {
  emit('update:modelValue', value)
}

// need all moneyboxes to show complete list
onMounted(async () => {
  if (!global.moneyboxesLoaded) {
    try {
      await getMoneyboxes()
      global.moneyboxesLoaded = true
    } catch (error) {
      console.error('Failed to fetch moneyboxes:', error)
      // TODO: Show error message to user or redirect to error page
    }
  }
})
</script>
