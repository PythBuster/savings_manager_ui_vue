<template>
  <v-text-field
    v-model="formattedValue"
    ref="inputRef"
    :append-inner-icon="
      showToggleIcon ? (noLimit ? 'mdi-infinity' : 'mdi-cash') : ''
    "
    @click:append-inner="toggleNoLimit"
    :readonly="noLimit"
  >
  </v-text-field>
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input'
import { watch } from 'vue'

const props = defineProps({
  modelValue: Number,
  noLimit: Boolean,
  showToggleIcon: {
    type: Boolean,
    default: false
  }
})

// define update:Modelvalue to prevent tainting attrs and change to prevent warning (now that emits are defined)
const emit = defineEmits(['update:modelValue', 'update:noLimit', 'change'])

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

function toggleNoLimit() {
  emit('update:noLimit', !props.noLimit)
}
</script>
