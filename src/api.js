import { DataError, APIError } from '@/customerrors.js'
import { Moneybox, TransactionLogs } from '@/models.js'
import global from '@/global.js'

const serverURL = import.meta.env.VITE_BACKEND_URL

const receiveJsonHeaders = new Headers({
  accept: 'application/json'
})

const sendReceiveJsonHeaders = new Headers({
  accept: 'application/json',
  'content-type': 'application/json'
})

async function checkResponse(response) {
  if (!response.ok) {
    let errorDetails = null
    if (response.status !== 500) {
      try {
        const errorResponse = await response.json()

        errorDetails = errorResponse
      } catch (error) {
        console.error('Error parsing error response:', error)
      }
    }

    const message = `${response.status} ${response.statusText}`
    throw new APIError(message, response.status, errorDetails)
  }
}

/**
 * Fetches moneyboxes from the server, converts them to Moneybox instances,
 * and updates the global store with these instances. Does not return any value.
 * @returns {Promise<void>} A promise that resolves when the moneyboxes have been fetched and the store has been updated.
 */
export async function getMoneyboxes() {
  const response = await fetch(`${serverURL}/api/moneyboxes`, {
    method: 'GET',
    headers: receiveJsonHeaders
  })

  if (response.status === 204) {
    return []
  }

  await checkResponse(response)

  const jsonData = await response.json()

  if (!jsonData || Object.keys(jsonData).length === 0) {
    throw new DataError('No result from API')
  }
  if (!jsonData.moneyboxes) {
    throw new DataError('Invalid data from API')
  }

  const modifiedMoneyboxes = jsonData.moneyboxes.map(Moneybox.fromJSON)

  global.setMoneyboxes(modifiedMoneyboxes)
}

/**
 * Retrieves details of a specific moneybox by its ID.
 * @param {number} moneybox_id - The ID of the moneybox to retrieve.
 * @returns {Promise<Moneybox>} - A promise that resolves to a Moneybox instance
 */
export async function getMoneybox(moneybox_id) {
  const response = await fetch(`${serverURL}/api/moneybox/${moneybox_id}`, {
    method: 'GET',
    headers: receiveJsonHeaders
  })

  await checkResponse(response)

  const jsonData = await response.json()

  return Moneybox.fromJSON(jsonData)
}

/**
 * Updates name, priority, goal increment or no_limit of a specific moneybox
 * @param {Moneybox} moneyboxInstance - The Moneybox instance to update.
 * @param {Object} options - The options object containing update parameters.
 * @param {string} [options.newName] - The new name for the moneybox. If undefined, the name won't be updated.
 * @param {number} [options.newPriority] - The new priority for the moneybox. If undefined, the priority won't be updated.
 * @param {goal}  [options.newGoal] - The new savings goal for the moneybox. If undefined, the savings goal won't be updated.
 * @param {increment}  [options.newIncrement] - The new savings increment for the moneybox. If undefined, the savings increment won't be updated.
 * @param {no_limit}  [options.newNoLimit] - The new no limit flag for the moneybox. If undefined, the no limit flag won't be updated.
 * @returns {Promise<void>} A promise that resolves once the moneybox has been updated.
 */
export async function updateMoneybox(
  moneyboxInstance,
  { newName, newPriority, newGoal, newIncrement, newNoLimit } = {}
) {
  const updates = {
    newName: 'name',
    newPriority: 'priority',
    newGoal: 'goal',
    newIncrement: 'increment',
    newNoLimit: 'no_limit'
  }

  const updatePayload = Object.entries({
    newName,
    newPriority,
    newGoal,
    newIncrement,
    newNoLimit
  }).reduce((payload, [key, value]) => {
    if (value !== undefined) {
      payload[updates[key]] = value
    }
    return payload
  }, {})

  if (Object.keys(updatePayload).length === 0) {
    throw new Error(
      'The options object cannot be empty. Please provide at least one field to update.'
    )
  }

  const moneybox_id = moneyboxInstance.id

  const response = await fetch(`${serverURL}/api/moneybox/${moneybox_id}`, {
    method: 'PATCH',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify(updatePayload)
  })

  await checkResponse(response)
  const jsonData = await response.json()

  Object.keys(updatePayload).forEach((updateKey) => {
    const originalKey = Object.keys(updates).find(
      (key) => updates[key] === updateKey
    )
    if (originalKey && jsonData[updateKey] !== undefined) {
      moneyboxInstance[updateKey] = jsonData[updateKey]
    }
  })
}

/**
 * Adds a new moneybox with the specified name, goal and increment, optionally sets no_limit and is_overflow
 * @param {Object} options - The options object containing additional parameters.
 * @param {string} options.name - The name of the new moneybox to create.
 * @param {number} options.goal - The savings goal for the new moneybox.
 * @param {number} options.increment - The savings increment for the new moneybox.
 * @param {boolean} [options.noLimit=false] - Flag to mark the new moneybox as having no savings limit.
 * @param {boolean} [options.isOverflow=false] - Flag to mark the new moneybox as overflow.
 * @returns {Promise<Moneybox>} - A promise that resolves to a new Moneybox instance
 */
