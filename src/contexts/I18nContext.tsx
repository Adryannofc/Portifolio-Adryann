import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ptBR } from '../locales/pt-BR';
import { en } from '../locales/en';

export type Locale = 'pt-BR' | 'en';

const TRANSLATIONS = { 'pt-BR': ptBR, en } as const;
export type Translations = typeof ptBR;

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    return saved === 'en' ? 'en' : 'pt-BR';
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem('locale', locale);
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale: setLocaleState, t: TRANSLATIONS[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
