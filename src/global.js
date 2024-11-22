// Not using Pinia (for now at least), since there's not much global data to manage

import { reactive, readonly, ref } from 'vue'
import { Settings } from '@/models.js'

// Singleton instance, not created initially
let settingsInstance = ref(null)

function createAndSetSettings(jsonData) {
  // Singleton

  if (!settingsInstance.value) {
    const instance = Settings.fromJSON(jsonData)

    settingsInstance.value = reactive(instance)
  } else {
    throw new Error('Settings instance already exists')
  }
}

// this reactive() tracks changes to the array itself, like adding/removing moneyboxes
const moneyboxes = reactive([])

const moneyboxesMap = new Map()
const reachingSavingTargets = new Map()
const nextAutomatedSavingsMoneyboxes = new Map()

const moneyboxesLoaded = false

// reactive() below tracks changes to the moneybox instances themselves, like changing name or balance

function setMoneyboxes(newMoneyboxes) {
  // preserve existing moneyboxes in order not to lose their transaction logs, if already fetched
  newMoneyboxes.forEach((newMoneybox) => {
    if (!findMoneyboxById(newMoneybox.id)) {
      const reactiveMoneybox = reactive(newMoneybox)
      moneyboxes.push(reactiveMoneybox)
      moneyboxesMap.set(newMoneybox.id, reactiveMoneybox)
    }
  })
}

function setReachingSavigsTargets(newReachingSavingTargets) {
  newReachingSavingTargets.forEach(
    (newReachingSavingTarget) => {
      reachingSavingTargets.set(newReachingSavingTarget.moneyboxId, newReachingSavingTarget)
    }
  )
}

function setNextAutomatedSavingsMoneyboxes(newNextAutomatedSavingsMoneyboxes) {
  newNextAutomatedSavingsMoneyboxes.forEach(
    (newNextAutomatedSavingsMoneybox) => {
      nextAutomatedSavingsMoneyboxes.set(newNextAutomatedSavingsMoneybox.moneyboxId, newNextAutomatedSavingsMoneybox)
    }
  )
}

function addMoneybox(newMoneybox) {
  const reactiveMoneybox = reactive(newMoneybox)
  moneyboxes.push(reactiveMoneybox)
  moneyboxesMap.set(newMoneybox.id, reactiveMoneybox)
}

function deleteMoneybox(moneyboxToDelete) {
  const index = moneyboxes.findIndex(
    (moneybox) => moneybox.id === moneyboxToDelete.id
  )
  if (index !== -1) {
    moneyboxes.splice(index, 1)
    moneyboxesMap.delete(moneyboxToDelete.id)
  }
}

function findMoneyboxById(id) {
  return moneyboxesMap.get(id)
}

function findReachingSavingsTarget(id) {
  return reachingSavingTargets.get(id)
}

function findNextAutomatedSavingsMoneyboxes(id) {
  return nextAutomatedSavingsMoneyboxes.get(id)
}

/**
 * Adds a TransactionLogs instance to a specific Moneybox instance.
 * @param {Number} moneyboxId The ID of the Moneybox to which the TransactionLogs will be added
 * @param {TransactionLogs} transactionLogs The TransactionLogs instance to add
 */
function addTransactionLogsToMoneybox(moneyboxId, transactionLogs) {
  const moneybox = findMoneyboxById(moneyboxId)
  if (!moneybox) {
    return
  }
  moneybox.transactionLogs = transactionLogs
}

export default {
  moneyboxes: readonly(moneyboxes),
  moneyboxesLoaded,
  addMoneybox,
  deleteMoneybox,
  setMoneyboxes,
  setReachingSavigsTargets,
  setNextAutomatedSavingsMoneyboxes,
  findMoneyboxById,
  findReachingSavingsTarget,
  findNextAutomatedSavingsMoneyboxes,
  addTransactionLogsToMoneybox,
  settings: settingsInstance,
  createAndSetSettings
}
