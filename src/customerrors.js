export class DataError extends Error {
  constructor(message = 'DataError') {
    super(message)
    this.name = 'DataError'
    Error.captureStackTrace?.(this, DataError)
  }
}

export class APIError extends Error {
  constructor(message = 'APIError', status = 500, details = null) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.details = details
    Error.captureStackTrace?.(this, APIError)
  }
}
