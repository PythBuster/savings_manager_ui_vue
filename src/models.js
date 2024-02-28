import { MoneyboxError } from '@/customerrors.js'

/**
 * Result page
 */
export class Moneybox {
  /** @member {Number} balance */
  balance
  /** @member {Number} goal */
  goal
  /** @member {Number} id */
  id
  /** @member {Number} increment */
  increment
  /** @member {String} name */
  name
  /** @member {Boolean} noLimit */
  noLimit
  /** @member {Number} priority */
  priority

  /**
   * Creates an instance of Moneybox.
   * @param {Number} balance - The current balance of the moneybox
   * @param {Number} goal - The savings goal for the moneybox
   * @param {Number} id - The unique identifier for the moneybox
   * @param {Number} increment - The savings increment value for the moneybox
   * @param {String} name - The name of the moneybox
   * @param {Boolean} noLimit - Indicates whether the moneybox has no saving limit.
   * @param {Number} priority - The priority of the moneybox
   */
  constructor(id, name, balance, goal, increment, noLimit, priority) {
    this.setId(id)
    this.setName(name)
    this.setBalance(balance)
    this.setGoal(goal)
    this.setIncrement(increment)
    this.setNoLimit(noLimit)
    this.setPriority(priority)
  }

  /**
   * Static method to create a Moneybox instance from a JSON object.
   * @param {Object} rawMoneybox A JSON object with properties matching the Moneybox class.
   * @returns {Moneybox} A new instance of Moneybox.
   */

  static fromJSON(rawMoneybox) {
    return new Moneybox(
      rawMoneybox.id,
      rawMoneybox.name,
      rawMoneybox.balance,
      rawMoneybox.goal,
      rawMoneybox.increment,
      rawMoneybox.noLimit,
      rawMoneybox.priority
    )
  }

  /**
   * Updates a property of the Moneybox instance with a new value.
   * @param {String} key The property name to update.
   * @param {*} value The new value for the property.
   */
  updateProperty(key, value) {
    const updateFunc = `set${key.charAt(0).toUpperCase() + key.slice(1)}`
    if (typeof this[updateFunc] === 'function') {
      this[updateFunc](value)
    } else {
      throw new MoneyboxError('invalid update function')
    }
  }

  setId(value) {
    if (Number.isInteger(value)) {
      this.id = value
    } else {
      throw new MoneyboxError('id must be an integer')
    }
  }

  setName(value) {
    if (typeof value === 'string') {
      this.name = value
    } else {
      throw new MoneyboxError('name must be a string')
    }
  }

  setBalance(value) {
    if (typeof value === 'number' && value >= 0) {
      this.balance = value
    } else {
      throw new MoneyboxError('balance must be a number and >= 0')
    }
  }

  setGoal(value) {
    if (typeof value === 'number' && value >= 0) {
      this.goal = value
    } else {
      throw new MoneyboxError('goal must be a number and >= 0')
    }
  }

  setIncrement(value) {
    if (typeof value === 'number' && value >= 0) {
      this.increment = value
    } else {
      throw new MoneyboxError('increment must be a number and >= 0')
    }
  }

  setNoLimit(value) {
    if (typeof value === 'boolean') {
      this.noLimit = value
    } else {
      throw new MoneyboxError('noLimit must be a boolean')
    }
  }

  setPriority(value) {
    if (Number.isInteger(value) && value >= 1) {
      this.priority = value
    } else {
      throw new MoneyboxError('priority must be an integer and >= 1')
    }
  }
}
