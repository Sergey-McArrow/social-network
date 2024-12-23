import { useRouter } from 'next/router'
import en from '../locales/en.json'
import ru from '../locales/ru.json'

const translations = {
  en,
  ru,
}

export type LocaleKey = keyof typeof translations
export type TranslationKeys = keyof typeof en

type NestedTranslations = {
  [key: string]: string | NestedTranslations
}

const getTranslation = (locale: LocaleKey = 'en') => {
  const t = (key: string) => {
    const keys = key.split('.')
    let translation = translations[locale] as NestedTranslations

    for (const k of keys) {
      if (!translation[k]) {
        console.warn(
          `Translation key "${key}" not found for locale "${locale}"`
        )
        return key
      }
      translation = translation[k] as NestedTranslations
    }

    return translation
  }

  return {
    t,
    locale,
    translations: translations[locale],
  }
}

export const useTranslation = () => {
  const router = useRouter()
  const { locale = 'en' } = router
  return getTranslation(locale as LocaleKey)
}
