<template>
  <v-text-field v-model="formattedValue" ref="inputRef"> </v-text-field>
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input'
import { watch } from 'vue'

const props = defineProps({ modelValue: Number })

const { inputRef, formattedValue, setValue } = useCurrencyInput({
  currency: 'EUR',
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 2,
  valueRange: { min: 0 },
  locale: 'de-DE'
})

watch(
  () => props.modelValue,
  (value) => {
    setValue(value)
  }
)
</script>
