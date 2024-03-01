<template>
  <v-container>
    <v-row>
      <v-col cols="auto" md="auto">
        <h1 class="text-h4">
          {{ $t('envelope') + global.findMoneyboxById(id).name }}
        </h1>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="auto">
        <v-table>
          <tbody>
            <tr>
              <td>{{ $t('balance') }}</td>
              <td>{{ global.findMoneyboxById(id).balance }}</td>
            </tr>
            <tr>
              <td>{{ $t('goal-amount') }}</td>
              <td>
                {{
                  !global.findMoneyboxById(id).noLimit
                    ? formatCurrency(global.findMoneyboxById(id).goal)
                    : $t('no-limit')
                }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('savings-amount') }}</td>
              <td>
                {{ formatCurrency(global.findMoneyboxById(id).increment) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn class="mb-2">{{ $t('deposit') }}</v-btn>
        <v-btn class="mb-2">{{ $t('withdraw') }}</v-btn>
        <v-btn>{{ $t('transfer') }}</v-btn>
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
      <v-col cols="12" md="8">
        <LastTransactions />
      </v-col>
      <v-col cols="12" md="4">
        <BarChart />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import global from '@/global.js'
import router from '@/router'
import { formatCurrency } from '@/utils'
import { deleteMoneybox } from '@/api.js'

const props = defineProps({
  id: Number
})

async function changeSettingsClicked() {
  router.push({
    path: `/editenvelope/${props.id}`
  })
}

// add are you sure dialog
async function deleteClicked() {
  // push first, otherwise logic needed to not render the deleted envelope before push activates
  router.push({
    path: '/'
  })
  await deleteMoneybox(global.findMoneyboxById(props.id))
}
</script>
