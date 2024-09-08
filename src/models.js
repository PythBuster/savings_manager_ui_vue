import { isValidISO8601 } from '@/utils.js'

export class Prioritylist {
  /** @member {Number} moneyboxId */
  _moneyboxId
  /** @member {String} name */
  _name
  /** @member {Number} priority */
  _priority

  /**
   * Creates an instance of Prioritylist.
   * @param {Number} moneyboxId - The unique identifier for the moneybox
   * @param {String} name - The name of the moneybox
   * @param {Number} priority - The priority of the moneybox
   * */
  constructor(
    moneyboxId,
    name,
    priority
  ) {
    this.moneyboxId = moneyboxId
    this.name = name
    this.priority = priority
  }

  /**
   * Static method to create a Prioritylist instance from a JSON object.
   * @param {Object} rawPrioritylist A JSON object with properties matching the Prioritylist class.
   * @returns {Priortylist} A new instance of Prioritylist.
   */
  static fromJSON(rawPrioritylist) {
    return new Prioritylist(
      rawPrioritylist.moneyboxId,
      rawPrioritylist.name,
      rawPrioritylist.priority
    )
  }

  get moneyboxId() {
    return this._moneyboxId
  }
  set moneyboxId(value) {
    if (!Number.isInteger(value)) throw new TypeError('id must be an integer')
    this._moneyboxId = value
  }

  get name() {
    return this._name
  }
  set name(value) {
    if (typeof value !== 'string') throw new TypeError('name must be a string')
    this._name = value
  }

  get priority() {
    return this._priority
  }
  set priority(value) {
    if (!Number.isInteger(value) || value < 0)
      throw new RangeError('priority must be an integer and >= 1')
    this._priority = value
  }
}


export class Moneybox {
  /** @member {Number} id */
  _id
  /** @member {String} name */
  _name
  /** @member {Number} balance */
  _balance
  /** @member {String} createdAt */
  _createdAt
  /** @member {String} modifiedAt */
  _modifiedAt
  /** @member {Number} priority */
  _priority
  /** @member {Number} savingsAmount */
  _savingsAmount  
  /** @member {Number} savingsTarget */
  _savingsTarget

  /**
   * Creates an instance of Moneybox.
   * @param {Number} id - The unique identifier for the moneybox
   * @param {String} name - The name of the moneybox
   * @param {Number} balance - The current balance of the moneybox
   * @param {String} createdAt - The creation ISO8601 time/date of the moneybox
   * @param {String} modifiedAt - The modification ISO8601 time/date of the moneybox
   * @param {Number} priority - The priority of the moneybox
   * @param {Number} savingsAmount - The savings amount of the moneybox
   * @param {Number} savingsTarget - The savings target of the moneybox
   * */
  constructor(
    id,
    name,
    balance,
    createdAt,
    modifiedAt,
    priority,
    savingsAmount,
    savingsTarget
  ) {
    this.id = id
    this.name = name
    this.balance = balance
    this.createdAt = createdAt
    this.modifiedAt = modifiedAt
    this.priority = priority
    this.savingsAmount = savingsAmount
    this.savingsTarget = savingsTarget
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
      rawMoneybox.createdAt,
      rawMoneybox.modifiedAt,
      rawMoneybox.priority,
      rawMoneybox.savingsAmount,
      rawMoneybox.savingsTarget
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

  get createdAt() {
    return this._createdAt
  }
  set createdAt(value) {
    if (!isValidISO8601(value)) {
      throw new TypeError('createdAt must be in ISO8601 format')
    }
    this._createdAt = value
  }

  get modifiedAt() {
    return this._modifiedAt
  }
  set modifiedAt(value) {
    if (!isValidISO8601(value) && value !== null) {
      throw new TypeError('modifiedAt must be in ISO8601 format')
    }
    this._modifiedAt = value
  }

  get balance() {
    return this._balance
  }
  set balance(value) {
    if (typeof value !== 'number' || value < 0)
      throw new RangeError('balance must be a number and >= 0')
    this._balance = value
  }

 
  get priority() {
    return this._priority
  }
  set priority(value) {
    if (!Number.isInteger(value) || value < 0)
      throw new RangeError('priority must be an integer and >= 1')
    this._priority = value
  }

  get savingsAmount() {
    return this._savingsAmount
  }
  set savingsAmount(value) {
    if (!Number.isInteger(value))
      throw new RangeError('savingsAmount must be an integer')
    this._savingsAmount = value
  }

  get savingsTarget() {
    return this._savingsTarget
  }
  set savingsTarget(value) {
    if (!Number.isInteger(value) && value !== null)
      throw new RangeError('savingsTarget amount must be an integer or nullable')
    this._savingsTarget = value
  }
}

export class TransactionLogsEntry {
  /** @member {Number} id */
  _id
  /** @member {Number} moneyboxId */
  _moneyboxId
  /** @member {Number} counterpartyMoneyboxId */
  _counterpartyMoneyboxId
  /** @member {Number} amount */
  _amount
  /** @member {Number} balance */
  _balance
  /** @member {String} description */
  _description
  /** @member {String} transactionTrigger */
  _transactionTrigger
  /** @member {String} transactionType */
  _transactionType
  /** @member {String} counterpartyMoneyboxName */
  _counterpartyMoneyboxName
  /** @member {String} createdAt */
  _createdAt

