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
              {{ $t('up') }}
            </v-btn>
            <v-btn
              @click="moveDown"
              :disabled="selectedIndex === null || selectedIndex === items.length - 1"
            >
              {{ $t('down') }}
            </v-btn>
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
import { ref, onMounted } from 'vue'
import router from '@/router/index.js'
import global from '@/global.js'
import { useDisplay } from 'vuetify'
import { getPrioritylist, updatePrioritylist } from '@/api.js'

const display = ref(useDisplay())

const items = ref([])
const selectedIndex = ref(null)

function selectItem(index) {
  selectedIndex.value = index
}

function unselectItems() {
  selectedIndex.value = null
}

function dragStart(index) {
  selectedIndex.value = index
}

function drop(index) {
  if (selectedIndex.value === null) return

  const draggedItem = items.value.splice(selectedIndex.value, 1)[0]
  items.value.splice(index, 0, draggedItem)
  selectedIndex.value = null
}

function moveUp() {
  const index = selectedIndex.value
  if (index > 0) {
    const [item] = items.value.splice(index, 1)
    items.value.splice(index - 1, 0, item)
    selectedIndex.value = index - 1
  }
}

function moveDown() {
  const index = selectedIndex.value
  if (index !== null && index < items.value.length - 1) {
    const [item] = items.value.splice(index, 1)
    items.value.splice(index + 1, 0, item)
    selectedIndex.value = index + 1
  }
}

async function saveClicked() {
  const newPrioritylist = items.value.map((item, index) => ({
    priority: index + 1,
    moneyboxId: item.moneyboxId
  }))

  try {
    await updatePrioritylist(newPrioritylist)
    // Update global moneyboxes priorities locally
    newPrioritylist.forEach(({ moneyboxId, priority }) => {
      const mb = global.findMoneyboxById(moneyboxId)
      if (mb) mb.priority = priority
    })
    router.push({ path: '/' })
  } catch (error) {
    console.error('Failed to update priorities:', error)
  }
}

onMounted(async () => {
  try {
    const prioritylist = await getPrioritylist()
    items.value = prioritylist.map(({ moneyboxId, name, priority }) => ({
      moneyboxId,
      name,
      priority
    }))
  } catch (error) {
    console.error('Failed to fetch priority list:', error)
  }
})
</script>