export async function addMoneybox({
  name,
  goal,
  increment,
  noLimit = false,
  isOverflow = false
}) {
  if (Object.keys({ name, goal, increment }).length === 0) {
    throw new Error(
      'The options object has to include name, goal and increment.'
    )
  }

  const addPayload = {}

  addPayload.name = name
  addPayload.goal = goal
  addPayload.increment = increment
  addPayload.is_overflow = isOverflow
  addPayload.no_limit = noLimit

  const response = await fetch(`${serverURL}/api/moneybox`, {
    method: 'POST',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify(addPayload)
  })

  await checkResponse(response)

  const jsonData = await response.json()

  const newMoneybox = Moneybox.fromJSON(jsonData)

  global.addMoneybox(newMoneybox)

  return newMoneybox
}

/**
 * Deletes a specific moneybox
 * @param {Moneybox} moneyboxInstance - The Moneybox to delete
 * @returns {Promise<void>} - A promise that resolves when the moneybox is successfully deleted.
 */
export async function deleteMoneybox(moneyboxInstance) {
  if (!(moneyboxInstance instanceof Moneybox)) {
    throw new TypeError('Not an instance of Moneybox')
  }

  if (moneyboxInstance.is_overflow) {
    throw new Error('Deleting an overflow moneybox is not allowed.')
  }

  const moneybox_id = moneyboxInstance.id

  const response = await fetch(`${serverURL}/api/moneybox/${moneybox_id}`, {
    method: 'DELETE',
    headers: receiveJsonHeaders
  })

  await checkResponse(response)

  global.deleteMoneybox(moneyboxInstance)
}

/**
 * Deposits a specified amount into a moneybox.
 * @param {Moneybox} moneyboxInstance - The Moneybox to deposit into
 * @param {number} amount - The amount to deposit.
 * @param {string} description - The description of the transaction.
 * @returns {Promise<void>} - A promise that resolves when the moneybox has been updated in the store.
 */
export async function depositIntoMoneybox(
  moneyboxInstance,
  amount,
  description
) {
  const moneybox_id = moneyboxInstance.id

  const response = await fetch(
    `${serverURL}/api/moneybox/${moneybox_id}/balance/add`,
    {
      method: 'POST',
      headers: sendReceiveJsonHeaders,
      body: JSON.stringify({
        amount: amount,
        description: description
      })
    }
  )

  await checkResponse(response)
  const jsonData = await response.json()

  moneyboxInstance.balance = jsonData.balance
}

/**
 * Withdraws a specified amount from a moneybox.
 * @param {Moneybox} moneyboxInstance - The Moneybox to withdraw from
 * @param {number} amount - The amount to withdraw.
 * @param {string} description - The description of the transaction.
 * @returns {Promise<void>} - A promise that resolves when the moneybox has been updated in the store.
 */
export async function withdrawFromMoneybox(
  moneyboxInstance,
  amount,
  description
) {
  const moneybox_id = moneyboxInstance.id

  const response = await fetch(
    `${serverURL}/api/moneybox/${moneybox_id}/balance/sub`,
    {
      method: 'POST',
      headers: sendReceiveJsonHeaders,
      body: JSON.stringify({
        amount: amount,
        description: description
      })
    }
  )

  await checkResponse(response)
  const jsonData = await response.json()

  moneyboxInstance.balance = jsonData.balance
}

/**
 * Transfers a specified amount from one moneybox to another.
 * @param {Moneybox} sourceMoneyboxInstance - The source Moneybox
 * @param {number} amount - The amount to transfer.
 * @param {Moneybox} destinationMoneyboxInstance - The destination Moneybox
 * @param {string} description - The description of the transaction.
 * @returns {Promise<void>} - A promise that resolves when the transfer is successfully completed.
 */
export async function transferFromMoneyboxToMoneybox(
  sourceMoneyboxInstance,
  amount,
  destinationMoneyboxInstance,
  description
) {
  const sourceMoneyboxId = sourceMoneyboxInstance.id
  const destinationMoneyboxId = destinationMoneyboxInstance.id

  const response = await fetch(
    `${serverURL}/api/moneybox/${sourceMoneyboxId}/balance/transfer`,
    {
      method: 'POST',
      headers: sendReceiveJsonHeaders,
      body: JSON.stringify({
        amount: amount,
        to_moneybox_id: destinationMoneyboxId,
        description: description
      })
    }
  )

  await checkResponse(response)

  const newSourceBalance = sourceMoneyboxInstance.balance - amount
  sourceMoneyboxInstance.balance = newSourceBalance

  const newDestinationBalance = destinationMoneyboxInstance.balance + amount
  destinationMoneyboxInstance.balance = newDestinationBalance
}

