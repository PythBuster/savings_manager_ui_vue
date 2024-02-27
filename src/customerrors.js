export class DataError extends Error {
  constructor(message = 'DataError') {
    super(message)
    this.name = 'DataError'
  }
}
export class APIError extends Error {
  constructor(message, status, details = null) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.details = details
  }
}
export class DatabaseEmptyError extends Error {
  constructor(message = 'databaseEmptyError') {
    super(message)
    this.name = 'databaseEmptyError'
  }
}