  /**
   * Creates an instance of TransactionLogsEntry.
   * @param {Number} id - The unique identifier for the transaction
   * @param {Number} moneyboxId - The moneybox id of the transaction
   * @param {Number|null} counterpartyMoneyboxId - The counterparty moneybox id of the transaction (for transfer) - null if not applicable (for deposit/withdrawal)
   * @param {Number} amount - The amount of the transaction - can be negative for withdrawal/transfer
   * @param {Number} balance - The balance of the moneybox after the transaction
   * @param {String} description - The description of the transaction
   * @param {String} transactionTrigger - The trigger of the transaction - 'manually' or 'automatically'
   * @param {String} transactionType - The type of the transaction = 'direct' or 'distribution'
   * @param {String} counterpartyMoneyboxName - The name of the counterparty moneybox
   * @param {String} createdAt - The creation ISO8601 time/date of the transaction
   */
  constructor(
    id,
    moneyboxId,
    counterpartyMoneyboxId,
    amount,
    balance,
    description,
    transactionTrigger,
    transactionType,
    counterpartyMoneyboxName,
    createdAt
  ) {
    this.id = id
    this.moneyboxId = moneyboxId
    this.counterpartyoneybox_id = counterpartyMoneyboxId
    this.amount = amount
    this.balance = balance
    this.description = description
    this.transactionTrigger = transactionTrigger
    this.transactionType = transactionType
    this.counterpartyMoneyboxName = counterpartyMoneyboxName
    this.createdAt = createdAt
  }

  get id() {
    return this._id
  }
  set id(value) {
    if (!Number.isInteger(value)) throw new TypeError('id must be an integer')
    this._id = value
  }

  get moneyboxId() {
    return this._moneyboxId
  }
  set moneyboxId(value) {
    if (!Number.isInteger(value))
      throw new TypeError('moneybox_id must be an integer')
    this._moneyboxId = value
  }

  get counterpartyMoneyboxId() {
    return this._counterpartyMoneyboxId
  }
  set counterpartyMoneyboxId(value) {
    if (value !== null && !Number.isInteger(value))
      throw new TypeError('counterparty_moneybox_id must be an integer or null')
    this._counterpartyMoneyboxId = value
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

  get transactionTrigger() {
    return this._transactionTrigger
  }
  set transactionTrigger(value) {
    if (value !== 'manually' && value !== 'automatically')
      throw new TypeError(
        'transactionTrigger must be "manually" or "automatically"'
      )
    this._transactionTrigger = value
  }

  get transactionType() {
    return this._transactionType
  }
  set transactionType(value) {
    if (value !== 'direct' && value !== 'distribution')
      throw new TypeError('transactionType must be "direct" or "distribution"')
    this._transactionType = value
  }

  get counterpartyMoneyboxName() {
    return this._counterpartyMoneyboxName
  }
  set counterpartyMoneyboxName(value) {
    if (value !== null && typeof value !== 'string')
      throw new TypeError('counterpartyMoneyboxName must be a string')
    this._counterpartyMoneyboxName = value
  }
  get createdAt() {
    return this._createdAt
  }
  set createdAt(value) {
    if (!isValidISO8601(value)) {
      throw new TypeError('createdAt must be in ISO8601 format')
    }
    this._createdAt = value
  }
}

export class TransactionLogs {
  /** @member {Number} moneyboxId */
  _moneyboxId
  /** @member {TransactionLogsEntry[]} entries */
  _entries

  /**
   * Creates an instance of TransactionLogs.
   * @param {Number} moneyboxId - The ID of the moneybox these transactions belong to
   * @param {TransactionLogsEntry[]} entries - An array of TransactionLogsEntry instances
   */
  constructor(moneyboxId, entries) {
    this.moneyboxId = moneyboxId
    this.entries = entries
  }

