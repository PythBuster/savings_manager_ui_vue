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
import { ref, computed } from 'vue'
import global from '@/global.js'
import { useI18n } from 'vue-i18n'

// t used for dialogs, otherwise $t globally available
const { t } = useI18n({})

const props = defineProps({
  modelValue: Boolean,
  action: String,
  id: Number
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const amount = ref(0)

const title = computed(() => {
  return props.action === 'deposit'
    ? t('deposit') +
        t('into-envelope', { name: global.findMoneyboxById(props.id).name })
    : t('withdraw') +
        t('from-envelope', {
          name: global.findMoneyboxById(props.id).name
        })
})

const message = computed(() => {
  return props.action === 'deposit'
    ? t('deposit-question')
    : t('withdraw-question')
})

function cancel() {
  emit('update:modelValue', false)
  amount.value = 0
}
function confirm() {
  emit('confirm', { amount: amount.value, action: props.action })
  emit('update:modelValue', false)
  amount.value = 0
}

function updateVisibilityState(value) {
  emit('update:modelValue', value)
  amount.value = 0
}
</script>