/**
 * Fetches transaction logs for a specific moneybox and updates the corresponding Moneybox instance in the global store.
 * @param {Moneybox} moneyboxInstance - The Moneybox instance for which to fetch transaction logs
 * @returns {Promise<void>} - A promise that resolves when the transaction logs have been fetched and added to the Moneybox instance
 */
export async function getTransactionLogs(moneyboxInstance) {
  const moneybox_id = moneyboxInstance.id

  const response = await fetch(
    `${serverURL}/api/moneybox/${moneybox_id}/transactions`,
    {
      method: 'GET',
      headers: receiveJsonHeaders
    }
  )

  await checkResponse(response)

  if (response.status === 204) {
    return
  }

  const jsonData = await response.json()

  const transactionLogsInstance = TransactionLogs.fromJSON(jsonData)
  global.addTransactionLogsToMoneybox(moneybox_id, transactionLogsInstance)
}

/**
 * Fetches settings from the backend API and initializes or updates the local singleton instance of settings.
 * @returns {Promise<void>} A promise that resolves when the settings have been fetched and processed.
 */
export async function getSettings() {
  const response = await fetch(`${serverURL}/api/settings`, {
    method: 'GET',
    headers: receiveJsonHeaders
  })

  if (response.status === 204) {
    return
  }

  await checkResponse(response)

  const jsonData = await response.json()

  if (!jsonData || Object.keys(jsonData).length === 0) {
    throw new DataError('No result from API')
  }
  if (
    !jsonData.savings_amount &&
    !jsonData.savings_cycle &&
    !jsonData.savings_mode
  ) {
    throw new DataError('Invalid data from API')
  }

  global.createAndSetSettings(jsonData)
}

/**
 * Updates existing settings by calling the backend API with patch data. This function allows for partial updates, so savings_amount amd/or savings_cycle can be provided.
 * @param {Object} patchData The data to patch the settings with.
 * @param {number} [patchData.savings_amount] - The new savings amount to be set. Optional.
 * @param {string} [patchData.savings_cycle] - The new savings cycle to be set. Optional.
 * @param {string} [patchData.savings_mode] - The new savings mode to be set. Optional.
 * @returns {Promise<void>} A promise that resolves when the settings have been successfully updated.
 */
export async function updateSettings(patchData) {
  // savings_amount 0 is valid!
  if (
    (patchData.savings_amount === undefined ||
      patchData.savings_amount === null) &&
    !patchData.savings_cycle &&
    !patchData.savings_mode
  ) {
    throw new DataError(
      'Must provide savings_cycle, savings_amount or savings_mode'
    )
  }

  const response = await fetch(`${serverURL}/api/settings`, {
    method: 'PATCH',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify(patchData)
  })

  await checkResponse(response)

  const jsonData = await response.json()

  if (!jsonData || Object.keys(jsonData).length === 0) {
    throw new DataError('No result from API')
  }
  if (
    !jsonData.savings_amount &&
    !jsonData.savings_cycle &&
    !jsonData.savings_mode
  ) {
    throw new DataError('Invalid data from API')
  }

  // savings_amount 0 is valid!
  if (
    patchData.savings_amount !== undefined &&
    patchData.savings_amount !== null
  ) {
    global.settings.value.savings_amount = jsonData.savings_amount
  }
  if (patchData.savings_cycle) {
    global.settings.value.savings_cycle = jsonData.savings_cycle
  }
  if (patchData.savings_mode) {
    global.settings.value.savings_mode = jsonData.savings_mode
  }
}

/**
 * Creates settings by calling the backend API and initializes a singleton instance locally.
 * @param {Object} options The options for creating settings.
 * @param {number} options.savings_amount - The savings amount to be set.
 * @param {string} options.savings_cycle - The savings cycle to be set.
 * @param {string} options.savings_mode - The savings mode to be set.
 * @returns {Promise<void>} A promise that resolves when the settings have been created and initialized locally.
 */
export async function createSettings({
  savings_amount,
  savings_cycle,
  savings_mode
}) {
  const response = await fetch(`${serverURL}/api/settings`, {
    method: 'POST',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify({
      savings_amount: savings_amount,
      savings_cycle: savings_cycle,
      savings_mode: savings_mode
    })
  })

  await checkResponse(response)

  const jsonData = await response.json()

  if (!jsonData || Object.keys(jsonData).length === 0) {
    throw new DataError('No result from API')
  }
  if (
    !jsonData.savings_amount &&
    !jsonData.savings_cycle &&
    !jsonData.savings_mode
  ) {
    throw new DataError('Invalid data from API')
  }

  global.createAndSetSettings(jsonData)
}
