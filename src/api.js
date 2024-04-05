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
 * @async
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

  // Add dummy values, since API fetch not implemented yet
  const modifiedMoneyboxes = jsonData.moneyboxes
    .map((moneybox) => ({
      ...moneybox,
      goal: 0.0,
      increment: 0.0,
      no_limit: true
    }))
    .map(Moneybox.fromJSON)

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

  // Add dummy values, since API fetch not implemented yet
  jsonData.goal = 0.0
  jsonData.increment = 0.0
  jsonData.no_limit = true

  return Moneybox.fromJSON(jsonData)
}

/**
 * Updates name and/or priority of a specific moneybox
 * @param {Moneybox} moneyboxInstance - The Moneybox instance to update.
 * @param {string} newName - The new name for the moneybox. If null, the name won't be updated.
 * @param {number} [newPriority] - The new priority for the moneybox. If undefined, the priority won't be updated.
 * @returns {Promise<void>} A promise that resolves once the moneybox has been updated.
 */
export async function updateMoneybox(moneyboxInstance, newName, newPriority) {
  const moneybox_id = moneyboxInstance.id
  const updatePayload = {}

  if (newName !== null) {
    updatePayload.name = newName
  }

  if (typeof newPriority !== 'undefined') {
    updatePayload.priority = newPriority
  }

  const response = await fetch(`${serverURL}/api/moneybox/${moneybox_id}`, {
    method: 'PATCH',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify(updatePayload)
  })

  await checkResponse(response)
  const jsonData = await response.json()

  if (newName !== null) {
    moneyboxInstance.name = jsonData.name
  }
  if (typeof newPriority !== 'undefined') {
    moneyboxInstance.priority = jsonData.priority
  }
}

/**
 * Adds a new moneybox with the specified name and optionally marks it as overflow.
 * @param {string} name - The name of the new moneybox to create.
 * @param {boolean} [isOverflow=false] - Flag to mark the new moneybox as overflow.
 * @returns {Promise<Moneybox>} - A promise that resolves to a new Moneybox instance
 */
export async function addMoneybox(name, isOverflow = false) {
  const response = await fetch(`${serverURL}/api/moneybox`, {
    method: 'POST',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify({
      name: name,
      is_overflow: isOverflow
    })
  })

  await checkResponse(response)

  const jsonData = await response.json()

  // Add dummy values, since API fetch not implemented yet
  jsonData.goal = 0.0
  jsonData.increment = 0.0
  jsonData.no_limit = true

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

  await checkResponse(response) // This will throw if the response is not OK

  if (response.status === 204) {
    return
  }

  const jsonData = await response.json()

  // Assuming the API now returns transaction_logs with a valid transaction_time
  // No need to modify the transaction logs, directly use the data from the API
  const transactionLogsInstance = TransactionLogs.fromJSON(jsonData)
  global.addTransactionLogsToMoneybox(moneybox_id, transactionLogsInstance)
}
