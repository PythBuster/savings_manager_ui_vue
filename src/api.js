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
