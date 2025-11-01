import { isValidISO8601 } from '@/utils.js'

/**
 * Represents a prioritized entry linking a Moneybox to its priority level.
 * Used for ordering and ranking Moneyboxes based on user-defined importance.
 */
export class Prioritylist {
  /** @member {Number} moneyboxId - The unique identifier of the associated Moneybox. */
  _moneyboxId
  /** @member {String} name - The display name of the Moneybox. */
  _name
  /** @member {Number} priority - The numeric priority value (lower = higher priority). */
  _priority

  /**
   * Creates an instance of Prioritylist.
   * @param {Number} moneyboxId - The unique identifier for the Moneybox.
   * @param {String} name - The name of the Moneybox.
   * @param {Number} priority - The priority rank assigned to the Moneybox.
   */
  constructor(moneyboxId, name, priority) {
    this.moneyboxId = moneyboxId
    this.name = name
    this.priority = priority
  }

  /**
   * Creates a Prioritylist instance from a plain JSON object.
   * @param {Object} rawPrioritylist - JSON object with properties matching the Prioritylist class.
   * @returns {Prioritylist} A new instance of Prioritylist.
   */
  static fromJSON(rawPrioritylist) {
    return new Prioritylist(
      rawPrioritylist.moneyboxId,
      rawPrioritylist.name,
      rawPrioritylist.priority
    )
  }

  /** @returns {Number} The unique Moneybox ID. */
  get moneyboxId() {
    return this._moneyboxId
  }

  /**
   * Sets the unique Moneybox ID.
   * @param {Number} value - Must be an integer.
   * @throws {TypeError} If value is not an integer.
   */
  set moneyboxId(value) {
    if (!Number.isInteger(value)) throw new TypeError('id must be an integer')
    this._moneyboxId = value
  }

  /** @returns {String} The Moneybox name. */
  get name() {
    return this._name
  }

  /**
   * Sets the Moneybox name.
   * @param {String} value - Must be a string.
   * @throws {TypeError} If not a string.
   */
  set name(value) {
    if (typeof value !== 'string') throw new TypeError('name must be a string')
    this._name = value
  }

  /** @returns {Number} The priority ranking. */
  get priority() {
    return this._priority
  }

  /**
   * Sets the Moneybox priority rank.
   * @param {Number} value - Integer greater than or equal to 1.
   * @throws {RangeError} If invalid integer or below range.
   */
  set priority(value) {
    if (!Number.isInteger(value) || value < 0)
      throw new RangeError('priority must be an integer and >= 1')
    this._priority = value
  }
}

/**
 * Represents a Moneybox — a savings container with its own financial state and metadata.
 */
export class Moneybox {
  /** @member {Number} id - Unique identifier of the Moneybox. */
  _id
  /** @member {String} name - Name of the Moneybox. */
  _name
  /** @member {String} description - Describes the Moneybox's purpose. */
  _description
  /** @member {Number} balance - The current balance in the Moneybox. */
  _balance
  /** @member {String} createdAt - ISO8601 timestamp marking when the Moneybox was created. */
  _createdAt
  /** @member {String|null} modifiedAt - ISO8601 timestamp of the last modification, or null if never modified. */
  _modifiedAt
  /** @member {Number} priority - Numeric priority level of the Moneybox. */
  _priority
  /** @member {Number} savingsAmount - Amount regularly allocated to this Moneybox. */
  _savingsAmount
  /** @member {Number|null} savingsTarget - The savings goal amount, or null if not defined. */
  _savingsTarget

