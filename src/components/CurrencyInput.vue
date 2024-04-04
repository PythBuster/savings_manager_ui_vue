<template>
  <v-text-field v-model="formattedValue" ref="inputRef"> </v-text-field>
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input'

defineModel()

const { inputRef, formattedValue } = useCurrencyInput({
  currency: 'EUR',
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 2,
  valueRange: { min: 0 },
  locale: 'de-DE',
  autoEmit: false // handled by defineModel()
})
</script>
