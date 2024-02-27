import { NetworkError, DataError } from '@/customerrors.js'

const serverURL = import.meta.env.VITE_BACKEND_URL

const receiveJsonHeaders = new Headers({
  accept: 'application/json'
})

const sendReceiveJsonHeaders = new Headers({
  accept: 'application/json',
  'content-type': 'application/json'
})

function checkResponse(response) {
  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`
    throw new NetworkError(message)
  }
}

function validateMoneybox(jsonData) {
  if (!jsonData || Object.keys(jsonData).length === 0) {
    throw new DataError('No result from API')
  }
  if (
    !(Number.isInteger(jsonData.id) && jsonData.id > 0) ||
    !(typeof jsonData.name === 'string' && jsonData.name.trim().length > 0) ||
    !(Number.isInteger(jsonData.balance) && jsonData.balance >= 0)
  ) {
    throw new DataError('Invalid data from API')
  }
}

/**
 * Retrieves a list of moneyboxes from the server.
 * @returns {Promise<Object>} - A promise that resolves to the JSON data containing the list of moneyboxes.
 */
export async function getMoneyboxes() {
  try {
    const response = await fetch(`${serverURL}/api/moneyboxes`, {
      method: 'GET',
      headers: receiveJsonHeaders
    })

    checkResponse(response)

    const jsonData = await response.json()

    if (!jsonData || Object.keys(jsonData).length === 0) {
      throw new DataError('No result from API')
    }
    if (!jsonData.moneyboxes) {
      throw new DataError('Invalid data from API')
    }

    return jsonData
  } catch (error) {
    console.error(`${error.name}: ${error.message}`)
  }
}

/**
 * Retrieves details of a specific moneybox by its ID.
 * @param {number} moneybox_id - The ID of the moneybox to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the JSON data of the specified moneybox.
 */
export async function getMoneybox(moneybox_id) {
  try {
    const response = await fetch(`${serverURL}/api/moneybox/${moneybox_id}`, {
      method: 'GET',
      headers: receiveJsonHeaders
    })

    checkResponse(response)

    const jsonData = await response.json()

    validateMoneybox(jsonData)

    return jsonData
  } catch (error) {
    console.error(`${error.name}: ${error.message}`)
  }
}

/**
 * Updates the name of a specific moneybox.
 * @param {number} moneybox_id - The ID of the moneybox to update.
 * @param {string} newName - The new name for the moneybox.
 * @returns {Promise<Object>} - A promise that resolves to the JSON data of the updated moneybox.
 */
export async function updateMoneybox(moneybox_id, newName) {
  try {
    const response = await fetch(`${serverURL}/api/moneybox/${moneybox_id}`, {
      method: 'PATCH',
      headers: sendReceiveJsonHeaders,
      body: JSON.stringify({
        name: newName
      })
    })

    checkResponse(response)
    const jsonData = await response.json()

    validateMoneybox(jsonData)

    return jsonData
  } catch (error) {
    console.error(`${error.name}: ${error.message}`)
  }
}

/**
 * Adds a new moneybox with the specified name.
 * @param {string} name - The name of the new moneybox to create.
 * @returns {Promise<Object>} - A promise that resolves to the JSON data of the newly created moneybox.
 */
export async function addMoneybox(name) {
  try {
    const response = await fetch(`${serverURL}/api/moneybox`, {
      method: 'POST',
      headers: sendReceiveJsonHeaders,
      body: JSON.stringify({
        name: name
      })
    })

    checkResponse(response)

    const jsonData = await response.json()

    validateMoneybox(jsonData)

    return jsonData
  } catch (error) {
    console.error(`${error.name}: ${error.message}`)
  }
}

/**
 * Deletes a specific moneybox by its ID.
 * @param {number} moneybox_id - The ID of the moneybox to delete.
 * @returns {Promise<void>} - A promise that resolves when the moneybox is successfully deleted.
 */
export async function deleteMoneybox(moneybox_id) {
  try {
    const response = await fetch(`${serverURL}/api/moneybox/${moneybox_id}`, {
      method: 'DELETE',
      headers: receiveJsonHeaders
    })

    checkResponse(response)
  } catch (error) {
    console.error(`${error.name}: ${error.message}`)
  }
}

/**
 * Deposits a specified amount into a moneybox.
 * @param {number} moneybox_id - The ID of the moneybox to deposit into.
 * @param {number} balance - The amount to deposit.
 * @returns {Promise<Object>} - A promise that resolves to the JSON data of the moneybox after the deposit.
 */
export async function depositIntoMoneybox(moneybox_id, balance) {
  try {
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

    checkResponse(response)
    const jsonData = await response.json()

    validateMoneybox(jsonData)

    return jsonData
  } catch (error) {
    console.error(`${error.name}: ${error.message}`)
  }
}

/**
 * Withdraws a specified amount from a moneybox.
 * @param {number} moneybox_id - The ID of the moneybox to withdraw from.
 * @param {number} balance - The amount to withdraw.
 * @returns {Promise<Object>} - A promise that resolves to the JSON data of the moneybox after the withdrawal.
 */
export async function withdrawFromMoneybox(moneybox_id, balance) {
  try {
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

    checkResponse(response)
    const jsonData = await response.json()

    validateMoneybox(jsonData)

    return jsonData
  } catch (error) {
    console.error(`${error.name}: ${error.message}`)
  }
}

/**
 * Transfers a specified amount from one moneybox to another.
 * @param {number} moneybox_id - The ID of the source moneybox.
 * @param {number} balance - The amount to transfer.
 * @param {number} new_moneybox_id - The ID of the destination moneybox.
 * @returns {Promise<void>} - A promise that resolves when the transfer is successfully completed.
 */
export async function transferFromMoneyboxToMoneybox(
  moneybox_id,
  balance,
  new_moneybox_id
) {
  try {
    const response = await fetch(
      `${serverURL}/api/moneybox/${moneybox_id}/balance/transfer`,
      {
        method: 'POST',
        headers: sendReceiveJsonHeaders,
        body: JSON.stringify({
          balance: balance,
          to_moneybox_id: new_moneybox_id
        })
      }
    )

    checkResponse(response)
  } catch (error) {
    console.error(`${error.name}: ${error.message}`)
  }
}