  /**
   * Creates an instance of Moneybox.
   * @param {Number} id - The unique identifier for the Moneybox.
   * @param {String} name - The name of the Moneybox.
   * @param {String} description - The description of the Moneybox.
   * @param {Number} balance - The current balance.
   * @param {String} createdAt - The creation timestamp in ISO8601 format.
   * @param {String|null} modifiedAt - The modification timestamp in ISO8601 format or null.
   * @param {Number} priority - The priority rank of the Moneybox.
   * @param {Number} savingsAmount - The savings contribution amount.
   * @param {Number|null} savingsTarget - The savings target goal or null if unlimited.
   */
  constructor(
    id,
    name,
    description,
    balance,
    createdAt,
    modifiedAt,
    priority,
    savingsAmount,
    savingsTarget
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.balance = balance
    this.createdAt = createdAt
    this.modifiedAt = modifiedAt
    this.priority = priority
    this.savingsAmount = savingsAmount
    this.savingsTarget = savingsTarget
  }

  /**
   * Instantiates a Moneybox from a JSON object.
   * @param {Object} rawMoneybox - JSON data matching the Moneybox structure.
   * @returns {Moneybox} A new Moneybox instance.
   */
  static fromJSON(rawMoneybox) {
    return new Moneybox(
      rawMoneybox.id,
      rawMoneybox.name,
      rawMoneybox.description,
      rawMoneybox.balance,
      rawMoneybox.createdAt,
      rawMoneybox.modifiedAt,
      rawMoneybox.priority,
      rawMoneybox.savingsAmount,
      rawMoneybox.savingsTarget
    )
  }

  get id() { return this._id }
  set id(value) {
    if (!Number.isInteger(value)) throw new TypeError('id must be an integer')
    this._id = value
  }

  get name() { return this._name }
  set name(value) {
    if (typeof value !== 'string') throw new TypeError('name must be a string')
    this._name = value
  }

  get description() { return this._description }
  set description(value) {
    if (typeof value !== 'string') throw new TypeError('description must be a string')
    this._description = value
  }

  get createdAt() { return this._createdAt }
  set createdAt(value) {
    if (!isValidISO8601(value)) throw new TypeError('createdAt must be in ISO8601 format')
    this._createdAt = value
  }

  get modifiedAt() { return this._modifiedAt }
  set modifiedAt(value) {
    if (!isValidISO8601(value) && value !== null)
      throw new TypeError('modifiedAt must be in ISO8601 format')
    this._modifiedAt = value
  }

  get balance() { return this._balance }
  set balance(value) {
    if (typeof value !== 'number' || value < 0)
      throw new RangeError('balance must be a number and >= 0')
    this._balance = value
  }

  get priority() { return this._priority }
  set priority(value) {
    if (!Number.isInteger(value) || value < 0)
      throw new RangeError('priority must be an integer and >= 1')
    this._priority = value
  }

  get savingsAmount() { return this._savingsAmount }
  set savingsAmount(value) {
    if (!Number.isInteger(value))
      throw new RangeError('savingsAmount must be an integer')
    this._savingsAmount = value
  }

  get savingsTarget() { return this._savingsTarget }
  set savingsTarget(value) {
    if (!Number.isInteger(value) && value !== null)
      throw new RangeError('savingsTarget amount must be an integer or nullable')
    this._savingsTarget = value
  }
}

/**
 * Represents a forecast of savings growth for a specific Moneybox.
 */
export class MoneyboxSavingsForecast {
  /** @member {Number} moneyboxId - ID of the related Moneybox. */
  _moneyboxId
  /** @member {Array} monthlyDistributions - List of monthly distribution values. */
  _monthlyDistributions
  /** @member {Number} reachedInMonths - Number of months required to reach savings target. */
  _reachedInMonths

  /**
   * Creates a MoneyboxSavingsForecast instance.
   * @param {Number} moneyboxId - The Moneybox ID this forecast belongs to.
   * @param {Array} monthlyDistributions - Monthly savings distribution data.
   * @param {Number} reachedInMonths - Number of months until savings target is reached.
   */
  constructor(moneyboxId, monthlyDistributions, reachedInMonths) {
    this.moneyboxId = moneyboxId
    this.monthlyDistributions = monthlyDistributions
    this.reachedInMonths = reachedInMonths
  }

