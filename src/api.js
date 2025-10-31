import { DataError, APIError } from '@/customerrors.js'
import {
  AppMetadata,
  Prioritylist,
  Moneybox,
  TransactionLogs,
  MoneyboxSavingsForecast
} from '@/models.js'
import global from '@/global.js'

const serverURL = import.meta.env.VITE_BACKEND_URL

// --- shared headers ---
const receiveJsonHeaders = new Headers({
  accept: 'application/json'
})

const sendReceiveJsonHeaders = new Headers({
  accept: 'application/json',
  'content-type': 'application/json'
})

// --- helpers ---
async function checkResponse(response) {
  if (!response.ok) {
    let errorDetails = null
    if (response.status !== 500) {
      try {
        errorDetails = await response.json()
      } catch (error) {
        console.warn('Failed to parse error details:', error)
      }
    }
    const message = `${response.status} ${response.statusText}`
    throw new APIError(message, response.status, errorDetails)
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options)
  await checkResponse(response)
  return response.status === 204 ? null : await response.json()
}

// --- API functions ---

export async function getMoneyboxes() {
  const jsonData = await fetchJson(`${serverURL}/api/moneyboxes`, {
    method: 'GET',
    headers: receiveJsonHeaders
  })

  if (!jsonData?.moneyboxes) throw new DataError('Invalid data from API')

  const boxes = jsonData.moneyboxes.map(Moneybox.fromJSON)
  global.setMoneyboxes(boxes)
}

export async function getMoneyboxesSavingsForecast() {
  const jsonData = await fetchJson(`${serverURL}/api/moneyboxes/savings_forecast`, {
    method: 'GET',
    headers: receiveJsonHeaders
  })

  if (!jsonData?.moneyboxForecasts) throw new DataError('Invalid data from API')

  const forecasts = jsonData.moneyboxForecasts.map(MoneyboxSavingsForecast.fromJSON)
  global.setMoneyboxesSavingsForecast(forecasts)
}

export async function getPrioritylist() {
  const jsonData = await fetchJson(`${serverURL}/api/prioritylist`, {
    method: 'GET',
    headers: receiveJsonHeaders
  })
  return jsonData.prioritylist.map(Prioritylist.fromJSON)
}

export async function updatePrioritylist(newPrioritylist) {
  const response = await fetchJson(`${serverURL}/api/prioritylist`, {
    method: 'PATCH',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify({ prioritylist: newPrioritylist })
  })
  return response.prioritylist.map(Prioritylist.fromJSON)
}

export async function getMoneybox(moneybox_id) {
  const jsonData = await fetchJson(`${serverURL}/api/moneybox/${moneybox_id}`, {
    method: 'GET',
    headers: receiveJsonHeaders
  })
  return Moneybox.fromJSON(jsonData)
}

export async function updateMoneybox(moneyboxInstance, {
  newName,
  newDescription,
  newSavingsTarget,
  newSavingsAmount
} = {}) {
  const updatesMap = {
    newName: 'name',
    newDescription: 'description',
    newSavingsTarget: 'savingsTarget',
    newSavingsAmount: 'savingsAmount'
  }

  const updatePayload = Object.entries({
    newName,
    newDescription,
    newSavingsTarget,
    newSavingsAmount
  }).reduce((payload, [key, value]) => {
    if (value !== undefined) payload[updatesMap[key]] = value
    return payload
  }, {})

  if (!Object.keys(updatePayload).length) {
    throw new Error('Empty options object. Provide at least one field to update.')
  }

  const jsonData = await fetchJson(`${serverURL}/api/moneybox/${moneyboxInstance.id}`, {
    method: 'PATCH',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify(updatePayload)
  })

  Object.keys(updatePayload).forEach(updateKey => {
    const originalKey = Object.keys(updatesMap).find(k => updatesMap[k] === updateKey)
    if (originalKey && jsonData[updateKey] !== undefined) {
      moneyboxInstance[updateKey] = jsonData[updateKey]
    }
  })
}

