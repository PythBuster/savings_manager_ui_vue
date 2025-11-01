import { createI18n } from 'vue-i18n'

// --- Import language resources ---
import en from './locales/en.json'
import de from './locales/de.json'

// --- Normalize environment locales ---
const defaultLocale = (import.meta.env.VITE_VUE_APP_I18N_LOCALE || 'en').split('-')[0]
const fallbackLocale = (import.meta.env.VITE_VUE_APP_I18N_FALLBACK_LOCALE || 'en').split('-')[0]

// --- Create i18n instance ---
const i18n = createI18n({
  legacy: false,              // use Composition API mode
  globalInjection: true,      // allows using $t in templates without manual import
  locale: defaultLocale,      // current language
  fallbackLocale,             // fallback if translation missing
  messages: {
    en,
    de
  }
})

export default i18n
