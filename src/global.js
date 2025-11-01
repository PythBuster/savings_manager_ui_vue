// Not using Pinia (for now at least), since there's not much global data to manage

import { reactive, readonly, ref } from 'vue'
import { Settings } from '@/models.js'

// --- Settings Singleton ---
const settingsInstance = ref(null)

/**
 * Initializes a single Settings instance from JSON data.
 * Throws if already initialized (enforces singleton behavior).
 */
function createAndSetSettings(jsonData) {
  if (!settingsInstance.value) {
    const instance = Settings.fromJSON(jsonData)
    settingsInstance.value = reactive(instance)
  } else {
    throw new Error('Settings instance already exists')
  }
}

// --- Moneyboxes and Forecasts ---
const moneyboxes = reactive([]) // reactive array to track add/remove operations
const moneyboxesMap = new Map() // fast lookup by ID
const moneyboxesSavingsForecast = new Map() // forecast data keyed by ID

let moneyboxesLoaded = false // global indicator for API loading state

/**
 * Sets (adds) moneyboxes from the backend response without overwriting existing ones,
 * preserving transaction logs and reactivity.
 */
function setMoneyboxes(newMoneyboxes) {
  newMoneyboxes.forEach((newMoneybox) => {
    if (!findMoneyboxById(newMoneybox.id)) {
      const reactiveMoneybox = reactive(newMoneybox)
      moneyboxes.push(reactiveMoneybox)
      moneyboxesMap.set(newMoneybox.id, reactiveMoneybox)
    }
  })
}

/**
 * Sets savings forecast data for moneyboxes.
 */
function setMoneyboxesSavingsForecast(newMoneyboxesSavingsForecast) {
  newMoneyboxesSavingsForecast.forEach((forecast) => {
    moneyboxesSavingsForecast.set(forecast.moneyboxId, forecast)
  })
}

/**
 * Adds a new moneybox to the global store.
 */
function addMoneybox(newMoneybox) {
  const reactiveMoneybox = reactive(newMoneybox)
  moneyboxes.push(reactiveMoneybox)
  moneyboxesMap.set(newMoneybox.id, reactiveMoneybox)
}

/**
 * Deletes a moneybox from the global store.
 */
function deleteMoneybox(moneyboxToDelete) {
  const index = moneyboxes.findIndex(
    (moneybox) => moneybox.id === moneyboxToDelete.id
  )
  if (index !== -1) {
    moneyboxes.splice(index, 1)
    moneyboxesMap.delete(moneyboxToDelete.id)
  }
}

/**
 * Finds a moneybox by its ID.
 * @param {number} id
 * @returns {Object|undefined}
 */
function findMoneyboxById(id) {
  return moneyboxesMap.get(id)
}

/**
 * Finds a savings forecast entry by its moneybox ID.
 * @param {number} id
 * @returns {Object|undefined}
 */
function findMoneyboxesSavingsForecast(id) {
  return moneyboxesSavingsForecast.get(id)
}

/**
 * Adds a TransactionLogs instance to a specific Moneybox.
 * @param {number} moneyboxId
 * @param {TransactionLogs} transactionLogs
 */
function addTransactionLogsToMoneybox(moneyboxId, transactionLogs) {
  const moneybox = findMoneyboxById(moneyboxId)
  if (!moneybox) return
  moneybox.transactionLogs = transactionLogs
}

// --- Exports (keep shape identical) ---
export default {
  moneyboxes: readonly(moneyboxes),
  moneyboxesLoaded,
  addMoneybox,
  deleteMoneybox,
  setMoneyboxes,
  setMoneyboxesSavingsForecast,
  findMoneyboxById,
  findMoneyboxesSavingsForecast,
  addTransactionLogsToMoneybox,
  settings: settingsInstance,
  createAndSetSettings
}
