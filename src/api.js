import { DataError, APIError } from '@/customerrors.js'
import { Moneybox } from '@/models.js'
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
    .map((moneybox, index) => ({
      ...moneybox,
      goal: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
      increment: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
      noLimit: Math.random() < 0.5,
      priority: index + 1
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

  return Moneybox.fromJSON(jsonData)
}

/**
 * Updates the name of a specific moneybox
 * @param {Moneybox} moneyboxInstance - The Moneybox instance to update.
 * @param {string} newName - The new name for the moneybox.
 * @returns {Promise<void>} A promise that resolves once the moneybox has been updated.
 */
export async function updateMoneybox(moneyboxInstance, newName) {
  const moneybox_id = moneyboxInstance.id
  const response = await fetch(`${serverURL}/api/moneybox/${moneybox_id}`, {
    method: 'PATCH',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify({
      name: newName
    })
  })

  await checkResponse(response)
  const jsonData = await response.json()

  moneyboxInstance.name = jsonData.name
}

/**
 * Adds a new moneybox with the specified name.
 * @param {string} name - The name of the new moneybox to create.
 * @returns {Promise<Moneybox>} - A promise that resolves to a new Moneybox instance
 */
export async function addMoneybox(name) {
  const response = await fetch(`${serverURL}/api/moneybox`, {
    method: 'POST',
    headers: sendReceiveJsonHeaders,
    body: JSON.stringify({
      name: name
    })
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
 * @param {number} balance - The amount to deposit.
 * @returns {Promise<void>} - A promise that resolves when the moneybox has been updated in the store.
 */
export async function depositIntoMoneybox(moneyboxInstance, balance) {
  const moneybox_id = moneyboxInstance.id

  const response = await fetch(
    `${serverURL}/api/moneybox/${moneybox_id}/balance/add`,
    {
      method: 'POST',
      headers: sendReceiveJsonHeaders,
      body: JSON.stringify({
        balance: balance
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
 * @param {number} balance - The amount to withdraw.
 * @returns {Promise<void>} - A promise that resolves when the moneybox has been updated in the store.
 */
export async function withdrawFromMoneybox(moneyboxInstance, balance) {
  const moneybox_id = moneyboxInstance.id

  const response = await fetch(
    `${serverURL}/api/moneybox/${moneybox_id}/balance/sub`,
    {
      method: 'POST',
      headers: sendReceiveJsonHeaders,
      body: JSON.stringify({
        balance: balance
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
 * @param {number} balance - The amount to transfer.
 * @param {Moneybox} destinationMoneyboxInstance - The destination Moneybox
 * @returns {Promise<void>} - A promise that resolves when the transfer is successfully completed.
 */
export async function transferFromMoneyboxToMoneybox(
  sourceMoneyboxInstance,
  balance,
  destinationMoneyboxInstance
) {
  const sourceMoneyboxId = sourceMoneyboxInstance.id
  const destinationMoneyboxId = destinationMoneyboxInstance.id

  const response = await fetch(
    `${serverURL}/api/moneybox/${sourceMoneyboxId}/balance/transfer`,
    {
      method: 'POST',
      headers: sendReceiveJsonHeaders,
      body: JSON.stringify({
        balance: balance,
        to_moneybox_id: destinationMoneyboxId
      })
    }
  )

  await checkResponse(response)

  // API does not return updated balances, so we have to calculate them manually
  // Consider refetching the moneyboxes from the server instead
  const newSourceBalance = sourceMoneyboxInstance.balance - balance
  sourceMoneyboxInstance.balance = newSourceBalance

  const newDestinationBalance = destinationMoneyboxInstance.balance + balance
  destinationMoneyboxInstance.balance = newDestinationBalance
}
