<template>
  <v-container>
    <v-row v-if="overflow" class="d-flex justify-space-between align-center">
      <v-col cols="auto" md="auto">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'">
          {{ $t('envelope') + ': ' + $t('overflow-envelope') }}
        </h1>
      </v-col>
      <v-col cols="auto" class="d-flex justify-end">
        <v-btn @click="viewCompleteClicked">{{
          $t('view-complete-logs')
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="overflow" justify="space-between">
      <v-col cols="auto">
        <v-table>
          <tbody>
            <tr>
              <td>{{ $t('balance') }}</td>
              <td>{{ formatCurrency(overflow.balance) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn
          color="success"
          @click="handleTransactionDialog('deposit')"
          class="mb-2"
          >{{ $t('deposit') }}</v-btn
        >
        <v-btn
          color="warning"
          @click="handleTransactionDialog('withdraw')"
          class="mb-2"
          >{{ $t('withdraw') }}</v-btn
        >
        <v-btn color="info" @click="handleTransferDialog">{{
          $t('transfer')
        }}</v-btn>
      </v-col>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn @click="changeSettingsClicked" class="mb-2">{{
          $t('change-settings')
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="12">
        <TransactionLogs :showAll="false"
        />
      </v-col>
  
    </v-row>

    <ErrorDialog
      v-model="showErrorDialog"
      :error-message="errorMessage"
    ></ErrorDialog>
    <TransactionDialog
      v-model="showTransactionDialog"
      :action="currentActionType"
      :id="overflow.id"
      @confirm="handleTransactionConfirm"
    />
    <TransferDialog
      v-model="showTransferDialog"
      :sourceId="overflow.id"
      @confirm="handleTransferConfirm"
    ></TransferDialog>
  </v-container>
</template>
<script setup>
import { ref, computed } from 'vue'
import global from '@/global.js'
import router from '@/router/index.js'
import { formatCurrency } from '@/utils.js'
import {
  depositIntoMoneybox,
  getTransactionLogs,
  transferFromMoneyboxToMoneybox,
  withdrawFromMoneybox
} from '@/api.js'
import { useI18n } from 'vue-i18n'
import { APIError } from '@/customerrors'
import { useDisplay } from 'vuetify'

const display = ref(useDisplay())

// t used for dialogs, otherwise $t globally available
const { t } = useI18n({})

const overflow = computed(() => {
  return global.moneyboxes.find((moneybox) => moneybox.is_overflow === true)
})

const showTransactionDialog = ref(false)
const showTransferDialog = ref(false)

const currentActionType = ref('')

const showErrorDialog = ref(false)
const errorMessage = ref('')

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
        global.findMoneyboxById(overflow.value.id),
        transactionDetails.amount,
        transactionDetails.description
      )
      // update transaction logs
      await getTransactionLogs(global.findMoneyboxById(overflow.value.id))
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 404) {
          errorMessage.value = t('error-not-found', {
            name: t('overflow-envelope')
          })
        } else if (error.status === 405) {
          errorMessage.value = t('error-not-enough-money', {
            name: t('overflow-envelope')
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
        global.findMoneyboxById(overflow.value.id),
        transactionDetails.amount,
        transactionDetails.description
      )
      // update transaction logs
      await getTransactionLogs(global.findMoneyboxById(overflow.value.id))
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 404) {
          errorMessage.value = t('error-not-found', {
            name: t('overflow-envelope')
          })
        } else if (error.status === 405) {
          errorMessage.value = t('error-not-enough-money', {
            name: t('overflow-envelope')
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
      global.findMoneyboxById(overflow.value.id),
      transferSelection.amount,
      global.findMoneyboxById(transferSelection.selectedId),
      transferSelection.description
    )
    // update transaction logs
    await getTransactionLogs(global.findMoneyboxById(overflow.value.id))
    await getTransactionLogs(
      global.findMoneyboxById(transferSelection.selectedId)
    )
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 404) {
        errorMessage.value = t('error-not-found', {
          name: global.findMoneyboxById(overflow.value.id).name
        })
      } else if (error.status === 405) {
        errorMessage.value = t('error-not-enough-money', {
          name: global.findMoneyboxById(overflow.value.id).name
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

const changeSettingsClicked = () => {
  router.push({
    path: '/editoverflow'
  })
}

function viewCompleteClicked() {
  router.push({
    path: `/logs/overflow`
  })
}
</script>
<style scoped>
.pt-50-percent {
  padding-top: 50%; /* 2:1 Aspect Ratio */
}
.top-0 {
  top: 0;
}
</style>
