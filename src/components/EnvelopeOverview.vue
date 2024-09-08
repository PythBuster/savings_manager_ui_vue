<template>
  <v-container>
    <v-row
      v-if="global.findMoneyboxById(id)"
      class="d-flex justify-space-between align-center"
    >
      <v-col cols="auto" md="auto">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'">
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
              <td>{{ $t('savings-target') }}</td>
              <td>
                {{
                  global.findMoneyboxById(id).savingsTarget !== null
                    ? formatCurrency(global.findMoneyboxById(id).savingsTarget)
                    : $t('no-limit')
                }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('savings-amount') }}:</td>
              <td>
                {{ formatCurrency(global.findMoneyboxById(id).savingsAmount) }}
              </td>
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
      <v-col v-if="global.findMoneyboxById(id).priority != 0" cols="auto" class="d-flex flex-column">
        <v-btn @click="changeSettingsClicked" class="mb-2">{{
          $t('change-settings')
        }}</v-btn>
        <v-btn @click="deleteClicked" color="error">{{
          $t('delete-envelope')
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="9">
        <TransactionLogs :id="id" :showAll="false" />
      </v-col>
      
    </v-row>
    <v-dialog
      v-if="global.findMoneyboxById(id)"
      v-model="showDeleteDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>{{ $t('delete-envelope') }}</v-card-title>
        <v-card-text>
          {{ $t('delete-envelope-question-1') }}
          <span class="font-weight-bold">{{
            global.findMoneyboxById(id).name
          }}</span
          >{{ $t('delete-envelope-question-2') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="surface-variant" @click="showDeleteDialog = false">{{
            $t('cancel')
          }}</v-btn>
          <v-btn color="error" @click="handleDeleteConfirm">{{
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
  withdrawFromMoneybox,
  updateMoneybox
} from '@/api.js'
import { useI18n } from 'vue-i18n'
import { APIError } from '@/customerrors.js'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const display = ref(useDisplay())

// t used for dialogs, otherwise $t globally available
const { t } = useI18n({})

const showDeleteDialog = ref(false)

const props = defineProps({
  id: Number
})

const id = computed(() => props.id || route.params.id); // Nutzt die ID aus den Props oder der Route

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
    path: `/editenvelope/${id.value}`
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
        global.findMoneyboxById(id.value),
        transactionDetails.amount,
        transactionDetails.description
      )
      // update transaction logs
      await getTransactionLogs(global.findMoneyboxById(id.value))
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 404) {
          errorMessage.value = t('error-not-found', {
            name: global.findMoneyboxById(id.value).name
          })
        } else if (error.status === 405) {
          errorMessage.value = t('error-not-enough-money', {
            name: global.findMoneyboxById(id.value).name
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
        global.findMoneyboxById(id.value),
        transactionDetails.amount,
        transactionDetails.description
      )
      // update transaction logs
      await getTransactionLogs(global.findMoneyboxById(id.value))
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 404) {
          errorMessage.value = t('error-not-found', {
            name: global.findMoneyboxById(id.value).name
          })
        } else if (error.status === 405) {
          errorMessage.value = t('error-not-enough-money', {
            name: global.findMoneyboxById(id.value).name
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
      global.findMoneyboxById(id.value),
      transferSelection.amount,
      global.findMoneyboxById(transferSelection.selectedId),
      transferSelection.description
    )
    // update transaction logs
    await getTransactionLogs(global.findMoneyboxById(id.value))
    await getTransactionLogs(
      global.findMoneyboxById(transferSelection.selectedId)
    )
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 404) {
        errorMessage.value = t('error-not-found', {
          name: global.findMoneyboxById(id.value).name
        })
      } else if (error.status === 405) {
        errorMessage.value = t('error-not-enough-money', {
          name: global.findMoneyboxById(id.value).name
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
  const deletedMoneyboxId = id.value
  const deletedMoneybox = global.findMoneyboxById(deletedMoneyboxId)

  if (deletedMoneybox.balance > 0) {
    errorMessage.value = t('error-delete-with-balance')
    showErrorDialog.value = true
  } else {
    try {
      const deletedMoneyboxPriority = deletedMoneybox
        ? deletedMoneybox.priority
        : null

      await deleteMoneybox(deletedMoneybox)

      if (deletedMoneyboxPriority !== null) {
        // Adjust priorities for remaining moneyboxes
        // global.findMoneyboxById() needed for mutability and reactivity
        const moneyboxesToUpdate = global.moneyboxes
          .filter((mb) => mb.priority > deletedMoneyboxPriority)
          .map((mb) => global.findMoneyboxById(mb.id))

        for (const moneybox of moneyboxesToUpdate) {
          const updatedPriority = moneybox.priority - 1
          await updateMoneybox(moneybox, { newPriority: updatedPriority })
        }
      }

      showDeleteDialog.value = false

      router.back();

    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 404) {
          errorMessage.value = t('error-not-found', {
            name: global.findMoneyboxById(id.value).name
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
    path: `/logs/${id.value}`
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
