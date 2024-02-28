// Not using Pinia (for now at least), since there's not much global data to manage

import { reactive, readonly } from 'vue'

const moneyboxes = reactive([])

function setMoneyboxes(newMoneyboxes) {
  moneyboxes.splice(0, moneyboxes.length, ...newMoneyboxes)
}

function addMoneybox(newMoneybox) {
  moneyboxes.push(newMoneybox)
}

function deleteMoneybox(Moneybox) {
  const index = moneyboxes.findIndex((moneybox) => moneybox.id === Moneybox.id)
  moneyboxes.splice(index, 1)
}

export default {
  moneyboxes: readonly(moneyboxes),
  addMoneybox,
  deleteMoneybox,
  setMoneyboxes
}
