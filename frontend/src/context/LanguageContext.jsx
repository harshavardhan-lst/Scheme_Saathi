import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(null)

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'te', label: 'తెలుగు' },
]

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('ss_lang') || 'en')

  function changeLanguage(code) {
    localStorage.setItem('ss_lang', code)
    setLanguage(code)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