export async function addMoneybox({ name, savingsAmount, savingsTarget }) {
  if (!name || savingsAmount === undefined) {
    throw new Error('Missing required fields for new moneybox.')
  }

  const jsonData = await fetchJson(`${serverURL}/api/moneybox`, {
    method: 'POST',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify({ name, savingsTarget, savingsAmount })
  })

  const newBox = Moneybox.fromJSON(jsonData)
  global.addMoneybox(newBox)
  return newBox
}

export async function deleteMoneybox(moneyboxInstance) {
  if (!(moneyboxInstance instanceof Moneybox)) {
    throw new TypeError('Not an instance of Moneybox')
  }
  if (moneyboxInstance.is_overflow) {
    throw new Error('Deleting an overflow moneybox is not allowed.')
  }

  await fetchJson(`${serverURL}/api/moneybox/${moneyboxInstance.id}`, {
    method: 'DELETE',
    headers: receiveJsonHeaders
  })
  global.deleteMoneybox(moneyboxInstance)
}

export async function depositIntoMoneybox(moneyboxInstance, amount, description) {
  const jsonData = await fetchJson(
    `${serverURL}/api/moneybox/${moneyboxInstance.id}/deposit`,
    {
      method: 'POST',
      headers: sendReceiveJsonHeaders,
      body: JSON.stringify({ amount, description })
    }
  )
  moneyboxInstance.balance = jsonData.balance
}

export async function withdrawFromMoneybox(moneyboxInstance, amount, description) {
  const jsonData = await fetchJson(
    `${serverURL}/api/moneybox/${moneyboxInstance.id}/withdraw`,
    {
      method: 'POST',
      headers: sendReceiveJsonHeaders,
      body: JSON.stringify({ amount, description })
    }
  )
  moneyboxInstance.balance = jsonData.balance
}

export async function transferFromMoneyboxToMoneybox(source, amount, destination, description) {
  await fetchJson(`${serverURL}/api/moneybox/${source.id}/transfer`, {
    method: 'POST',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify({
      amount,
      toMoneyboxId: destination.id,
      description
    })
  })

  source.balance -= amount
  destination.balance += amount
}

export async function getTransactionLogs(moneyboxInstance) {
  const jsonData = await fetchJson(
    `${serverURL}/api/moneybox/${moneyboxInstance.id}/transactions`,
    { method: 'GET', headers: receiveJsonHeaders }
  )

  if (!jsonData) return

  const logs = TransactionLogs.fromJSON(jsonData)
  global.addTransactionLogsToMoneybox(moneyboxInstance.id, logs)
}

export async function getAppMetadata() {
  const jsonData = await fetchJson(`${serverURL}/api/app/metadata`, {
    method: 'GET',
    headers: receiveJsonHeaders
  })
  if (!jsonData) throw new DataError('No result from API')
  return AppMetadata.fromJSON(jsonData)
}

export async function getSettings() {
  const jsonData = await fetchJson(`${serverURL}/api/settings`, {
    method: 'GET',
    headers: receiveJsonHeaders
  })
  if (!jsonData) return
  global.createAndSetSettings(jsonData)
}

export async function updateSettings(patchData) {
  const jsonData = await fetchJson(`${serverURL}/api/settings`, {
    method: 'PATCH',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify(patchData)
  })

  if (patchData.savingsAmount !== undefined)
    global.settings.value.savingsAmount = jsonData.savingsAmount

  if (patchData.isAutomatedSavingActive !== undefined)
    global.settings.value.isAutomatedSavingActive = jsonData.isAutomatedSavingActive

  if (patchData.sendReportsViaEmail !== undefined)
    global.settings.value.sendReportsViaEmail = jsonData.sendReportsViaEmail

  if (patchData.overflowMoneyboxAutomatedSavingsMode !== undefined)
    global.settings.value.overflowMoneyboxAutomatedSavingsMode = jsonData.overflowMoneyboxAutomatedSavingsMode

  if (patchData.userEmailAddress !== undefined)
    global.settings.value.userEmailAddress = jsonData.userEmailAddress
}

export async function createSettings({ savingsAmount }) {
  const jsonData = await fetchJson(`${serverURL}/api/settings`, {
    method: 'POST',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify({ savings_amount: savingsAmount })
  })

  if (!jsonData?.savings_amount) throw new DataError('Invalid data from API')
  global.createAndSetSettings(jsonData)
}
