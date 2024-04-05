<template>
  <v-text-field v-model="formattedValue" ref="inputRef"> </v-text-field>
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input'
import { watch } from 'vue'

const props = defineProps({ modelValue: Number })

// define update:Modelvalue to prevent tainting attrs and change to prevent warning (now that emits are defined)
defineEmits(['update:modelValue', 'change'])

const { inputRef, formattedValue, setValue } = useCurrencyInput({
  currency: 'EUR',
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 2,
  valueRange: { min: 0 },
  locale: 'de-DE'
})

// For updating value from parent component, not used atm, but left in for possible future use
watch(
  () => props.modelValue,
  (value) => {
    setValue(value)
  }
)
</script>
