<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('settings') }}</h1>
      </v-col>
    </v-row>
    <v-row class="mt-16">
      <v-col cols="12" sm="6">
        <v-text-field :label="$t('envelope-name')" v-model="newTitle" />
        <CurrencyInput :label="$t('target-amount')" v-model="newTargetAmount" />
        <CurrencyInput :label="$t('savings-amount')" v-model="newSaveAmount" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          @click="saveClicked"
          :disabled="
            newSaveAmount === null || isNaN(newSaveAmount) || newTitle === ''
          "
          >{{ $t('save') }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import router from '@/router'
import global from '@/global.js'
import { ref } from 'vue'
import { updateMoneybox } from '@/api.js'

const props = defineProps({
  id: Number
})

const newTitle = ref(global.findMoneyboxById(props.id).name)
const newTargetAmount = ref(global.findMoneyboxById(props.id).goal)
const newSaveAmount = ref(global.findMoneyboxById(props.id).increment)

async function saveClicked() {
  await updateMoneybox(global.findMoneyboxById(props.id), newTitle.value)

  router.push({
    path: `/envelope/${props.id}`
  })
}
</script>
