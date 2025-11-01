<template>
  <v-text-field
    v-model="formattedValue"
    ref="inputRef"
    :append-inner-icon="
      showToggleIcon ? (noLimit ? 'mdi-infinity' : 'mdi-cash') : ''
    "
    @click:append-inner="toggleNoLimit"
    :readonly="noLimit"
  />
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input'
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, null],
    default: 0
  },
  noLimit: {
    type: Boolean,
    default: false
  },
  showToggleIcon: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'update:noLimit', 'change'])

const currencyOptions = {
  currency: 'EUR',
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 2,
  valueRange: { min: 0 },
  locale: 'de-DE'
}

const { inputRef, formattedValue, setValue } = useCurrencyInput(currencyOptions)

// keep currency input in sync with parent value
watch(
  () => props.modelValue,
  (value) => {
    setValue(value)
  }
)

function toggleNoLimit() {
  if (!props.showToggleIcon) return
  emit('update:noLimit', !props.noLimit)
}
</script>
