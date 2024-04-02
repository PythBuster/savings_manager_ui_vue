import { isValidISO8601 } from '@/utils.js'

export class Moneybox {
  /** @member {Number} id */
  _id
  /** @member {String} name */
  _name
  /** @member {Number} balance */
  _balance
  /** @member {String} created_at */
  _created_at
  /** @member {String} modified_at */
  _modified_at
  /** @member {Number} goal */
  _goal
  /** @member {Number} increment */
  _increment
  /** @member {Boolean} noLimit */
  _noLimit
  /** @member {Number} priority */
  _priority
  /** @member {TransactionLogs|null} transactionLogs */
  _transactionLogs

  /**
   * Creates an instance of Moneybox.
   * @param {Number} id - The unique identifier for the moneybox
   * @param {String} name - The name of the moneybox
   * @param {Number} balance - The current balance of the moneybox
   * @param {String} created_at - The creation ISO8601 time/date of the moneybox
   * @param {String} modified_at - The modification ISO8601 time/date of the moneybox
   * @param {Number} goal - The savings goal for the moneybox
   * @param {Number} increment - The savings increment value for the moneybox
   * @param {Boolean} noLimit - Indicates whether the moneybox has no saving limit.
   * @param {Number} priority - The priority of the moneybox
   * @param {TransactionLogs|null} transactionLogs - The transaction logs for the moneybox - null if not initialized
   */
  constructor(
    id,
    name,
    balance,
    created_at,
    modified_at,
    goal,
    increment,
    noLimit,
    priority,
    transactionLogs = null
  ) {
    this.id = id
    this.name = name
    this.balance = balance
    this.created_at = created_at
    this.modified_at = modified_at
    this.goal = goal
    this.increment = increment
    this.noLimit = noLimit
    this.priority = priority
    this.transactionLogs = transactionLogs
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
      rawMoneybox.created_at,
      rawMoneybox.modified_at,
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

  get created_at() {
    return this._created_at
  }
  set created_at(value) {
    if (!isValidISO8601(value)) {
      throw new TypeError('created_at must be in ISO8601 format')
    }
    this._created_at = value
  }

  get modified_at() {
    return this._modified_at
  }
  set modified_at(value) {
    if (!isValidISO8601(value) && value !== null) {
      throw new TypeError('modified_at must be in ISO8601 format')
    }
    this._modified_at = value
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

  get transactionLogs() {
    return this._transactionLogs
  }
  set transactionLogs(value) {
    if (value !== null && !(value instanceof TransactionLogs)) {
      throw new TypeError(
        'transactionLogs must be an instance of TransactionLogs or null'
      )
    }
    this._transactionLogs = value
  }
}

export class TransactionLogsEntry {
  /** @member {Number} id */
  _id
  /** @member {Number} moneybox_id */
  _moneybox_id
  /** @member {Number} counterparty_moneybox_id */
  _counterparty_moneybox_id
  /** @member {Number} amount */
  _amount
  /** @member {Number} balance */
  _balance
  /** @member {String} description */
  _description
  /** @member {String} transaction_trigger */
  _transaction_trigger
  /** @member {String} transaction_type */
  _transaction_type
  /** @member {String} counterparty_moneybox_name */
  _counterparty_moneybox_name
  /** @member {String} created_at */
  _created_at

  /**
   * Creates an instance of TransactionLogsEntry.
   * @param {Number} id - The unique identifier for the transaction
   * @param {Number} moneybox_id - The moneybox id of the transaction
   * @param {Number|null} counterparty_moneybox_id - The counterparty moneybox id of the transaction (for transfer) - null if not applicable (for deposit/withdrawal)
   * @param {Number} amount - The amount of the transaction - can be negative for withdrawal/transfer
   * @param {Number} balance - The balance of the moneybox after the transaction
   * @param {String} description - The description of the transaction
   * @param {String} transaction_trigger - The trigger of the transaction - 'manually' or 'automatically'
   * @param {String} transaction_type - The type of the transaction = 'direct' or 'distribution'
   * @param {String} counterparty_moneybox_name - The name of the counterparty moneybox
   * @param {String} created_at - The creation ISO8601 time/date of the transaction
   */
  constructor(
    id,
    moneybox_id,
    counterparty_moneybox_id,
    amount,
    balance,
    description,
    transaction_trigger,
    transaction_type,
    counterparty_moneybox_name,
    created_at
  ) {
    this.id = id
    this.moneybox_id = moneybox_id
    this.counterparty_moneybox_id = counterparty_moneybox_id
    this.amount = amount
    this.balance = balance
    this.description = description
    this.transaction_trigger = transaction_trigger
    this.transaction_type = transaction_type
    this.counterparty_moneybox_name = counterparty_moneybox_name
    this.created_at = created_at
  }

  get id() {
    return this._id
  }
  set id(value) {
    if (!Number.isInteger(value)) throw new TypeError('id must be an integer')
    this._id = value
  }

  get moneybox_id() {
    return this._moneybox_id
  }
  set moneybox_id(value) {
    if (!Number.isInteger(value))
      throw new TypeError('moneybox_id must be an integer')
    this._moneybox_id = value
  }

  get counterparty_moneybox_id() {
    return this._counterparty_moneybox_id
  }
  set counterparty_moneybox_id(value) {
    if (value !== null && !Number.isInteger(value))
      throw new TypeError('counterparty_moneybox_id must be an integer or null')
    this._counterparty_moneybox_id = value
  }

  get amount() {
    return this._amount
  }
  set amount(value) {
    if (typeof value !== 'number')
      throw new TypeError('amount must be a number')
    this._amount = value
  }

  get balance() {
    return this._balance
  }
  set balance(value) {
    if (typeof value !== 'number' || value < 0)
      throw new TypeError('balance must be a number and >= 0')
    this._balance = value
  }

  get description() {
    return this._description
  }
  set description(value) {
    if (typeof value !== 'string')
      throw new TypeError('description must be a string')
    this._description = value
  }

  get transaction_trigger() {
    return this._transaction_trigger
  }
  set transaction_trigger(value) {
    if (value !== 'manually' && value !== 'automatically')
      throw new TypeError(
        'transaction_trigger must be "manually" or "automatically"'
      )
    this._transaction_trigger = value
  }

  get transaction_type() {
    return this._transaction_type
  }
  set transaction_type(value) {
    if (value !== 'direct' && value !== 'distribution')
      throw new TypeError('transaction_type must be "direct" or "distribution"')
    this._transaction_type = value
  }

  get counterparty_moneybox_name() {
    return this._counterparty_moneybox_name
  }
  set counterparty_moneybox_name(value) {
    if (value !== null && typeof value !== 'string')
      throw new TypeError('counterparty_moneybox_name must be a string')
    this._counterparty_moneybox_name = value
  }
  get created_at() {
    return this._created_at
  }
  set created_at(value) {
    if (!isValidISO8601(value)) {
      throw new TypeError('created_at must be in ISO8601 format')
    }
    this._created_at = value
  }
}

export class TransactionLogs {
  /** @member {Number} moneybox_id */
  _moneybox_id
  /** @member {TransactionLogsEntry[]} entries */
  _entries

  /**
   * Creates an instance of TransactionLogs.
   * @param {Number} moneybox_id - The ID of the moneybox these transactions belong to
   * @param {TransactionLogsEntry[]} entries - An array of TransactionLogsEntry instances
   */
  constructor(moneybox_id, entries) {
    this.moneybox_id = moneybox_id
    this.entries = entries
  }

  get moneybox_id() {
    return this._moneybox_id
  }
  set moneybox_id(value) {
    if (!Number.isInteger(value))
      throw new TypeError('Moneybox ID must be an integer')
    this._moneybox_id = value
  }

  get entries() {
    return this._entries
  }
  set entries(value) {
    if (
      !Array.isArray(value) ||
      !value.every((item) => item instanceof TransactionLogsEntry)
    )
      throw new TypeError(
        'Entries must be an array of TransactionLogsEntry instances'
      )
    this._entries = value
  }

  /**
   * Static method to create a TransactionLogs instance from a JSON object.
   * @param {Object} rawLogs A JSON object that contains the moneybox_id and an array of transaction log entries.
   * @returns {TransactionLogs} A new instance of TransactionLogs.
   */
  static fromJSON(rawLogs) {
    const entries = rawLogs.transaction_logs.map(
      (log) =>
        new TransactionLogsEntry(
          log.id,
          log.moneybox_id,
          log.counterparty_moneybox_id,
          log.amount,
          log.balance,
          log.description,
          log.transaction_trigger,
          log.transaction_type,
          log.counterparty_moneybox_name,
          log.created_at
        )
    )
    return new TransactionLogs(rawLogs.transaction_logs[0].moneybox_id, entries)
  }
}
