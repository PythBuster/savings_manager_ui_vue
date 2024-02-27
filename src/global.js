// Not using Pinia (for now at least), since there's not much global data to manage

import { reactive, readonly } from 'vue'

const moneyboxes = reactive([])

function updateMoneybox(id, key, value) {
  const index = moneyboxes.findIndex((item) => item.id === id)
  if (index !== -1) {
    moneyboxes[index][key] = value
  }
}

function setMoneyboxes(newMoneyboxes) {
  moneyboxes.splice(0, moneyboxes.length)

  for (const box of newMoneyboxes) {
    moneyboxes.push(box)
  }
}

export default {
  moneyboxes: readonly(moneyboxes),
  updateMoneybox,
  setMoneyboxes
}
