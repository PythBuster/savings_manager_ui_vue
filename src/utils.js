import { getSettings, createSettings } from '@/api.js'
import global from '@/global.js'

// Add option to switch currencies later
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value / 100)
}

export const formatDate = (date, locale = 'de-DE') => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

/**
 * Formats an ISO8601 datetime string to "DD.MM.YYYY - HH:mm" format.
 * @param {string} datetime - The ISO8601 datetime string to format
 * @param {string} locale - The locale to use for formatting, defaults to 'de-DE'
 * @return {string} The formatted datetime string
 */
export const formatDateTime = (datetime, locale = 'de-DE') => {
  // Parse the input datetime string to a Date object
  const date = new Date(datetime)

  // Format the date part
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)

  // Format the time part
  const formattedTime = date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Use 24-hour format
  })

  // Combine the date and time parts
  return `${formattedDate} - ${formattedTime}`
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

export async function fetchOrCreateSettings() {
  try {
    if (!global.settings.value) {
      await getSettings()

      if (!global.settings.value) {
        // initialize with default values
        await createSettings({
          savings_amount: 0,
          savings_cycle: 'monthly',
          savings_mode: 'add-up'
        })
      }
    }
  } catch (error) {
    console.error('Failed to fetch or create settings:', error)
  }
}