  get moneyboxId() {
    return this._moneyboxId
  }
  set moneyboxId(value) {
    if (!Number.isInteger(value))
      throw new TypeError('Moneybox ID must be an integer')
    this._moneyboxId = value
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

    // save array desc sorted by createdAt
    this._entries = value.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /**
   * Static method to create a TransactionLogs instance from a JSON object.
   * @param {Object} rawLogs A JSON object that contains the moneybox_id and an array of transaction log entries.
   * @returns {TransactionLogs} A new instance of TransactionLogs.
   */
  static fromJSON(rawLogs) {
    const entries = rawLogs.transactionLogs.map(
      (log) =>
        new TransactionLogsEntry(
          log.id,
          log.moneyboxId,
          log.counterpartyMoneyboxId,
          log.amount,
          log.balance,
          log.description,
          log.transactionTrigger,
          log.transactionType,
          log.counterpartyMoneyboxName,
          log.createdAt
        )
    )
    return new TransactionLogs(rawLogs.transactionLogs[0].moneyboxId, entries)
  }
}

export class Settings {
  static instance = null
  _createdAt
  _modifiedAt
  _isAutomatedSavingActive
  _overflowMoneyboxAutomatedSavingsMode
  _savingsAmount
  _sendReportsViaEmail
  _userEmailAddress

  /**
   * Creates an instance of Settings (Singleton).
   * @param {String} createdAt - The creation ISO8601 time/date of the settings
   * @param {String} modifiedAt - The modification ISO8601 time/date of the setting
   * @param {Boolean} isAutomatedSavingActive - The flag to indicate if automated savings is active or not
   * @param {String} overflowMoneyboxAutomatedSavingsMode - The savings mode (one of 'add-up', 'fill-envelopes', 'collect')
   * @param {String} savingsAmount - The savings amount for the automated savings
   * @param {String} sendReportsViaEmail - The flag to indicate of user wants to be informed abut automated savings (receiving reports)
   * @param {String} userEmailAddress - The users email address
   */
  constructor(
    createdAt, 
    modifiedAt, 
    isAutomatedSavingActive, 
    overflowMoneyboxAutomatedSavingsMode,
    savingsAmount,
    sendReportsViaEmail,
    userEmailAddress
  ) {
    if (Settings.instance) {
      return Settings.instance
    }
    this._createdAt = createdAt
    this._modifiedAt = modifiedAt
    this._isAutomatedSavingActive = isAutomatedSavingActive
    this._overflowMoneyboxAutomatedSavingsMode = overflowMoneyboxAutomatedSavingsMode
    this._savingsAmount = savingsAmount
    this._sendReportsViaEmail = sendReportsViaEmail
    this._userEmailAddress = userEmailAddress
    Settings.instance = this
  }

  /**
   * Static method to create a Settings instance from a JSON object.
   * @param {Object} rawSettings A JSON object with properties matching the Settings class.
   * @returns {Settings} A new instance of Settings (Singleton)
   */
  static fromJSON({     
    createdAt, 
    modifiedAt, 
    isAutomatedSavingActive, 
    overflowMoneyboxAutomatedSavingsMode,
    savingsAmount,
    sendReportsViaEmail,
    userEmailAddress
   }) {
    return new Settings(    createdAt, 
      modifiedAt, 
      isAutomatedSavingActive, 
      overflowMoneyboxAutomatedSavingsMode,
      savingsAmount,
      sendReportsViaEmail,
      userEmailAddress
    )
  }

  get createdAt() {
    return this._createdAt
  }
  set createdAt(value) {
    if (!isValidISO8601(value)) {
      throw new TypeError('createdAt must be in ISO8601 format')
    }
    this._createdAt = value
  }

  get modifiedAt() {
    return this._modifiedAt
  }
  set modifiedAt(value) {
    if (!isValidISO8601(value)) {
      throw new TypeError('modifiedAt must be in ISO8601 format')
    }
    this._modifiedAt = value
  }

  get isAutomatedSavingActive() {
    return this._isAutomatedSavingActive
  }
  set isAutomatedSavingActive(value) {
    this._isAutomatedSavingActive = value
  }

  get overflowMoneyboxAutomatedSavingsMode() {
    return this._overflowMoneyboxAutomatedSavingsMode
  }
  set overflowMoneyboxAutomatedSavingsMode(value) {
    this._overflowMoneyboxAutomatedSavingsMode = value
  }

  get savingsAmount() {
    return this._savingsAmount
  }
  set savingsAmount(value) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error('_savingsAmount must be a non-negative number')
    }
    this._savingsAmount = value
  }

  get sendReportsViaEmail() {
    return this._sendReportsViaEmail
  }
  set sendReportsViaEmail(value) {
    this._sendReportsViaEmail = value
  }

  get userEmailAddress() {
    return this._userEmailAddress
  }
  set userEmailAddress(value) {
    this._userEmailAddress = value
  }
}
