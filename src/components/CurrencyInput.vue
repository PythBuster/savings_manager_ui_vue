<template>
  <v-text-field v-model="formattedValue" ref="inputRef"> </v-text-field>
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input'

// NOTE:
// This defines an emit for update:modelValue, but not for change
// In order to prevent warning, defineEmits('update:modelValue', 'change') would be needed
defineModel()

const { inputRef, formattedValue } = useCurrencyInput(
  {
    currency: 'EUR',
    hideCurrencySymbolOnFocus: false,
    hideGroupingSeparatorOnFocus: false,
    precision: 2,
    valueRange: { min: 0 },
    locale: 'de-DE'
  },
  // FIX: Proper position for autoEmit boolean
  // NOTE: This makes the component non-function, for future reference of the correct position only
  false
)
</script>
