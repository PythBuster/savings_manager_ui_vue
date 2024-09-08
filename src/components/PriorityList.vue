<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 :class="display.mdAndUp ? 'text-h4' : 'text-h5'">
          {{ $t('priority-list') }}
        </h1>
      </v-col>
    </v-row>
    <v-row :class="display.mdAndUp ? 'mt-16' : ''">
      <v-col cols="12" sm="6">
        <v-card v-click-outside="unselectItems">
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="item.moneyboxId"
              :class="{ 'v-list-item--active': selectedIndex === index }"
              @click="selectItem(index)"
              draggable="true"
              @dragstart="dragStart(index)"
              @dragover.prevent
              @drop="drop(index)"
            >
              {{ item.name }} (ID: {{ item.moneyboxId }})
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-btn
              @click="moveUp"
              :disabled="selectedIndex === null || selectedIndex === 0"
            >
              {{ $t('up') }}</v-btn
            >
            <v-btn
              @click="moveDown"
              :disabled="
                selectedIndex === null || selectedIndex === items.length - 1
              "
              >{{ $t('down') }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-if="!display.mdAndUp" class="d-flex align-end justify-end">
        <v-btn @click="saveClicked">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="display.mdAndUp">
      <v-col class="d-flex justify-end">
        <v-btn @click="saveClicked">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import router from '@/router/index.js'
import { ref, onMounted } from 'vue'
import global from '@/global.js'
import { updatePrioritylist } from '@/api.js'
import { useDisplay } from 'vuetify'
import {
  getPrioritylist
} from '@/api.js'

const display = ref(useDisplay())

const items = ref([])

const selectedIndex = ref(null)

const selectItem = (index) => {
  selectedIndex.value = index
}

const unselectItems = () => {
  selectedIndex.value = null
}

const dragStart = (index) => {
  selectedIndex.value = index
}

const drop = (index) => {
  if (selectedIndex.value !== null) {
    const draggedItem = items.value.splice(selectedIndex.value, 1)[0]
    items.value.splice(index, 0, draggedItem)
  }
  selectedIndex.value = null
}

const moveUp = () => {
  const index = selectedIndex.value
  if (index > 0) {
    const itemToMove = items.value.splice(index, 1)[0]
    items.value.splice(index - 1, 0, itemToMove)
    selectedIndex.value = index - 1
  }
}

const moveDown = () => {
  const index = selectedIndex.value
  if (index !== null && index < items.value.length - 1) {
    const itemToMove = items.value.splice(index, 1)[0]
    items.value.splice(index + 1, 0, itemToMove)
    selectedIndex.value = index + 1
  }
}

async function saveClicked() {

  let newPrioritylist = [];

  for (let index = 0; index < items.value.length; index++) {
    const item = items.value[index]
    const newPriority = index + 1 // Calculate the new priority based on array position

      // Füge ein neues Objekt zur Liste hinzu
    newPrioritylist.push({
      priority: newPriority,
      moneyboxId: item.moneyboxId // Nutze moneyboxId statt id
    });
  }

  await updatePrioritylist(newPrioritylist)

  for (let index = 0; index < items.value.length; index++) {
    const item = items.value[index]
    const moneyboxInstance = global.findMoneyboxById(item.moneyboxId)
    const newPriority = index + 1 // Calculate the new priority based on array position

    if (moneyboxInstance) {
        try {
          // Update the moneybox with the new priority
          moneyboxInstance["priority"] = newPriority
        } catch (error) {
          console.error(
            `Failed to update priority for ${moneyboxInstance.name}:`,
            error
          )
        }
      } else {
        console.error(`Moneybox with id ${item.id} not found.`)
      }
  }

  router.push({
    path: '/'
  })
}

onMounted(async () => {
  try {
    const prioritylist = await getPrioritylist()
    items.value = prioritylist.map(
      ({ moneyboxId, name, priority }) => ({ moneyboxId, name, priority })
    ) // Extract needed properties
  } catch (error) {
    console.error('Failed to fetch priority list:', error)
  }
})
</script>
