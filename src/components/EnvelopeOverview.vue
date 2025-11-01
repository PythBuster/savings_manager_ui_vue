<template>
  <v-container v-if="moneybox">
    <v-row class="d-flex justify-space-between align-center">
      <v-col cols="auto" md="auto">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'">
          {{ $t('envelope') + ': ' + (moneybox.priority === 0 ? $t('overflow-moneybox') : moneybox.name) }}
        </h1>
      </v-col>
      <v-col cols="auto" class="d-flex justify-end">
        <v-btn @click="viewCompleteClicked">{{ $t('view-complete-logs') }}</v-btn>
      </v-col>
    </v-row>

    <v-row justify="space-between">
      <v-col cols="auto">
        <v-table>
          <tbody>
          <tr>
            <td>{{ $t('balance') }}</td>
            <td>{{ formatCurrency(moneybox.balance) }}</td>
          </tr>
          <tr v-if="moneybox.priority != 0">
            <td>{{ $t('savings-target') }}</td>
            <td>
              {{
                moneybox.savingsTarget !== null
                  ? formatCurrency(moneybox.savingsTarget)
                  : $t('no-limit')
              }}
            </td>
          </tr>
          <tr v-if="moneybox.priority != 0">
            <td>{{ $t('savings-amount') }}</td>
            <td>{{ formatCurrency(moneybox.savingsAmount) }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col cols="auto" class="d-flex flex-column">
        <v-btn
          color="success"
          @click="handleTransactionDialog('deposit')"
          class="mb-2"
        >
          {{ $t('deposit') }}
        </v-btn>

        <v-btn
          color="warning"
          class="mb-2"
          @click="handleTransactionDialog('withdraw')"
          :disabled="moneybox.balance === 0"
        >
          {{ $t('withdraw') }}
        </v-btn>

        <v-btn
          color="info"
          @click="handleTransferDialog"
          :disabled="moneybox.balance === 0"
        >
          {{ $t('transfer') }}
        </v-btn>
      </v-col>

      <v-col v-if="moneybox.priority != 0" cols="auto" class="d-flex flex-column">
        <v-btn @click="changeSettingsClicked" class="mb-2">
          {{ $t('change-settings') }}
        </v-btn>
        <v-btn @click="deleteClicked" color="error">
          {{ $t('delete-envelope') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="9">
        <v-textarea
          :label="$t('description')"
          :model-value="moneybox.description"
          variant="filled"
          auto-grow
          readonly
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="9">
        <TransactionLogs :id="id" :showAll="false" />
      </v-col>
    </v-row>

    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ $t('delete-envelope') }}</v-card-title>
        <v-card-text>
          {{ $t('delete-envelope-question-1') }}
          <span class="font-weight-bold">{{ moneybox.name }}</span>
          {{ $t('delete-envelope-question-2') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="surface-variant" @click="showDeleteDialog = false">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn color="error" @click="handleDeleteConfirm">
            {{ $t('delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ErrorDialog v-model="showErrorDialog" :error-message="errorMessage" />
    <TransactionDialog
      v-model="showTransactionDialog"
      :action="currentActionType"
      :id="id"
      @confirm="handleTransactionConfirm"
    />
    <TransferDialog
      v-model="showTransferDialog"
      :sourceId="id"
      @confirm="handleTransferConfirm"
    />
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import global from '@/global.js'
import router from '@/router/index.js'
import { formatCurrency, euroStringToCents } from '@/utils.js'
import {
  deleteMoneybox,
  depositIntoMoneybox,
  withdrawFromMoneybox,
  transferFromMoneyboxToMoneybox,
  getTransactionLogs,
  updateMoneybox
} from '@/api.js'
import { useI18n } from 'vue-i18n'
import { APIError } from '@/customerrors.js'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'

const display = useDisplay()
const { t } = useI18n({})
const route = useRoute()

const props = defineProps({ id: Number })
const id = computed(() => props.id || route.params.id)

const moneybox = computed(() => global.findMoneyboxById(id.value))

const showDeleteDialog = ref(false)
const showTransactionDialog = ref(false)
const showTransferDialog = ref(false)
const showErrorDialog = ref(false)
const errorMessage = ref('')
const currentActionType = ref('')

function handleApiError(error, nameKey) {
  if (error instanceof APIError) {
    const map = {
      404: () => t('error-not-found', { name: nameKey }),
      405: () => t('error-not-enough-money', { name: nameKey }),
      422: () => t('error-negative-amount'),
      500: () => error.message
    }
    return map[error.status]?.() || error.message
  }
  return `${error.name}: ${error.message}`
}

function changeSettingsClicked() {
  router.push(`/editenvelope/${id.value}`)
}

function deleteClicked() {
  showDeleteDialog.value = true
}

function handleTransactionDialog(action) {
  currentActionType.value = action
  showTransactionDialog.value = true
}

function handleTransferDialog() {
  showTransferDialog.value = true
}

async function handleTransactionConfirm(details) {
  try {
    const method =
      details.action === 'deposit' ? depositIntoMoneybox : withdrawFromMoneybox
    await method(
      moneybox.value,
      euroStringToCents(details.amount),
      details.description
    )
    await getTransactionLogs(moneybox.value)
  } catch (error) {
    errorMessage.value = handleApiError(error, moneybox.value.name)
    showErrorDialog.value = true
  }
}

async function handleTransferConfirm(transfer) {
  try {
    await transferFromMoneyboxToMoneybox(
      moneybox.value,
      euroStringToCents(transfer.amount),
      global.findMoneyboxById(transfer.selectedId),
      transfer.description
    )
    await getTransactionLogs(moneybox.value)
    await getTransactionLogs(global.findMoneyboxById(transfer.selectedId))
  } catch (error) {
    errorMessage.value = handleApiError(error, moneybox.value.name)
    showErrorDialog.value = true
  }
}

async function handleDeleteConfirm() {
  const target = moneybox.value
  if (target.balance > 0) {
    errorMessage.value = t('error-delete-with-balance')
    showErrorDialog.value = true
    return
  }

  try {
    const deletedPriority = target.priority
    await deleteMoneybox(target)

    if (deletedPriority !== null) {
      const moneyboxesToUpdate = global.moneyboxes
        .filter((mb) => mb.priority > deletedPriority)
        .map((mb) => global.findMoneyboxById(mb.id))

      for (const mb of moneyboxesToUpdate) {
        await updateMoneybox(mb, { newPriority: mb.priority - 1 })
      }
    }

    showDeleteDialog.value = false
    router.back()
  } catch (error) {
    errorMessage.value = handleApiError(error, moneybox.value.name)
    showErrorDialog.value = true
  }
}

function viewCompleteClicked() {
  router.push(`/logs/${id.value}`)
}
</script>
