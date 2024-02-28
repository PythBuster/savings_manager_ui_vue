// Not using Pinia (for now at least), since there's not much global data to manage

import { reactive, readonly } from 'vue'

const moneyboxes = reactive([])

function updateMoneybox(id, key, value) {
  const index = moneyboxes.findIndex((item) => item.id === id)
  if (index !== -1) {
    moneyboxes[index].updateProperty(key, value)
  }
}

function setMoneyboxes(newMoneyboxes) {
  moneyboxes.splice(0, moneyboxes.length, ...newMoneyboxes)
}

export default {
  moneyboxes: readonly(moneyboxes),
  updateMoneybox,
  setMoneyboxes
}
