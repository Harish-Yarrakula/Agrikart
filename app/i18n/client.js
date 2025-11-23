'use client'

import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { initReactI18next, I18nextProvider as I18nextProviderReact } from 'react-i18next'
import { useCookies } from 'react-cookie'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, supportedLngs } from './settings'

const runsOnServerSide = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language, namespace) => import(`../../locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: 'en',
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? supportedLngs : []
  })

export function I18nextProvider({ children, lng }) {
  const [cookies, setCookie] = useCookies(['i18next'])

  if (i18next.resolvedLanguage !== lng) {
    // Ensure we never call changeLanguage with undefined.
    const target = lng || 'en'
    i18next.changeLanguage(target)
  }

  // We don't need a separate activeLng state; rely on i18next's resolvedLanguage

  useEffect(() => {
    // On route changes, ensure language is switched to the provided lng,
    // or fall back to 'en' when none is provided so every page loads with English.
    const target = lng || 'en'
    if (i18next.resolvedLanguage === target) return
    try {
      // changeLanguage may return a promise; trigger it and ignore the result here
      i18next.changeLanguage(target)
    } catch (err) {
      // swallow errors to avoid runtime crash; log for debugging
      // eslint-disable-next-line no-console
      console.error('i18next changeLanguage error:', err)
    }
  }, [lng])

  useEffect(() => {
    // If the current URL path doesn't start with a supported language,
    // redirect the browser to the same path prefixed with the target language.
    // This ensures visiting the root or a non-locale path lands under /en (or provided lng).
    if (typeof window === 'undefined') return

    try {
      const pathname = window.location.pathname || '/'
      const firstSeg = pathname.split('/').filter(Boolean)[0] // first non-empty segment

      // Skip special Next.js/internal or API paths
      const skip = ['_next', 'api', 'static', 'favicon.ico']
      if (firstSeg && (supportedLngs.includes(firstSeg) || skip.includes(firstSeg))) return

      const target = lng || 'en'
      // avoid redirect loop
      if (pathname.startsWith(`/${target}`)) return

      const search = window.location.search || ''
      const hash = window.location.hash || ''

      // Use replace so user doesn't stack history entries when we auto-redirect
      window.location.replace(`/${target}${pathname}${search}${hash}`)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('i18n redirect error:', err)
    }
  }, [lng])

  useEffect(() => {
    // Persist the current language (or fallback to 'en') in a cookie
    const cookieLng = lng || 'en'
    if (cookies.i18next === cookieLng) return
    try {
      setCookie('i18next', cookieLng, { path: '/' })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('i18next cookie set error:', err)
    }
  }, [lng, cookies.i18next, setCookie])

  return (
    <I18nextProviderReact i18n={i18next}>
      {children}
    </I18nextProviderReact>
  )
}
