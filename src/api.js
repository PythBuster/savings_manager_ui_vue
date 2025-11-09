import { DataError, APIError } from '@/customerrors.js'
import {
  AppMetadata,
  Prioritylist,
  Moneybox,
  TransactionLogs,
  MoneyboxSavingsForecast
} from '@/models.js'
import global from '@/global.js'
import router from '@/router'

// --- Server URL ---
const serverURL = import.meta.env.VITE_BACKEND_URL

// --- Shared headers ---
const receiveJsonHeaders = new Headers({
  accept: 'application/json'
})

const sendReceiveJsonHeaders = new Headers({
  accept: 'application/json',
  'content-type': 'application/json'
})

// --- Redirect guard (prevents multiple concurrent redirects) ---
let isRedirecting = false

// --- Global fallback handler ---
async function handleApiFallback(error, context) {
  if (isRedirecting) return
  isRedirecting = true

  console.error(`Critical API failure during ${context}:`, error)
  global.moneyboxesLoaded = false

  try {
    await router.replace('/')
  } catch (fallbackError) {
    console.error('Router redirect failed, performing hard reload:', fallbackError)
    window.location.href = '/'
  } finally {
    isRedirecting = false
  }
}

// --- Helpers ---
async function checkResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  const isHtmlResponse = contentType.includes('text/html')

  // Detect HTML instead of JSON (e.g. unresolved route returning index.html)
  if (isHtmlResponse) {
    console.warn('Backend returned HTML instead of JSON – redirecting to root.')
    await handleApiFallback(
      new Error(`Unexpected HTML response at ${response.url}`),
      'checkResponse'
    )
    throw new APIError('Unexpected HTML response from backend', response.status)
  }

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
  try {
    const response = await fetch(url, options)
    await checkResponse(response)

    // If backend still sends HTML with 200 status
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('text/html')) {
      console.warn('Received HTML payload with 200 status – redirecting to root.')
      await handleApiFallback(
        new Error(`Invalid HTML payload for ${url}`),
        'fetchJson'
      )
      throw new APIError('Invalid HTML payload returned by backend')
    }

    return response.status === 204 ? null : await response.json()
  } catch (error) {
    await handleApiFallback(error, `fetching ${url}`)
    throw error
  }
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

  if (!jsonData?.moneyboxForecasts) return

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

export async function addMoneybox({ name, savingsAmount, savingsTarget, description }) {
  if (!name || savingsAmount === undefined) {
    throw new Error('Missing required fields for new moneybox.')
  }

  const jsonData = await fetchJson(`${serverURL}/api/moneybox`, {
    method: 'POST',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify({ name, savingsTarget, savingsAmount, description })
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
    global.settings.value.overflowMoneyboxAutomatedSavingsMode =
      jsonData.overflowMoneyboxAutomatedSavingsMode

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
