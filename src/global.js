// Not using Pinia (for now at least), since there's not much global data to manage

import { reactive, readonly } from 'vue'

const moneyboxes = reactive([])
const moneyboxesMap = new Map()
const moneyboxesLoaded = false

function setMoneyboxes(newMoneyboxes) {
  moneyboxes.splice(0, moneyboxes.length, ...newMoneyboxes)
  moneyboxesMap.clear()
  newMoneyboxes.forEach((moneybox) => {
    moneyboxesMap.set(moneybox.id, moneybox)
  })
}

function addMoneybox(newMoneybox) {
  moneyboxes.push(newMoneybox)
  moneyboxesMap.set(newMoneybox.id, newMoneybox)
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
