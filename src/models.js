export class Moneybox {
  /** @member {Number} balance */
  _balance
  /** @member {Number} goal */
  _goal
  /** @member {Number} id */
  _id
  /** @member {Number} increment */
  _increment
  /** @member {String} name */
  _name
  /** @member {Boolean} noLimit */
  _noLimit
  /** @member {Number} priority */
  _priority

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
    this.id = id
    this.name = name
    this.balance = balance
    this.goal = goal
    this.increment = increment
    this.noLimit = noLimit
    this.priority = priority
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

  get id() {
    return this._id
  }
  set id(value) {
    if (!Number.isInteger(value)) throw new TypeError('id must be an integer')
    this._id = value
  }

  get name() {
    return this._name
  }
  set name(value) {
    if (typeof value !== 'string') throw new TypeError('name must be a string')
    this._name = value
  }

  get balance() {
    return this._balance
  }
  set balance(value) {
    if (typeof value !== 'number' || value < 0)
      throw new RangeError('balance must be a number and >= 0')
    this._balance = value
  }

  get goal() {
    return this._goal
  }
  set goal(value) {
    if (isNaN(value))
      throw new TypeError('Expected value for goal to be a number')
    if (value < 0) throw new RangeError('Goal needs to be greater or equal 0')
    this._goal = value
  }

  get increment() {
    return this._increment
  }
  set increment(value) {
    if (typeof value !== 'number' || value < 0)
      throw new RangeError('increment must be a number and >= 0')
    this._increment = value
  }

  get noLimit() {
    return this._noLimit
  }
  set noLimit(value) {
    if (typeof value !== 'boolean')
      throw new TypeError('noLimit must be a boolean')
    this._noLimit = value
  }

  get priority() {
    return this._priority
  }
  set priority(value) {
    if (!Number.isInteger(value) || value < 1)
      throw new RangeError('priority must be an integer and >= 1')
    this._priority = value
  }
}
