<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title class="text-wrap">
        {{ transferTitle }}
      </v-card-title>

      <v-form ref="form" v-model="valid">
        <v-card-text>
          <p style="display: inline-block">{{ " " + $t('available-balance-title')  }}</p>
          <v-label style="margin-left: 5px;">{{formatCurrency(props.availableBalance)}}</v-label>
          <br><br>

          <p>{{ $t('transfer-how-much') }}</p>
          <CurrencyInput :label="$t('amount')" v-model="amount" />

          <p>{{ $t('transfer-where') }}</p>
          <v-autocomplete
            :label="$t('envelope')"
            :items="validMoneyboxes"
            item-value="id"
            item-title="name"
            v-model="selectedId"
            :no-data-text="$t('error-no-envelopes-found')"
            :rules="[validateAutocomplete]"
          />

          <p>{{ $t('description') + $t('for-transfer') }}</p>
          <v-text-field :label="$t('description')" v-model="description" />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="surface-variant" @click="cancel">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
            color="info"
            :disabled="!valid || amount <= 0"
            @click="confirm"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import global from '@/global.js'
import { getMoneyboxes } from '@/api.js'
import { useI18n } from 'vue-i18n'
import CurrencyInput from '@/components/CurrencyInput.vue'
import { formatCurrency } from '@/utils'

const { t } = useI18n({})

const props = defineProps({
  sourceId: Number,
  availableBalance: {
    type: Number,
    default: 0
  }
})

const dialogVisible = defineModel()
const emit = defineEmits(['confirm'])

const amount = ref(0)
const selectedId = ref(undefined)
const description = ref('')
const valid = ref(false)

const sourceMoneybox = computed(() => global.findMoneyboxById(props.sourceId))

const transferTitle = computed(() => sourceMoneybox.value?.name || '')

const validMoneyboxes = computed(() =>
  global.moneyboxes
    .filter((m) => m.id !== props.sourceId)
    .map((m) => ({ id: m.id, name: m.name }))
    .sort((a, b) => a.name.localeCompare(b.name))
)

function validateAutocomplete(value) {
  return (
    validMoneyboxes.value.some((m) => m.id === value) ||
    t('invalid-selection')
  )
}

async function loadMoneyboxes() {
  if (!global.moneyboxesLoaded) {
    try {
      await getMoneyboxes()
      global.moneyboxesLoaded = true
    } catch (error) {
      console.error('Failed to fetch moneyboxes:', error)
    }
  }
}

function resetForm() {
  amount.value = 0
  description.value = ''
  selectedId.value = undefined
}

watch(dialogVisible, (isOpen) => {
  if (isOpen) {
    loadMoneyboxes()
  } else {
    resetForm()
  }
})

function cancel() {
  dialogVisible.value = false
}

function confirm() {
  emit('confirm', {
    amount: amount.value,
    selectedId: selectedId.value,
    description: description.value
  })
  dialogVisible.value = false
}
</script>
