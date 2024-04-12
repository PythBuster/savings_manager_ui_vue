<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title class="text-wrap">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <p>{{ message }}</p>
        <CurrencyInput :label="$t('amount')" v-model="amount" />
        <p>
          {{
            $t('description') +
            (action === 'deposit' ? $t('for-deposit') : $t('for-withdrawal'))
          }}
        </p>
        <v-text-field :label="$t('description')" v-model="description" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="surface-variant" @click="cancel">{{
          $t('cancel')
        }}</v-btn>
        <v-btn color="info" :disabled="!(amount > 0)" @click="confirm"
          >OK</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import global from '@/global.js'
import { useI18n } from 'vue-i18n'

// t used for dialogs, otherwise $t globally available
const { t } = useI18n({})

const props = defineProps({
  action: String,
  id: Number
})

const dialogVisible = defineModel()

const emit = defineEmits(['confirm'])

const amount = ref(0)
const description = ref('')

const title = computed(() => {
  const isOverflow = global.findMoneyboxById(props.id).is_overflow
  const moneyboxName = isOverflow
    ? t('overflow-envelope')
    : global.findMoneyboxById(props.id).name

  return props.action === 'deposit'
    ? `${t('deposit')} ${t('into-envelope', { name: moneyboxName })}`
    : `${t('withdraw')} ${t('from-envelope', { name: moneyboxName })}`
})

const message = computed(() => {
  return props.action === 'deposit'
    ? t('deposit-question')
    : t('withdraw-question')
})

function cancel() {
  dialogVisible.value = false
}

function confirm() {
  emit('confirm', {
    amount: amount.value,
    action: props.action,
    description: description.value
  })
  dialogVisible.value = false
}

watch(dialogVisible, (newValue) => {
  if (!newValue) {
    amount.value = 0
    description.value = ''
  }
})
</script>
