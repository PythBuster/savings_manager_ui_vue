// Not using Pinia (for now at least), since there's not much global data to manage

import { reactive, readonly } from 'vue'

// this reactive() tracks changes to the array itself, like adding/removing moneyboxes
const moneyboxes = reactive([])

const moneyboxesMap = new Map()
const moneyboxesLoaded = false

// reactive() below tracks changes to the moneybox instances themselves, like changing name or balance

function setMoneyboxes(newMoneyboxes) {
  moneyboxes.splice(0, moneyboxes.length)
  moneyboxesMap.clear()
  newMoneyboxes.forEach((moneybox) => {
    const reactiveMoneybox = reactive(moneybox)
    moneyboxes.push(reactiveMoneybox)
    moneyboxesMap.set(moneybox.id, reactiveMoneybox)
  })
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

export default {
  moneyboxes: readonly(moneyboxes),
  moneyboxesLoaded,
  addMoneybox,
  deleteMoneybox,
  setMoneyboxes,
  findMoneyboxById
}
