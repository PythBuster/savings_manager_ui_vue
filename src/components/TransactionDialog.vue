<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500px"
    @update:model-value="updateVisibilityState"
  >
    <v-card>
      <v-card-title class="text-wrap">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <p>{{ message }}</p>
        <CurrencyInput :label="$t('amount')" v-model="amount" />
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
import { ref } from 'vue'

defineProps({
  modelValue: Boolean,
  title: String,
  message: String
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const amount = ref(0)

function cancel() {
  emit('update:modelValue', false)
}
function confirm() {
  emit('confirm', amount.value)
  emit('update:modelValue', false)
  amount.value = 0
}

function updateVisibilityState(value) {
  emit('update:modelValue', value)
}
</script>