  /**
   * Instantiates a forecast from JSON.
   * @param {Object} rawMoneyboxSavingsForecast - JSON data.
   * @returns {MoneyboxSavingsForecast} A new forecast instance.
   */
  static fromJSON(rawMoneyboxSavingsForecast) {
    return new MoneyboxSavingsForecast(
      rawMoneyboxSavingsForecast.moneyboxId,
      rawMoneyboxSavingsForecast.monthlyDistributions,
      rawMoneyboxSavingsForecast.reachedInMonths
    )
  }

  get moneyboxId() { return this._moneyboxId }
  set moneyboxId(value) {
    if (!Number.isInteger(value)) throw new TypeError('moneyboxId must be an integer')
    this._moneyboxId = value
  }

  get monthlyDistributions() { return this._monthlyDistributions }
  set monthlyDistributions(value) { this._monthlyDistributions = value }

  get reachedInMonths() { return this._reachedInMonths }
  set reachedInMonths(value) { this._reachedInMonths = value }
}

/**
 * Represents a single transaction entry related to a Moneybox.
 */
export class TransactionLogsEntry {
  /** @member {Number} id - Unique transaction identifier. */
  _id
  /** @member {Number} moneyboxId - ID of the associated Moneybox. */
  _moneyboxId
  /** @member {Number|null} counterpartyMoneyboxId - ID of counterparty Moneybox (if transfer). */
  _counterpartyMoneyboxId
  /** @member {Number} amount - Transaction amount (negative for withdrawal). */
  _amount
  /** @member {Number} balance - Balance after transaction. */
  _balance
  /** @member {String} description - Description or purpose of the transaction. */
  _description
  /** @member {String} transactionTrigger - 'manually' or 'automatically'. */
  _transactionTrigger
  /** @member {String} transactionType - 'direct' or 'distribution'. */
  _transactionType
  /** @member {String|null} counterpartyMoneyboxName - Name of the counterparty Moneybox if applicable. */
  _counterpartyMoneyboxName
  /** @member {String} createdAt - ISO8601 timestamp when transaction occurred. */
  _createdAt

  /**
   * Creates a TransactionLogsEntry.
   * @param {Number} id - Unique transaction ID.
   * @param {Number} moneyboxId - Related Moneybox ID.
   * @param {Number|null} counterpartyMoneyboxId - Counterparty Moneybox ID or null.
   * @param {Number} amount - Transaction amount.
   * @param {Number} balance - Post-transaction balance.
   * @param {String} description - Transaction description.
   * @param {String} transactionTrigger - Trigger mode: 'manually' | 'automatically'.
   * @param {String} transactionType - Type: 'direct' | 'distribution'.
   * @param {String|null} counterpartyMoneyboxName - Counterparty Moneybox name.
   * @param {String} createdAt - Creation timestamp in ISO8601 format.
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
    this.counterpartyMoneyboxId = counterpartyMoneyboxId
    this.amount = amount
    this.balance = balance
    this.description = description
    this.transactionTrigger = transactionTrigger
    this.transactionType = transactionType
    this.counterpartyMoneyboxName = counterpartyMoneyboxName
    this.createdAt = createdAt
  }

  get id() { return this._id }
  set id(value) {
    if (!Number.isInteger(value)) throw new TypeError('id must be an integer')
    this._id = value
  }

  get moneyboxId() { return this._moneyboxId }
  set moneyboxId(value) {
    if (!Number.isInteger(value))
      throw new TypeError('moneybox_id must be an integer')
    this._moneyboxId = value
  }

  get counterpartyMoneyboxId() { return this._counterpartyMoneyboxId }
  set counterpartyMoneyboxId(value) {
    if (value !== null && !Number.isInteger(value))
      throw new TypeError('counterparty_moneybox_id must be an integer or null')
    this._counterpartyMoneyboxId = value
  }

  get amount() { return this._amount }
  set amount(value) {
    if (typeof value !== 'number')
      throw new TypeError('amount must be a number')
    this._amount = value
  }

  get balance() { return this._balance }
  set balance(value) {
    if (typeof value !== 'number' || value < 0)
      throw new TypeError('balance must be a number and >= 0')
    this._balance = value
  }

  get description() { return this._description }
  set description(value) {
    if (typeof value !== 'string')
      throw new TypeError('description must be a string')
    this._description = value
  }

  get transactionTrigger() { return this._transactionTrigger }
  set transactionTrigger(value) {
    if (value !== 'manually' && value !== 'automatically')
      throw new TypeError('transactionTrigger must be "manually" or "automatically"')
    this._transactionTrigger = value
  }

  get transactionType() { return this._transactionType }
  set transactionType(value) {
    if (value !== 'direct' && value !== 'distribution')
      throw new TypeError('transactionType must be "direct" or "distribution"')
    this._transactionType = value
  }

  get counterpartyMoneyboxName() { return this._counterpartyMoneyboxName }
  set counterpartyMoneyboxName(value) {
    if (value !== null && typeof value !== 'string')
      throw new TypeError('counterpartyMoneyboxName must be a string')
    this._counterpartyMoneyboxName = value
  }

  get createdAt() { return this._createdAt }
  set createdAt(value) {
    if (!isValidISO8601(value))
      throw new TypeError('createdAt must be in ISO8601 format')
    this._createdAt = value
  }
}

/**
 * Represents the transaction log of a specific Moneybox.
 * Holds a chronologically sorted list of TransactionLogsEntry objects.
 */
export class TransactionLogs {
  /** @member {Number} moneyboxId - The Moneybox ID these transactions belong to. */
  _moneyboxId
  /** @member {TransactionLogsEntry[]} entries - List of transaction entries. */
  _entries

