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
        <CurrencyInput :label="$t('savings-amount2')" v-model="newSaveAmount" />
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
import { ref, computed } from 'vue'

const index = computed(() =>
  global.moneyboxes.findIndex((item) => item.id === props.id)
)

const props = defineProps({
  id: Number
})

const newTitle = ref(global.moneyboxes[index.value].name)
const newTargetAmount = ref(global.moneyboxes[index.value].goal)
const newSaveAmount = ref(global.moneyboxes[index.value].increment)

function saveClicked() {
  router.push({
    path: `/envelope/${props.id}`
  })
}
</script>
