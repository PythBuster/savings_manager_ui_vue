// Add option to switch currencies later
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

export const formatDate = (date, locale = 'de-DE') => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

/**
 * Validates a string to be ISO 8601 format.
 * @param {String} dateString The string to validate
 * @returns {Boolean} True if format is valid, false otherwise
 */
export function isValidISO8601(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z$/
  return regex.test(dateString)
}