  /**
   * Creates an instance of TransactionLogs.
   * @param {Number} moneyboxId - ID of the associated Moneybox.
   * @param {TransactionLogsEntry[]} entries - Array of TransactionLogsEntry instances.
   */
  constructor(moneyboxId, entries) {
    this.moneyboxId = moneyboxId
    this.entries = entries
  }

  get moneyboxId() { return this._moneyboxId }
  set moneyboxId(value) {
    if (!Number.isInteger(value))
      throw new TypeError('Moneybox ID must be an integer')
    this._moneyboxId = value
  }

  get entries() { return this._entries }
  set entries(value) {
    if (!Array.isArray(value) || !value.every((item) => item instanceof TransactionLogsEntry))
      throw new TypeError('Entries must be an array of TransactionLogsEntry instances')
    this._entries = value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  /**
   * Creates a TransactionLogs instance from JSON data.
   * @param {Object} rawLogs - JSON data containing the log entries.
   * @returns {TransactionLogs} A new TransactionLogs instance.
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

/**
 * Holds metadata information about the application.
 */
export class AppMetadata {
  /** @member {String} appName - Application name. */
  _appName
  /** @member {String} appVersion - Application version string. */
  _appVersion
  /** @member {String} appDescription - Short description of the app. */
  _appDescription

  /**
   * Creates an instance of AppMetadata.
   * @param {String} appName - The name of the app.
   * @param {String} appVersion - The version of the app.
   * @param {String} appDescription - A short description of the app.
   */
  constructor(appName, appVersion, appDescription) {
    this.appName = appName
    this.appVersion = appVersion
    this.appDescription = appDescription
  }

  /**
   * Instantiates AppMetadata from JSON.
   * @param {Object} rawAppMetadata - JSON data matching AppMetadata structure.
   * @returns {AppMetadata} A new AppMetadata instance.
   */
  static fromJSON({ appName, appVersion, appDescription }) {
    return new AppMetadata(appName, appVersion, appDescription)
  }

  get appName() { return this._appName }
  set appName(value) { this._appName = value }

  get appVersion() { return this._appVersion }
  set appVersion(value) { this._appVersion = value }

  get appDescription() { return this._appDescription }
  set appDescription(value) { this._appDescription = value }
}

/**
 * Represents user and system configuration settings.
 */
export class Settings {
  /** @member {String} createdAt - ISO8601 timestamp of creation. */
  _createdAt
  /** @member {String} modifiedAt - ISO8601 timestamp of last modification. */
  _modifiedAt
  /** @member {Boolean} isAutomatedSavingActive - Whether automated saving is enabled. */
  _isAutomatedSavingActive
  /** @member {String} overflowMoneyboxAutomatedSavingsMode - Savings mode ('add', 'fill', 'collect', 'ratio', 'ratio_prioritized'). */
  _overflowMoneyboxAutomatedSavingsMode
  /** @member {Number} savingsAmount - Base amount for automated savings. */
  _savingsAmount
  /** @member {Boolean} sendReportsViaEmail - Whether reports are emailed to user. */
  _sendReportsViaEmail
  /** @member {String} userEmailAddress - User's email address. */
  _userEmailAddress

  /**
   * Creates a Settings instance.
   * @param {String} createdAt - ISO8601 creation timestamp.
   * @param {String} modifiedAt - ISO8601 modification timestamp.
   * @param {Boolean} isAutomatedSavingActive - Whether automated saving is active.
   * @param {String} overflowMoneyboxAutomatedSavingsMode - Savings mode setting.
   * @param {Number} savingsAmount - Amount for automated savings.
   * @param {Boolean} sendReportsViaEmail - Email report setting.
   * @param {String} userEmailAddress - User's email address.
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
    this.createdAt = createdAt
    this.modifiedAt = modifiedAt
    this.isAutomatedSavingActive = isAutomatedSavingActive
    this.overflowMoneyboxAutomatedSavingsMode = overflowMoneyboxAutomatedSavingsMode
    this.savingsAmount = savingsAmount
    this.sendReportsViaEmail = sendReportsViaEmail
    this.userEmailAddress = userEmailAddress
  }

  /**
   * Creates a Settings instance from JSON data.
   * @param {Object} rawSettings - JSON object with matching properties.
   * @returns {Settings} The singleton Settings instance.
   */
  static fromJSON({
                    createdAt,
                    modifiedAt,
                    isAutomatedSavingActive,
                    overflowMoneyboxAutomatedSavingsMode,
                    savingsAmount,
                    sendReportsViaEmail,
                    userEmailAddress,
                  }) {
    return new Settings(
      createdAt,
      modifiedAt,
      isAutomatedSavingActive,
      overflowMoneyboxAutomatedSavingsMode,
      savingsAmount,
      sendReportsViaEmail,
      userEmailAddress
    )
  }

  get createdAt() { return this._createdAt }
  set createdAt(value) {
    if (!isValidISO8601(value))
      throw new TypeError('createdAt must be in ISO8601 format')
    this._createdAt = value
  }

  get modifiedAt() { return this._modifiedAt }
  set modifiedAt(value) {
    if (!isValidISO8601(value))
      throw new TypeError('modifiedAt must be in ISO8601 format')
    this._modifiedAt = value
  }

  get isAutomatedSavingActive() { return this._isAutomatedSavingActive }
  set isAutomatedSavingActive(value) { this._isAutomatedSavingActive = value }

  get overflowMoneyboxAutomatedSavingsMode() { return this._overflowMoneyboxAutomatedSavingsMode }
  set overflowMoneyboxAutomatedSavingsMode(value) { this._overflowMoneyboxAutomatedSavingsMode = value }

  get savingsAmount() { return this._savingsAmount }
  set savingsAmount(value) {
    if (typeof value !== 'number' || value < 0)
      throw new Error('_savingsAmount must be a non-negative number')
    this._savingsAmount = value
  }

  get sendReportsViaEmail() { return this._sendReportsViaEmail }
  set sendReportsViaEmail(value) { this._sendReportsViaEmail = value }

  get userEmailAddress() { return this._userEmailAddress }
  set userEmailAddress(value) { this._userEmailAddress = value }
}
