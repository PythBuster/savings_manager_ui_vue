<template>
  <v-container>
    <v-row
      v-if="global.findMoneyboxById(id)"
      class="d-flex justify-space-between align-center"
    >
      <v-col cols="auto" md="auto">
        <h1 class="text-h4">
          {{ $t('envelope') + ': ' + global.findMoneyboxById(id).name }}
        </h1>
      </v-col>
      <v-col cols="auto" class="d-flex justify-end">
        <v-btn @click="viewCompleteClicked">{{
          $t('view-complete-logs')
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="global.findMoneyboxById(id)" justify="space-between">
      <v-col cols="auto">
        <v-table>
          <tbody>
            <tr>
              <td>{{ $t('balance') }}</td>
              <td>{{ formatCurrency(global.findMoneyboxById(id).balance) }}</td>
            </tr>
            <tr>
              <td>{{ $t('goal-amount') }}</td>
              <td>
                {{
                  !global.findMoneyboxById(id).no_limit
                    ? formatCurrency(global.findMoneyboxById(id).goal)
                    : $t('no-limit')
                }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('savings-amount') }}:</td>
              <td>
                {{ formatCurrency(global.findMoneyboxById(id).increment) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn @click="handleTransactionDialog('deposit')" class="mb-2">{{
          $t('deposit')
        }}</v-btn>
        <v-btn @click="handleTransactionDialog('withdraw')" class="mb-2">{{
          $t('withdraw')
        }}</v-btn>
        <v-btn @click="handleTransferDialog">{{ $t('transfer') }}</v-btn>
      </v-col>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn @click="changeSettingsClicked" class="mb-2">{{
          $t('change-settings')
        }}</v-btn>
        <v-btn @click="deleteClicked" color="warning">{{
          $t('delete-envelope')
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="9">
        <TransactionLogs :id="id" :showAll="false" />
      </v-col>
      <v-col cols="12" lg="3">
        <BarChart :id="id" />
      </v-col>
    </v-row>
    <v-dialog
      v-if="global.findMoneyboxById(id)"
      v-model="showDeleteDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">{{
          $t('delete-envelope')
        }}</v-card-title>
        <v-card-text>
          {{ $t('delete-envelope-question-1') }}
          <span class="font-weight-bold">{{
            global.findMoneyboxById(id).name
          }}</span
          >{{ $t('delete-envelope-question-2') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="showDeleteDialog = false">{{
            $t('cancel')
          }}</v-btn>
          <v-btn color="red darken-1" @click="handleDeleteConfirm">{{
            $t('delete')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ErrorDialog
      v-model="showErrorDialog"
      :error-message="errorMessage"
    ></ErrorDialog>
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
    ></TransferDialog>
  </v-container>
</template>
<script setup>
import { ref, watch } from 'vue'
import global from '@/global.js'
import router from '@/router/index.js'
import { formatCurrency } from '@/utils.js'
import {
  deleteMoneybox,
  depositIntoMoneybox,
  getTransactionLogs,
  transferFromMoneyboxToMoneybox,
  withdrawFromMoneybox
} from '@/api.js'
import { useI18n } from 'vue-i18n'
import { APIError } from '@/customerrors.js'

// t used for dialogs, otherwise $t globally available
const { t } = useI18n({})

const showDeleteDialog = ref(false)

const props = defineProps({
  id: Number
})

const showTransactionDialog = ref(false)
const showTransferDialog = ref(false)

const currentActionType = ref('')

const showErrorDialog = ref(false)
const errorMessage = ref('')

watch(showErrorDialog, (newValue) => {
  if (!newValue) {
    showDeleteDialog.value = false
  }
})

function changeSettingsClicked() {
  router.push({
    path: `/editenvelope/${props.id}`
  })
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

async function handleTransactionConfirm(transactionDetails) {
  if (transactionDetails.action === 'deposit') {
    try {
      await depositIntoMoneybox(
        global.findMoneyboxById(props.id),
        transactionDetails.amount,
        transactionDetails.description
      )
      // update transaction logs
      await getTransactionLogs(global.findMoneyboxById(props.id))
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 404) {
          errorMessage.value = t('error-not-found', {
            name: global.findMoneyboxById(props.id).name
          })
        } else if (error.status === 405) {
          errorMessage.value = t('error-not-enough-money', {
            name: global.findMoneyboxById(props.id).name
          })
        } else if (error.status === 422) {
          errorMessage.value = t('error-negative-amount')
        } else if (error.status === 500) {
          errorMessage.value = error.message
        }
      } else {
        errorMessage.value = error.name + ': ' + error.message
      }
      showErrorDialog.value = true
    }
  } else {
    try {
      await withdrawFromMoneybox(
        global.findMoneyboxById(props.id),
        transactionDetails.amount,
        transactionDetails.description
      )
      // update transaction logs
      await getTransactionLogs(global.findMoneyboxById(props.id))
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 404) {
          errorMessage.value = t('error-not-found', {
            name: global.findMoneyboxById(props.id).name
          })
        } else if (error.status === 405) {
          errorMessage.value = t('error-not-enough-money', {
            name: global.findMoneyboxById(props.id).name
          })
        } else if (error.status === 422) {
          errorMessage.value = t('error-negative-amount')
        } else if (error.status === 500) {
          errorMessage.value = error.message
        }
      } else {
        errorMessage.value = error.name + ': ' + error.message
      }
      showErrorDialog.value = true
    }
  }
}

async function handleTransferConfirm(transferSelection) {
  try {
    await transferFromMoneyboxToMoneybox(
      global.findMoneyboxById(props.id),
      transferSelection.amount,
      global.findMoneyboxById(transferSelection.selectedId),
      transferSelection.description
    )
    // update transaction logs
    await getTransactionLogs(global.findMoneyboxById(props.id))
    await getTransactionLogs(
      global.findMoneyboxById(transferSelection.selectedId)
    )
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 404) {
        errorMessage.value = t('error-not-found', {
          name: global.findMoneyboxById(props.id).name
        })
      } else if (error.status === 405) {
        errorMessage.value = t('error-not-enough-money', {
          name: global.findMoneyboxById(props.id).name
        })
      } else if (error.status === 422) {
        errorMessage.value = t('error-negative-amount')
      } else if (error.status === 500) {
        errorMessage.value = error.message
      }
    } else {
      errorMessage.value = error.name + ': ' + error.message
    }
    showErrorDialog.value = true
  }
}

async function handleDeleteConfirm() {
  const deletedMoneyboxId = props.id
  const deletedMoneybox = global.findMoneyboxById(deletedMoneyboxId)

  if (deletedMoneybox.balance > 0) {
    errorMessage.value = t('error-delete-with-balance')
    showErrorDialog.value = true
  } else {
    try {
      await deleteMoneybox(global.findMoneyboxById(props.id))
      showDeleteDialog.value = false

      router.push({
        path: '/'
      })
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 404) {
          errorMessage.value = t('error-not-found', {
            name: global.findMoneyboxById(props.id).name
          })
        } else if (error.status === 405) {
          errorMessage.value = t('error-delete-with-balance')
        } else if (error.status === 422) {
          errorMessage.value = t('error-must-be-string')
        } else if (error.status === 500) {
          errorMessage.value = error.message
        }
      } else {
        errorMessage.value = error.name + ': ' + error.message
      }
      showErrorDialog.value = true
    }
  }
}

function viewCompleteClicked() {
  router.push({
    path: `/logs/${props.id}`
  })
}
</script>
