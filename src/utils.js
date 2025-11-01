import { getSettings, createSettings } from '@/api.js'
import global from '@/global.js'

/**
 * Formats a numeric value (in cents) into a localized Euro currency string.
 * @param {number} value - The amount in cents.
 * @returns {string} The formatted currency string (e.g., "12,34 €").
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value / 100)
}

/**
 * Formats a date string into "DD.MM.YYYY" according to locale.
 * @param {string|Date} date - The input date string or Date object.
 * @param {string} [locale='de-DE'] - The locale used for formatting.
 * @returns {string} The formatted date.
 */
export const formatDate = (date, locale = 'de-DE') => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

/**
 * Formats an ISO8601 datetime string to "DD.MM.YYYY - HH:mm" format.
 * @param {string} datetime - The ISO8601 datetime string to format.
 * @param {string} [locale='de-DE'] - The locale for formatting.
 * @returns {string} The formatted datetime string.
 */
export const formatDateTime = (datetime, locale = 'de-DE') => {
  const date = new Date(datetime)
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)

  const formattedTime = date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return `${formattedDate} - ${formattedTime}`
}

/**
 * Validates if a given string matches the ISO8601 datetime format.
 * @param {string} dateString - The string to validate.
 * @returns {boolean} True if valid ISO8601, otherwise false.
 */
export function isValidISO8601(dateString) {
  // Accepts formats like "2025-11-01T12:30:00Z" or "2025-11-01T12:30:00.000Z"
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/
  return regex.test(dateString)
}

/**
 * Converts an amount in cents to a float Euro value.
 * @param {number} cents - Amount in cents.
 * @returns {number} Euro value as float.
 */
export function centsToEuroFloat(cents) {
  const euro = Math.floor(cents / 100)
  const cent = cents % 100
  const formattedCent = cent.toString().padStart(2, '0')
  const euroString = `${euro},${formattedCent}`
  return safeStringToFloat(euroString)
}


/**
 * Converts a comma-based decimal string into a float.
 * @param {string} str - The numeric string (e.g., "12,34").
 * @returns {number} Parsed float value.
 * @throws {Error} If string cannot be parsed.
 */
const safeStringToFloat = (str) => {
  const normalizedStr = str.replace(',', '.')
  const floatNumber = parseFloat(normalizedStr)

  if (isNaN(floatNumber)) {
    throw new Error('Der String konnte nicht in eine Zahl umgewandelt werden.')
  }

  return floatNumber
}

/**
 * Normalizes a string to exactly two decimal places, using comma as separator.
 * @param {string} str - The numeric string.
 * @returns {string} The formatted string with two decimals.
 */
const formatToTwoDecimalPlaces = (str) => {
  const normalizedStr = str.replace(',', '.')
  const [integerPart, decimalPart = ''] = normalizedStr.split('.')
  const formattedDecimalPart = decimalPart.padEnd(2, '0').slice(0, 2)
  return `${integerPart},${formattedDecimalPart}`
}

/**
 * Converts a Euro string (e.g., "12,34") into an integer representing cents.
 * @param {string|number} euroString - The Euro string or number.
 * @returns {number} The equivalent amount in cents.
 */
export function euroStringToCents(euroString) {
  const formatted = formatToTwoDecimalPlaces(String(euroString))
  return parseInt(formatted.replace(',', ''), 10)
}

/**
 * Fetches existing settings or creates default ones if none exist.
 * Ensures `global.settings` is always initialized.
 * @returns {Promise<void>}
 */
export async function fetchOrCreateSettings() {
  try {
    if (!global.settings.value) {
      await getSettings()

      if (!global.settings.value) {
        await createSettings({
          savings_amount: 0,
          savings_cycle: 'monthly',
          savings_mode: 'add'
        })
      }
    }
  } catch (error) {
    console.error('Failed to fetch or create settings:', error)
  }
}
