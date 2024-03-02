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
    <v-dialog v-model="dialogVisible" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">{{
          $t('delete-envelope')
        }}</v-card-title>
        <v-card-text>
          <span class="subtitle-1">{{ $t('delete-envelope-question-1') }}</span>
          <span class="font-weight-bold">{{
            global.findMoneyboxById(id).name
          }}</span
          >{{ $t('delete-envelope-question-2') }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogVisible = false">{{
            $t('cancel')
          }}</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">{{
            $t('delete')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref } from 'vue'
import global from '@/global.js'
import router from '@/router'
import { formatCurrency } from '@/utils'
import { deleteMoneybox } from '@/api.js'

const dialogVisible = ref(false)

const props = defineProps({
  id: Number
})

async function changeSettingsClicked() {
  router.push({
    path: `/editenvelope/${props.id}`
  })
}

async function deleteClicked() {
  dialogVisible.value = true
}

async function confirmDelete() {
  router.push({
    path: '/'
  })
  await deleteMoneybox(global.findMoneyboxById(props.id))
  dialogVisible.value = false
}
</script>
